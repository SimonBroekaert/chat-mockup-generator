// @ts-nocheck
//
// This file is meant to be wrong. It is the fixture for scripts/check-types.ts:
// each declaration below trips one of its rules, and test/check-types.test.ts
// asserts that every one of them is reported. It is excluded from
// tsconfig.tools.json, so tsc never sees it. Do not "fix" it.

export function parse(input: any): any {
    return JSON.parse(input);
}

export const sizes: any[] = [];

export const widened = <any>"nope";

export const doubleCast = "42" as unknown as number;

export const doubleCastParenthesised = ("42" as unknown) as number;

export const definitely = document.querySelector("#app")!;

let later!: string;
export { later };

// @ts-ignore
export const ignored: number = "string";

// @ts-expect-error
export const expectedWithoutReason: number = "string";

/* @ts-expect-error */
export const expectedWithoutReasonInBlock: number = "string";
