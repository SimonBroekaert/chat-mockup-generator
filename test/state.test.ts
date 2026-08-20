import { expect, test } from "bun:test";

import { normalizeLanguage } from "../src/i18n.ts";
import {
    BUBBLE_SPACING_MAX,
    BUBBLE_SPACING_MIN,
    BUBBLE_TEXT_SIZE_MAX,
    BUBBLE_TEXT_SIZE_MIN,
    DEFAULT_BUBBLE_SPACING,
    DEFAULT_BUBBLE_TEXT_SIZE,
    NAME_MAX_LENGTH,
    MESSAGE_MAX_LENGTH,
    STORAGE_KEY,
    LANGUAGE_KEY,
    addMinutes,
    bubbleSizes,
    createDefaultState,
    APP_THEME_KEY,
    isAppTheme,
    isPlatform,
    isTheme,
    loadAppTheme,
    loadLanguage,
    loadState,
    normalizeInteger,
    normalizeState,
    normalizeTime,
    saveAppTheme,
    saveLanguage,
    type StorageLike,
} from "../src/state.ts";

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike & { removeItem(key: string): void } {
    const data = new Map(Object.entries(initial));

    return {
        getItem: (key) => data.get(key) ?? null,
        setItem: (key, value) => {
            data.set(key, String(value));
        },
        removeItem: (key) => {
            data.delete(key);
        },
    };
}

test("normalizeTime pads and validates", () => {
    expect(normalizeTime("9:5", "00:00")).toBe("09:05");
    expect(normalizeTime(" 19:32 ", "00:00")).toBe("19:32");
    expect(normalizeTime("24:00", "11:11")).toBe("11:11");
    expect(normalizeTime("12:60", "11:11")).toBe("11:11");
    expect(normalizeTime("nope", "11:11")).toBe("11:11");
    expect(normalizeTime(undefined, "11:11")).toBe("11:11");
    expect(normalizeTime(1932, "11:11")).toBe("11:11");
    // Without a fallback it defaults to the current time.
    expect(normalizeTime("garbage")).toMatch(/^\d{2}:\d{2}$/);
});

test("addMinutes wraps around midnight in both directions", () => {
    expect(addMinutes("23:58", 5)).toBe("00:03");
    expect(addMinutes("00:02", -5)).toBe("23:57");
    expect(addMinutes("19:32", 0)).toBe("19:32");
    expect(addMinutes("bogus", 1)).toBe(addMinutes(normalizeTime("bogus"), 1));
});

test("normalizeInteger clamps, rounds and falls back", () => {
    expect(normalizeInteger("500", 402, 280, 1600)).toBe(500);
    expect(normalizeInteger(1000.6, 402, 280, 1600)).toBe(1001);
    expect(normalizeInteger(5000, 402, 280, 1600)).toBe(1600);
    expect(normalizeInteger(-1, 402, 280, 1600)).toBe(280);
    expect(normalizeInteger("wide", 402, 280, 1600)).toBe(402);
    expect(normalizeInteger(undefined, 402, 280, 1600)).toBe(402);
    // Number() would read these as 0, 0 and 1 and clamp them to the minimum.
    expect(normalizeInteger(null, 402, 280, 1600)).toBe(402);
    expect(normalizeInteger("", 402, 280, 1600)).toBe(402);
    expect(normalizeInteger(true, 402, 280, 1600)).toBe(402);
});

test("bubbleSizes keeps the caption and the tick in proportion to the text", () => {
    // The default is the original hard-coded design, to the pixel.
    expect(bubbleSizes(DEFAULT_BUBBLE_TEXT_SIZE)).toStrictEqual({ text: 11, caption: 7, tick: 12 });
    expect(bubbleSizes(BUBBLE_TEXT_SIZE_MIN)).toStrictEqual({ text: 8, caption: 5, tick: 9 });
    expect(bubbleSizes(BUBBLE_TEXT_SIZE_MAX)).toStrictEqual({ text: 20, caption: 13, tick: 22 });
});

test("saves from before the Bubbles card get today's look", () => {
    const state = normalizeState({ platform: "whatsapp", messages: [] });

    expect(state.bubbleTextSize).toBe(DEFAULT_BUBBLE_TEXT_SIZE);
    expect(state.bubbleSpacing).toBe(DEFAULT_BUBBLE_SPACING);
    expect(state.showTimestamps).toBe(true);
    expect(state.showReadReceipts).toBe(true);
    expect(createDefaultState()).toMatchObject({ bubbleTextSize: 11, bubbleSpacing: 8, showTimestamps: true, showReadReceipts: true });
});

