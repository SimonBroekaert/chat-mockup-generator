import { expect, test } from "bun:test";

import { isTranslationKey } from "../src/i18n.ts";
import { isIconName } from "../src/icons.ts";

const markup = await Bun.file(new URL("../index.html", import.meta.url)).text();

const attributeValues = (pattern: RegExp): string[] => [...markup.matchAll(pattern)].map((match) => match[1] ?? "");

test("the markup loads the TypeScript entry point", () => {
    expect(markup).toContain('<script type="module" src="src/app.ts"></script>');
});

test("every data-i18n key in the markup exists in the translation tables", () => {
    const keys = attributeValues(/\bdata-i18n(?:-aria|-placeholder)?="([^"]+)"/g);

    expect(keys.length).toBeGreaterThan(30);
    expect(keys.filter((key) => !isTranslationKey(key))).toStrictEqual([]);
});

test("every data-icon in the markup names an icon that exists", () => {
    const names = attributeValues(/\bdata-icon="([^"]+)"/g);

    expect(names.length).toBeGreaterThan(10);
    expect(names.filter((name) => !isIconName(name))).toStrictEqual([]);
});
