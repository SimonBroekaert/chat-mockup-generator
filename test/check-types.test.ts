import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { checkSource, formatFinding, projectFiles, type Rule } from "../scripts/check-types.ts";

const root = resolve(import.meta.dir, "..");
const fixture = resolve(import.meta.dir, "fixtures/gpt-tried-any.ts");

const countBy = (rules: readonly Rule[], rule: Rule): number => rules.filter((candidate) => candidate === rule).length;

test("the checker catches every escape hatch in the fixture", () => {
    const findings = checkSource(fixture, readFileSync(fixture, "utf8"));
    const rules = findings.map((finding) => finding.rule);

    expect(countBy(rules, "ts-nocheck")).toBe(1);
    expect(countBy(rules, "ts-ignore")).toBe(1);
    expect(countBy(rules, "ts-expect-error")).toBe(2);
    // parameter, return type, array element, angle-bracket assertion
    expect(countBy(rules, "any")).toBe(4);
    expect(countBy(rules, "double-cast")).toBe(2);
    // `!` after a call and a definite-assignment `let later!`
    expect(countBy(rules, "non-null")).toBe(2);

    for (const finding of findings) {
        expect(finding.line).toBeGreaterThan(0);
        expect(finding.column).toBeGreaterThan(0);
        expect(formatFinding(root, finding)).toStartWith("test/fixtures/gpt-tried-any.ts:");
    }
});

test("findings point at the offending line", () => {
    const lines = readFileSync(fixture, "utf8").split("\n");
    const findings = checkSource(fixture, lines.join("\n"));
    const lineOf = (rule: Rule): string => {
        const finding = findings.find((candidate) => candidate.rule === rule);

        return finding ? (lines[finding.line - 1] ?? "") : "";
    };

    expect(lineOf("ts-nocheck")).toBe("// @ts-nocheck");
    expect(lineOf("any")).toContain("function parse(input: any)");
    expect(lineOf("double-cast")).toContain('"42" as unknown as number');
    expect(lineOf("non-null")).toContain('querySelector("#app")!');
});

test("the checker does not cry wolf", () => {
    const clean = `
        // A string literal, a regex, a template literal and a directive with a reason.
        const directive = "@ts-ignore";
        const url = /https?:\\/\\//;
        const note = \`// @ts-nocheck is not a comment in here\`;
        const anything: unknown = directive;
        const once = anything as string;
        const maybe = document.querySelector("#app");
        const sure = maybe ?? document.body;
        /** Has an {@link any} of these ever helped? The word is fine; the type is not. */
        // @ts-expect-error -- the lib typing is wrong here, tracked in issue #12
        const wrong: number = "string";
        export { url, note, once, sure, wrong };
    `;

    expect(checkSource("clean.ts", clean)).toStrictEqual([]);
});

test("the project itself is clean", () => {
    const files = projectFiles([resolve(root, "tsconfig.json"), resolve(root, "tsconfig.tools.json")]);

    expect(files.some((file) => file.endsWith("/src/state.ts"))).toBe(true);
    expect(files.some((file) => file.endsWith("/scripts/check-types.ts"))).toBe(true);
    expect(files.some((file) => file.endsWith("/serve.ts"))).toBe(true);
    expect(files.some((file) => file.includes("/fixtures/"))).toBe(false);
    expect(files.some((file) => file.includes("/node_modules/"))).toBe(false);

    const findings = files.flatMap((file) => checkSource(file, readFileSync(file, "utf8")));

    expect(findings.map((finding) => formatFinding(root, finding))).toStrictEqual([]);
});