test("bubble sizes are clamped at both ends and the toggles accept only booleans", () => {
    expect(normalizeState({ bubbleTextSize: 1, bubbleSpacing: -3 })).toMatchObject({ bubbleTextSize: BUBBLE_TEXT_SIZE_MIN, bubbleSpacing: BUBBLE_SPACING_MIN });
    expect(normalizeState({ bubbleTextSize: 99, bubbleSpacing: 100 })).toMatchObject({ bubbleTextSize: BUBBLE_TEXT_SIZE_MAX, bubbleSpacing: BUBBLE_SPACING_MAX });
    expect(normalizeState({ bubbleTextSize: "14", bubbleSpacing: 3.6 })).toMatchObject({ bubbleTextSize: 14, bubbleSpacing: 4 });
    expect(normalizeState({ bubbleTextSize: "large", bubbleSpacing: null })).toMatchObject({
        bubbleTextSize: DEFAULT_BUBBLE_TEXT_SIZE,
        bubbleSpacing: DEFAULT_BUBBLE_SPACING,
    });
    expect(normalizeState({ showTimestamps: false, showReadReceipts: false })).toMatchObject({ showTimestamps: false, showReadReceipts: false });
    expect(normalizeState({ showTimestamps: "no", showReadReceipts: 0 })).toMatchObject({ showTimestamps: true, showReadReceipts: true });
});

test("platform and theme guards accept exactly the known values", () => {
    expect(isPlatform("whatsapp")).toBe(true);
    expect(isPlatform("telegram")).toBe(false);
    expect(isPlatform(undefined)).toBe(false);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("sepia")).toBe(false);
    expect(isAppTheme("dark")).toBe(true);
    expect(isAppTheme("system")).toBe(false);
});

test("the editor theme is a preference stored apart from the mockup", () => {
    const storage = createMemoryStorage();

    expect(loadAppTheme(storage)).toBe("light");
    expect(saveAppTheme(storage, "dark")).toBe(true);
    expect(loadAppTheme(storage)).toBe("dark");
    expect(storage.getItem(APP_THEME_KEY)).toBe("dark");
    expect(loadState(storage)).not.toHaveProperty("appTheme");

    storage.setItem(APP_THEME_KEY, "sepia");
    expect(loadAppTheme(storage)).toBe("light");
    expect(loadAppTheme(storage, "dark")).toBe("dark");
});

test("normalizeState repairs corrupt input field by field", () => {
    const state = normalizeState({
        platform: "telegram",
        theme: "sepia",
        includeFrame: "yes",
        otherName: "   ",
        exportWidth: "huge",
        exportHeight: 99999,
        messages: [
            { id: 42, sender: "robot", text: 123, time: "99:99" },
            null,
            { id: "keep", sender: "other", text: "x".repeat(MESSAGE_MAX_LENGTH + 50), time: "1:2" },
        ],
    });
    const [first, , third] = state.messages;

    expect(state.platform).toBe("instagram");
    expect(state.theme).toBe("light");
    expect(state.includeFrame).toBe(false);
    expect(state.otherName).toBe("Sophie");
    expect(state.exportWidth).toBe(402);
    expect(state.exportHeight).toBe(2000);
    expect(state.messages).toHaveLength(3);
    expect(first?.id).toBeString();
    expect(first?.sender).toBe("me");
    expect(first?.text).toBe("");
    expect(third?.id).toBe("keep");
    expect(third?.text).toHaveLength(MESSAGE_MAX_LENGTH);
    expect(third?.time).toBe("01:02");
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

test("normalizeState tolerates non-object input", () => {
    expect(normalizeState(null).platform).toBe("instagram");
    expect(normalizeState("a string").messages).toHaveLength(4);
    expect(normalizeState(42, "en").messages[0]?.text).toMatch(/tonight/);
});

test("the example conversation follows the UI language", () => {
    expect(createDefaultState("nl").messages[0]?.text).toMatch(/vanavond/);
    expect(createDefaultState("en").messages[0]?.text).toMatch(/tonight/);
    // Unknown languages are normalised to Dutch before they get this far.
    expect(createDefaultState(normalizeLanguage("xx")).messages[0]?.text).toMatch(/vanavond/);
});

test("loadState survives unparseable and throwing storage", () => {
    expect(loadState(createMemoryStorage({ [STORAGE_KEY]: "{not json" })).platform).toBe("instagram");

    const hostile: StorageLike = {
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
