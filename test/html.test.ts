import { expect, test } from "bun:test";

import { escapeHtml, html, type SafeHtml } from "../src/html.ts";

// expect(received).toBe(expected) is generic on the received type, so a
// SafeHtml can only be compared with another SafeHtml; widen to string first.
const text = (markup: SafeHtml): string => markup;

test("escapeHtml neutralises the five HTML-significant characters", () => {
    expect(text(escapeHtml(`<b>Ada</b> & "Bob" 'C'`))).toBe("&lt;b&gt;Ada&lt;/b&gt; &amp; &quot;Bob&quot; &#039;C&#039;");
    expect(text(escapeHtml(42))).toBe("42");
    expect(text(escapeHtml(""))).toBe("");
});

test("html interpolates SafeHtml, numbers and literals, drops booleans and nullish values, joins arrays", () => {
    const name = escapeHtml("<Ada>");
    const items: SafeHtml[] = ["a", "b"].map((item) => escapeHtml(item));
    const selected = Math.random() < 2;
    const tone: "error" | "success" = selected ? "error" : "success";

    expect(text(html`<b>${name}</b>`)).toBe("<b>&lt;Ada&gt;</b>");
    expect(text(html`<option ${selected ? "selected" : ""}>${42}</option>`)).toBe("<option selected>42</option>");
    expect(text(html`${false}${null}${undefined}${true}`)).toBe("");
    expect(text(html`<ul>${items.map((item) => html`<li>${item}</li>`)}</ul>`)).toBe("<ul><li>a</li><li>b</li></ul>");
    expect(text(html`<div class="toast ${tone}">`)).toBe('<div class="toast error">');
    expect(text(html`<div class="toast-${tone}">`)).toBe('<div class="toast-error">');
});

test("a plain string cannot reach the html tag", () => {
    const userInput: string = "<script>";
    // The brand is the guard, not the runtime: the tag would happily
    // interpolate this. It does not compile, which is the point.
    // @ts-expect-error -- `string` is not SafeHtml; if this line ever compiles the brand has leaked
    const markup = html`<b>${userInput}</b>`;

    expect(text(markup)).toBe("<b><script></b>");
});
