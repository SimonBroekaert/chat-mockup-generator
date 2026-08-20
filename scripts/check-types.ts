// The rules `tsc --strict` does not enforce.
//
// `strict` only forbids *implicit* any; every explicit escape hatch is still
// open. This walks each file the two tsconfigs cover and fails on:
//
//   any              the `any` keyword in any position (`: any`, `as any`, `any[]`, `<any>`)
//   ts-nocheck       the file-level opt-out directive
//   ts-ignore        the line-level opt-out directive
//   ts-expect-error  the same directive without a written reason
//   double-cast      `x as unknown as T`, and its angle-bracket form
//   non-null         `x!` and `let x!: T`
//
// It is purely syntactic — no type checker is created — so it runs in well
// under a second and has no dependency beyond `typescript` itself. The test
// suite runs it against test/fixtures/gpt-tried-any.ts to prove it catches
// what it claims to, and against the real project (this file included) to
// prove the project is clean. Standalone: `bun run lint`.

import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

export type Rule = "any" | "ts-nocheck" | "ts-ignore" | "ts-expect-error" | "double-cast" | "non-null";

export type Finding = {
    file: string;
    /** 1-based. */
    line: number;
    /** 1-based. */
    column: number;
    rule: Rule;
    message: string;
};

const MESSAGES: Readonly<Record<Rule, string>> = {
    "any": "`any` spotted. The type checker has left the building. Take `unknown` and narrow it, or name the shape you meant.",
    "ts-nocheck": "`@ts-nocheck` turns the whole file back into JavaScript. We just left there.",
    "ts-ignore": "`@ts-ignore` is a blindfold, not a fix. Wrong error? `@ts-expect-error` with a reason. Right error? Fix it.",
    "ts-expect-error": "`@ts-expect-error` without a reason is a TODO with better PR. Say why, right after the directive.",
    "double-cast": "`as unknown as` is two lies that cancel out at compile time and nowhere else. Write a type guard.",
    "non-null": "`!` is a promise to the compiler that nobody checked. Narrow it, or go through must().",
};

const DIRECTIVE = /@ts-(nocheck|ignore|expect-error)\b[ \t]*[:—–-]*[ \t]*(.*)/;

function hasReason(rest: string): boolean {
    return /[A-Za-z]{3,}/.test(rest.replace(/\*\/\s*$/, ""));
}

function isCastToUnknown(node: ts.Expression): boolean {
    let inner = node;

    while (ts.isParenthesizedExpression(inner)) {
        inner = inner.expression;
    }

    return (ts.isAsExpression(inner) || ts.isTypeAssertionExpression(inner)) && inner.type.kind === ts.SyntaxKind.UnknownKeyword;
}

/** Checks one file's text. `fileName` is only used for reporting. */
export function checkSource(fileName: string, text: string): Finding[] {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const findings: Finding[] = [];
    const seenComments = new Set<number>();

    const report = (position: number, rule: Rule): void => {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(position);

        findings.push({ file: fileName, line: line + 1, column: character + 1, rule, message: MESSAGES[rule] });
    };

    // Every comment is leading trivia of the token that follows it (the
    // end-of-file token included), so checking at each node's full start
    // covers the whole file without tokenising it a second time — which would
    // misread `//` inside regex and template literals as comments.
    const checkComments = (position: number): void => {
        for (const range of ts.getLeadingCommentRanges(text, position) ?? []) {
            if (seenComments.has(range.pos)) {
                continue;
            }

            seenComments.add(range.pos);

            const match = DIRECTIVE.exec(text.slice(range.pos, range.end));

            if (!match) {
                continue;
            }

            const directive = match[1];

            if (directive === "nocheck") {
                report(range.pos, "ts-nocheck");
            } else if (directive === "ignore") {
                report(range.pos, "ts-ignore");
            } else if (!hasReason(match[2] ?? "")) {
                report(range.pos, "ts-expect-error");
            }
        }
    };

    const visit = (node: ts.Node): void => {
        checkComments(node.getFullStart());

        if (node.kind === ts.SyntaxKind.AnyKeyword) {
            report(node.getStart(sourceFile), "any");
        } else if (ts.isNonNullExpression(node)) {
            report(node.getStart(sourceFile), "non-null");
        } else if ((ts.isVariableDeclaration(node) || ts.isPropertyDeclaration(node)) && node.exclamationToken) {
            report(node.exclamationToken.getStart(sourceFile), "non-null");
        } else if ((ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) && isCastToUnknown(node.expression)) {
            report(node.getStart(sourceFile), "double-cast");
        }

        for (const child of node.getChildren(sourceFile)) {
            visit(child);
        }
    };

    visit(sourceFile);

    return findings;
}

/** Every file the given tsconfigs include, minus node_modules, sorted and de-duplicated. */
export function projectFiles(configPaths: readonly string[]): string[] {
    const files = new Set<string>();

    for (const configPath of configPaths) {
        const result = ts.readConfigFile(configPath, ts.sys.readFile);

        if (result.error) {
            throw new Error(ts.flattenDiagnosticMessageText(result.error.messageText, "\n"));
        }

        const config: unknown = result.config;
        const parsed = ts.parseJsonConfigFileContent(config, ts.sys, dirname(configPath));

        for (const fileName of parsed.fileNames) {
            if (!fileName.includes("/node_modules/")) {
                files.add(fileName);
            }
        }
    }

    return [...files].sort();
}

export function formatFinding(root: string, finding: Finding): string {
    return `${relative(root, finding.file)}:${finding.line}:${finding.column}  [${finding.rule}]  ${finding.message}`;
}

if (import.meta.main) {
    const root = resolve(import.meta.dir, "..");
    const files = projectFiles(["tsconfig.json", "tsconfig.tools.json"].map((name) => resolve(root, name)));
    const findings = files.flatMap((file) => checkSource(file, ts.sys.readFile(file) ?? ""));

    for (const finding of findings) {
        console.error(formatFinding(root, finding));
    }

    if (findings.length > 0) {
        console.error(`\n${findings.length} escape hatch${findings.length === 1 ? "" : "es"} in ${files.length} files. The type system is not a suggestion.`);
        process.exit(1);
    }

    console.log(`check-types: ${files.length} files, no escape hatches.`);
}
