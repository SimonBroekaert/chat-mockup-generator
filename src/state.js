import { LANGUAGES, DEFAULT_LANGUAGE, normalizeLanguage, detectLanguage } from "./i18n.js";

export const STORAGE_KEY = "chatframe-mockup-v1";
export const LANGUAGE_KEY = "chatframe-language";
export const APP_THEME_KEY = "chatframe-app-theme";

export const PLATFORMS = Object.freeze(["instagram", "messenger", "whatsapp"]);
export const THEMES = Object.freeze(["light", "dark"]);
export const APP_THEMES = Object.freeze(["light", "dark"]);
export const NAME_MAX_LENGTH = 28;
export const MESSAGE_MAX_LENGTH = 240;
export const DEFAULT_NAME = "Sophie";
export const EXPORT_WIDTH_MIN = 280;
export const EXPORT_WIDTH_MAX = 1600;
export const EXPORT_HEIGHT_MIN = 400;
export const EXPORT_HEIGHT_MAX = 2000;
export const DEFAULT_EXPORT_WIDTH = 402;
export const DEFAULT_EXPORT_HEIGHT = 650;

const exampleConversations = {
    nl: [
        { sender: "other", text: "Hey! Heb je vanavond tijd?", time: "19:32" },
        { sender: "me", text: "Ja, lijkt me gezellig 😊", time: "19:34" },
        { sender: "other", text: "Top. Ik stuur je zo de locatie.", time: "19:35" },
        { sender: "me", text: "Helemaal goed!", time: "19:36" },
    ],
    en: [
        { sender: "other", text: "Hey! Are you free tonight?", time: "19:32" },
        { sender: "me", text: "Yes, sounds fun 😊", time: "19:34" },
        { sender: "other", text: "Great. I'll send you the location in a bit.", time: "19:35" },
        { sender: "me", text: "Perfect!", time: "19:36" },
    ],
};

export function createMessageId() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `message-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function createExampleMessages(language = DEFAULT_LANGUAGE) {
    const example = exampleConversations[language] ?? exampleConversations[DEFAULT_LANGUAGE];

    return example.map((message) => ({ id: createMessageId(), ...message }));
}

/** The mockup document. Screenshot language and editor theme live elsewhere. */
export function createDefaultState(language = DEFAULT_LANGUAGE) {
    return {
        platform: "instagram",
        theme: "light",
        includeFrame: false,
        otherName: DEFAULT_NAME,
        exportWidth: DEFAULT_EXPORT_WIDTH,
        exportHeight: DEFAULT_EXPORT_HEIGHT,
        messages: createExampleMessages(language),
    };
}

const pad = (number) => String(number).padStart(2, "0");

export function formatTime(hours, minutes) {
    return `${pad(hours)}:${pad(minutes)}`;
}

export function getCurrentTime(now = new Date()) {
    return formatTime(now.getHours(), now.getMinutes());
}

/** Coerces "9:5", "09:05", " 9:05 " to "09:05"; anything invalid becomes the fallback. */
export function normalizeTime(value, fallback = getCurrentTime()) {
    const match = /^(\d{1,2}):(\d{1,2})$/.exec(String(value ?? "").trim());

    if (!match) {
        return fallback;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) {
        return fallback;
    }

    return formatTime(hours, minutes);
}

export function normalizeExportDimension(value, fallback, minimum, maximum) {
    const dimension = Number(value);

    if (!Number.isFinite(dimension)) {
        return fallback;
    }

    return Math.min(maximum, Math.max(minimum, Math.round(dimension)));
}

/** Adds (or subtracts) whole minutes, wrapping around midnight. */
export function addMinutes(time, minutes) {
    const [hours, currentMinutes] = normalizeTime(time).split(":").map(Number);
    const total = (((hours * 60 + currentMinutes + Math.trunc(minutes)) % 1440) + 1440) % 1440;

    return formatTime(Math.floor(total / 60), total % 60);
}

function normalizeMessage(message) {
    const source = message && typeof message === "object" ? message : {};

    return {
        id: typeof source.id === "string" && source.id ? source.id : createMessageId(),
        sender: source.sender === "other" ? "other" : "me",
        text: typeof source.text === "string" ? source.text.slice(0, MESSAGE_MAX_LENGTH) : "",
        time: normalizeTime(source.time),
    };
}

/** Turns whatever was in storage into a well-formed state, field by field. */
export function normalizeState(saved, language = DEFAULT_LANGUAGE) {
    const source = saved && typeof saved === "object" ? saved : {};
    const fallback = createDefaultState(language);
    const hasName = typeof source.otherName === "string" && source.otherName.trim().length > 0;

    return {
        platform: PLATFORMS.includes(source.platform) ? source.platform : fallback.platform,
        theme: THEMES.includes(source.theme) ? source.theme : fallback.theme,
        includeFrame: source.includeFrame === true,
        otherName: hasName ? source.otherName.slice(0, NAME_MAX_LENGTH) : fallback.otherName,
        exportWidth: normalizeExportDimension(source.exportWidth, fallback.exportWidth, EXPORT_WIDTH_MIN, EXPORT_WIDTH_MAX),
        exportHeight: normalizeExportDimension(source.exportHeight, fallback.exportHeight, EXPORT_HEIGHT_MIN, EXPORT_HEIGHT_MAX),
        messages: Array.isArray(source.messages) ? source.messages.map(normalizeMessage) : fallback.messages,
    };
}

function readItem(storage, key) {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
}

function writeItem(storage, key, value) {
    try {
        storage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

function readJson(storage, key) {
    const raw = readItem(storage, key);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function loadLanguage(storage, languageTags = []) {
    const stored = readItem(storage, LANGUAGE_KEY);

    if (LANGUAGES.includes(stored)) {
        return stored;
    }

    // Earlier versions kept the UI language inside the mockup document.
    const legacy = readJson(storage, STORAGE_KEY)?.language;

    if (LANGUAGES.includes(legacy)) {
        return legacy;
    }

    return detectLanguage(languageTags);
}

export function saveLanguage(storage, language) {
    return writeItem(storage, LANGUAGE_KEY, normalizeLanguage(language));
}

export function loadAppTheme(storage, fallback = "light") {
    const stored = readItem(storage, APP_THEME_KEY);

    return APP_THEMES.includes(stored) ? stored : normalizeAppTheme(fallback);
}

export function normalizeAppTheme(value, fallback = "light") {
    return APP_THEMES.includes(value) ? value : fallback;
}

export function saveAppTheme(storage, theme) {
    return writeItem(storage, APP_THEME_KEY, normalizeAppTheme(theme));
}

export function loadState(storage, language = DEFAULT_LANGUAGE) {
    const saved = readJson(storage, STORAGE_KEY);

    return saved ? normalizeState(saved, language) : createDefaultState(language);
}

export function saveState(storage, state) {
    return writeItem(storage, STORAGE_KEY, JSON.stringify(state));
}
