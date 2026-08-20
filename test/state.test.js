import { expect, test } from "bun:test";

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

function createMemoryStorage(initial = {}) {
    const data = new Map(Object.entries(initial));

    return {
        getItem: (key) => (data.has(key) ? data.get(key) : null),
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: (key) => data.delete(key),
    };
}

test("normalizeTime pads and validates", () => {
    expect(normalizeTime("9:5", "00:00")).toBe("09:05");
    expect(normalizeTime(" 19:32 ", "00:00")).toBe("19:32");
    expect(normalizeTime("24:00", "11:11")).toBe("11:11");
    expect(normalizeTime("12:60", "11:11")).toBe("11:11");
    expect(normalizeTime("nope", "11:11")).toBe("11:11");
    expect(normalizeTime(undefined, "11:11")).toBe("11:11");
    // Without a fallback it defaults to the current time.
    expect(normalizeTime("garbage")).toMatch(/^\d{2}:\d{2}$/);
});

test("addMinutes wraps around midnight in both directions", () => {
    expect(addMinutes("23:58", 5)).toBe("00:03");
    expect(addMinutes("00:02", -5)).toBe("23:57");
    expect(addMinutes("19:32", 0)).toBe("19:32");
    expect(addMinutes("bogus", 1)).toBe(addMinutes(normalizeTime("bogus"), 1));
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

    expect(state.platform).toBe("instagram");
    expect(state.theme).toBe("light");
    expect(state.includeFrame).toBe(false);
    expect(state.otherName).toBe("Sophie");
    expect(state.messages).toHaveLength(3);
    expect(state.messages[0].id).toBeString();
    expect(state.messages[0].sender).toBe("me");
    expect(state.messages[0].text).toBe("");
    expect(state.messages[2].id).toBe("keep");
    expect(state.messages[2].text).toHaveLength(MESSAGE_MAX_LENGTH);
    expect(state.messages[2].time).toBe("01:02");
});

test("normalizeState keeps valid input and truncates the name", () => {
    const longName = "A".repeat(NAME_MAX_LENGTH + 10);
    const state = normalizeState({ platform: "whatsapp", theme: "dark", includeFrame: true, otherName: longName, messages: [] });

    expect(state.platform).toBe("whatsapp");
    expect(state.theme).toBe("dark");
    expect(state.includeFrame).toBe(true);
    expect(state.otherName).toHaveLength(NAME_MAX_LENGTH);
    // An intentionally empty conversation stays empty.
    expect(state.messages).toStrictEqual([]);
});

test("the example conversation follows the UI language", () => {
    expect(createDefaultState("nl").messages[0].text).toMatch(/vanavond/);
    expect(createDefaultState("en").messages[0].text).toMatch(/tonight/);
    // Unknown languages fall back to Dutch.
    expect(createDefaultState("xx").messages[0].text).toMatch(/vanavond/);
});

test("loadState survives unparseable and throwing storage", () => {
    expect(loadState(createMemoryStorage({ [STORAGE_KEY]: "{not json" })).platform).toBe("instagram");

    const hostile = {
        getItem() {
            throw new Error("SecurityError");
        },
        setItem() {
            throw new Error("QuotaExceededError");
        },
    };

    expect(loadState(hostile, "en").messages).toHaveLength(4);
    expect(loadLanguage(hostile, ["en-GB"])).toBe("en");
    expect(saveLanguage(hostile, "nl")).toBe(false);
});

test("language preference is stored apart from the mockup and migrates from old saves", () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify({ language: "en", messages: [] }) });

    // A legacy in-document language wins over browser detection.
    expect(loadLanguage(storage, ["nl-BE"])).toBe("en");

    saveLanguage(storage, "nl");
    expect(loadLanguage(storage, ["en-US"])).toBe("nl");
    expect(storage.getItem(LANGUAGE_KEY)).toBe("nl");
    // Language is not part of the document anymore.
    expect(loadState(storage)).not.toHaveProperty("language");
});
