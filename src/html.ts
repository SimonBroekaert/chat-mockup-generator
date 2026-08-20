// Markup that may reach innerHTML, and the only ways to make it.
//
// `SafeHtml` is a branded string. A plain `string` is not assignable to it,
// so a name or a message cannot land in the DOM without going through
// escapeHtml(). The html`` tag assembles SafeHtml from pieces that are
// SafeHtml themselves, numbers, booleans and nullish values (dropped), arrays
// of SafeHtml (joined), or string *literals* — `"selected"`, `on ? "a" : "b"`,
// `avatar-${platform}` — which the code wrote and which therefore cannot
// carry input. A value typed `string` is rejected at the call site: escape it.

import type { Brand } from "./types.ts";

export type SafeHtml = Brand<string, "SafeHtml">;

/**
 * True for string types with a finite set of values: "a", "a" | "b",
 * `x-${"a" | "b"}`. False for `string` and for template types with a
 * `${string}` hole, which is what `${`x-${input}`}` would smuggle in.
 */
type IsLiteralString<S extends string> = string extends S
    ? false
    : S extends `${infer Head}${infer Rest}`
      ? string extends Head
          ? false
          : IsLiteralString<Rest>
      : true;

/** What one `${...}` hole in an html`` template may hold. Anything else resolves to `never` and fails to compile. */
export type HtmlValue<V> = V extends SafeHtml
    ? V
    : V extends string
      ? IsLiteralString<V> extends true
          ? V
          : never
      : V extends number | boolean | null | undefined | readonly SafeHtml[]
        ? V
        : never;

type HtmlValues<V extends readonly unknown[]> = { [K in keyof V]: HtmlValue<V[K]> };

/**
 * The one place a string becomes SafeHtml. Only for markup the code itself
 * wrote, such as the icon tables — never for anything derived from input.
 */
export function trustedHtml(markup: string): SafeHtml {
    return markup as SafeHtml;
}

export function escapeHtml(value: string | number): SafeHtml {
    return trustedHtml(
        String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;"),
    );
}

function renderValue(value: unknown): string {
    if (value === null || value === undefined || typeof value === "boolean") {
        return "";
    }

    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(renderValue).join("");
    }

    throw new TypeError(`html\`\` cannot render a ${typeof value}`);
}

/** Tagged template that produces SafeHtml. See the file comment for what the holes accept. */
export function html<const V extends readonly unknown[]>(strings: TemplateStringsArray, ...values: V & HtmlValues<V>): SafeHtml {
    let markup = strings[0] ?? "";

    values.forEach((value, index) => {
        markup += renderValue(value) + (strings[index + 1] ?? "");
    });

    return trustedHtml(markup);
}

/** The only sanctioned way to assign innerHTML. */
export function setHtml(element: Element, markup: SafeHtml): void {
    element.innerHTML = markup;
}
