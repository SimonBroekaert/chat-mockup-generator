import { expect, test } from "bun:test";

import { createTranslator, detectLanguage, isTranslationKey, normalizeLanguage, translations } from "../src/i18n.ts";

test("detectLanguage supports English and defaults to Dutch", () => {
    expect(detectLanguage(["nl-NL", "en"])).toBe("nl");
    expect(detectLanguage(["NL"])).toBe("nl");
    expect(detectLanguage(["en-US", "nl"])).toBe("en");
    expect(detectLanguage([])).toBe("nl");
});

test("normalizeLanguage only lets supported languages through", () => {
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeLanguage("klingon")).toBe("nl");
    expect(normalizeLanguage(undefined, "en")).toBe("en");
});

test("translate interpolates", () => {
    const en = createTranslator("en");
    const nl = createTranslator("nl");

    expect(en("messages.deleteAria", { index: 3 })).toBe("Delete message 3");
    expect(nl("messages.you")).toBe("Jij");
    expect(createTranslator(normalizeLanguage("klingon"))("messages.you")).toBe("Jij");
});

test("isTranslationKey narrows strings read from the DOM", () => {
    expect(isTranslationKey("messages.you")).toBe(true);
    expect(isTranslationKey("does.not.exist")).toBe(false);
    expect(isTranslationKey("toString")).toBe(false);
    expect(isTranslationKey(undefined)).toBe(false);
});

test("both translation tables have exactly the same keys", () => {
    const nlKeys = Object.keys(translations.nl).sort();
    const enKeys = Object.keys(translations.en).sort();

    expect(enKeys).toStrictEqual(nlKeys);
});
