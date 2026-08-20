import { expect, test } from "bun:test";

import { createTranslator, detectLanguage, translations } from "../src/i18n.js";

test("detectLanguage only picks Dutch for Dutch browsers", () => {
    expect(detectLanguage(["nl-NL", "en"])).toBe("nl");
    expect(detectLanguage(["NL"])).toBe("nl");
    expect(detectLanguage(["en-US", "nl"])).toBe("en");
    expect(detectLanguage([])).toBe("en");
});

test("translate interpolates and falls back", () => {
    const en = createTranslator("en");
    const nl = createTranslator("nl");

    expect(en("messages.deleteAria", { index: 3 })).toBe("Delete message 3");
    expect(nl("messages.you")).toBe("Jij");
    expect(en("does.not.exist")).toBe("does.not.exist");
    expect(createTranslator("klingon")("messages.you")).toBe("Jij");
});

test("both translation tables have exactly the same keys", () => {
    const nlKeys = Object.keys(translations.nl).sort();
    const enKeys = Object.keys(translations.en).sort();

    expect(enKeys).toStrictEqual(nlKeys);
});
