import { test } from "node:test";
import assert from "node:assert/strict";

import {
    NAME_MAX_LENGTH,
    MESSAGE_MAX_LENGTH,
    STORAGE_KEY,
    LANGUAGE_KEY,
    addMinutes,
    createDefaultState,
    loadLanguage,
    loadState,
    normalizeState,
    normalizeTime,
    saveLanguage,
} from "../src/state.js";
import { createTranslator, detectLanguage } from "../src/i18n.js";

function createMemoryStorage(initial = {}) {
    const data = new Map(Object.entries(initial));

    return {
        getItem: (key) => (data.has(key) ? data.get(key) : null),
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: (key) => data.delete(key),
    };
}

test("normalizeTime pads and validates", () => {
    assert.equal(normalizeTime("9:5", "00:00"), "09:05");
    assert.equal(normalizeTime(" 19:32 ", "00:00"), "19:32");
    assert.equal(normalizeTime("24:00", "11:11"), "11:11");
    assert.equal(normalizeTime("12:60", "11:11"), "11:11");
    assert.equal(normalizeTime("nope", "11:11"), "11:11");
    assert.equal(normalizeTime(undefined, "11:11"), "11:11");
    assert.match(normalizeTime("garbage"), /^\d{2}:\d{2}$/, "defaults to the current time");
});

test("addMinutes wraps around midnight in both directions", () => {
    assert.equal(addMinutes("23:58", 5), "00:03");
    assert.equal(addMinutes("00:02", -5), "23:57");
    assert.equal(addMinutes("19:32", 0), "19:32");
    assert.equal(addMinutes("bogus", 1), addMinutes(normalizeTime("bogus"), 1));
});

test("normalizeState repairs corrupt input field by field", () => {
    const state = normalizeState({
        platform: "telegram",
        theme: "sepia",
        includeFrame: "yes",
        otherName: "   ",
        messages: [
            { id: 42, sender: "robot", text: 123, time: "99:99" },
            null,
            { id: "keep", sender: "other", text: "x".repeat(MESSAGE_MAX_LENGTH + 50), time: "1:2" },
        ],
    });

    assert.equal(state.platform, "instagram");
    assert.equal(state.theme, "light");
    assert.equal(state.includeFrame, false);
    assert.equal(state.otherName, "Sophie");
    assert.equal(state.messages.length, 3);
    assert.equal(typeof state.messages[0].id, "string");
    assert.equal(state.messages[0].sender, "me");
    assert.equal(state.messages[0].text, "");
    assert.equal(state.messages[2].id, "keep");
    assert.equal(state.messages[2].text.length, MESSAGE_MAX_LENGTH);
    assert.equal(state.messages[2].time, "01:02");
});

test("normalizeState keeps valid input and truncates the name", () => {
    const longName = "A".repeat(NAME_MAX_LENGTH + 10);
    const state = normalizeState({ platform: "whatsapp", theme: "dark", includeFrame: true, otherName: longName, messages: [] });

    assert.equal(state.platform, "whatsapp");
    assert.equal(state.theme, "dark");
    assert.equal(state.includeFrame, true);
    assert.equal(state.otherName.length, NAME_MAX_LENGTH);
    assert.deepEqual(state.messages, [], "an intentionally empty conversation stays empty");
});

test("the example conversation follows the UI language", () => {
    assert.match(createDefaultState("nl").messages[0].text, /vanavond/);
    assert.match(createDefaultState("en").messages[0].text, /tonight/);
    assert.match(createDefaultState("xx").messages[0].text, /vanavond/, "unknown languages fall back to Dutch");
});

test("loadState survives unparseable and throwing storage", () => {
    assert.equal(loadState(createMemoryStorage({ [STORAGE_KEY]: "{not json" })).platform, "instagram");

    const hostile = {
        getItem() {
            throw new Error("SecurityError");
        },
        setItem() {
            throw new Error("QuotaExceededError");
        },
    };

    assert.equal(loadState(hostile, "en").messages.length, 4);
    assert.equal(loadLanguage(hostile, ["en-GB"]), "en");
    assert.equal(saveLanguage(hostile, "nl"), false);
});

test("language preference is stored apart from the mockup and migrates from old saves", () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify({ language: "en", messages: [] }) });

    assert.equal(loadLanguage(storage, ["nl-BE"]), "en", "a legacy in-document language wins over browser detection");

    saveLanguage(storage, "nl");
    assert.equal(loadLanguage(storage, ["en-US"]), "nl");
    assert.equal(storage.getItem(LANGUAGE_KEY), "nl");
    assert.equal("language" in loadState(storage), false, "language is not part of the document anymore");
});

test("detectLanguage only picks Dutch for Dutch browsers", () => {
    assert.equal(detectLanguage(["nl-NL", "en"]), "nl");
    assert.equal(detectLanguage(["NL"]), "nl");
    assert.equal(detectLanguage(["en-US", "nl"]), "en");
    assert.equal(detectLanguage([]), "en");
});

test("translate interpolates and falls back", () => {
    const en = createTranslator("en");
    const nl = createTranslator("nl");

    assert.equal(en("messages.deleteAria", { index: 3 }), "Delete message 3");
    assert.equal(nl("messages.you"), "Jij");
    assert.equal(en("does.not.exist"), "does.not.exist");
    assert.equal(createTranslator("klingon")("messages.you"), "Jij");
});

test("both translation tables have exactly the same keys", async () => {
    const { translations } = await import("../src/i18n.js");
    const nlKeys = Object.keys(translations.nl).sort();
    const enKeys = Object.keys(translations.en).sort();

    assert.deepEqual(enKeys, nlKeys);
});
