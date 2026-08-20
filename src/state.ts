import { DEFAULT_LANGUAGE, detectLanguage, isLanguage, type Language } from "./i18n.ts";

export const STORAGE_KEY = "chatframe-mockup-v1";
export const LANGUAGE_KEY = "chatframe-language";
export const APP_THEME_KEY = "chatframe-app-theme";

export const PLATFORMS = ["instagram", "messenger", "whatsapp"] as const;
/** Theme of the phone screen inside the mockup. */
export const THEMES = ["light", "dark"] as const;
/** Theme of the editor around it — a UI preference, stored apart from the document. */
export const APP_THEMES = ["light", "dark"] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Theme = (typeof THEMES)[number];
export type AppTheme = (typeof APP_THEMES)[number];
export type Sender = "me" | "other";

export const NAME_MAX_LENGTH = 28;
export const MESSAGE_MAX_LENGTH = 240;
export const DEFAULT_NAME = "Sophie";
export const EXPORT_WIDTH_MIN = 280;
export const EXPORT_WIDTH_MAX = 1600;
export const EXPORT_HEIGHT_MIN = 400;
export const EXPORT_HEIGHT_MAX = 2000;
export const DEFAULT_EXPORT_WIDTH = 402;
export const DEFAULT_EXPORT_HEIGHT = 650;

export type Message = {
    id: string;
    sender: Sender;
    text: string;
    /** Always "HH:MM" once it has been through normalizeTime(). */
    time: string;
};

/** The mockup document. UI preferences (mockup language, editor theme) deliberately live elsewhere. */
export type MockupState = {
    platform: Platform;
    theme: Theme;
    includeFrame: boolean;
    otherName: string;
    exportWidth: number;
    exportHeight: number;
    messages: Message[];
};

/** The slice of `localStorage` this module uses; tests pass an in-memory stand-in. */
export type StorageLike = {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
};

type ExampleMessage = Omit<Message, "id">;

const exampleConversations: Readonly<Record<Language, readonly ExampleMessage[]>> = {
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

export function createMessageId(): string {
    // randomUUID() only exists in secure contexts; `HOST=0.0.0.0` over plain HTTP is not one.
    if (typeof globalThis.crypto?.randomUUID === "function") {
        return globalThis.crypto.randomUUID();
    }

    return `message-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function createExampleMessages(language: Language = DEFAULT_LANGUAGE): Message[] {
    return exampleConversations[language].map((message) => ({ id: createMessageId(), ...message }));
}

export function createDefaultState(language: Language = DEFAULT_LANGUAGE): MockupState {
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

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

type Clock = { hours: number; minutes: number };

const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})$/;

const pad = (number: number): string => String(number).padStart(2, "0");

export function formatTime(hours: number, minutes: number): string {
    return `${pad(hours)}:${pad(minutes)}`;
}

function clockOf(date: Date): Clock {
    return { hours: date.getHours(), minutes: date.getMinutes() };
}

/** "9:5", "09:05", " 9:05 " all parse; anything else, including "24:00", is null. */
function parseTime(value: unknown): Clock | null {
    const match = TIME_PATTERN.exec(String(value ?? "").trim());
    const hours = Number(match?.[1]);
    const minutes = Number(match?.[2]);

    if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours > 23 || minutes > 59) {
        return null;
    }

    return { hours, minutes };
}

export function getCurrentTime(now: Date = new Date()): string {
    const { hours, minutes } = clockOf(now);

    return formatTime(hours, minutes);
}

/** Coerces "9:5", "09:05", " 9:05 " to "09:05"; anything invalid becomes the fallback. */
export function normalizeTime(value: unknown, fallback: string = getCurrentTime()): string {
    const parsed = parseTime(value);

    return parsed ? formatTime(parsed.hours, parsed.minutes) : fallback;
}

/** Adds (or subtracts) whole minutes, wrapping around midnight. Invalid input counts from now. */
export function addMinutes(time: string, minutes: number): string {
    const current = parseTime(time) ?? clockOf(new Date());
    const total = (((current.hours * 60 + current.minutes + Math.trunc(minutes)) % 1440) + 1440) % 1440;

    return formatTime(Math.floor(total / 60), total % 60);
}

export function normalizeExportDimension(value: unknown, fallback: number, minimum: number, maximum: number): number {
    const dimension = Number(value);

    if (!Number.isFinite(dimension)) {
        return fallback;
    }

    return Math.min(maximum, Math.max(minimum, Math.round(dimension)));
}

// ---------------------------------------------------------------------------
// Normalisation — the only place untrusted shapes (storage, old versions) are
// turned into typed ones. Everything below reads with `source["key"]`, which
// yields `unknown`, and narrows field by field.
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isArray(value: unknown): value is readonly unknown[] {
    return Array.isArray(value);
}

function isOneOf<const T extends readonly string[]>(options: T, value: unknown): value is T[number] {
    return options.some((option) => option === value);
}

export function isPlatform(value: unknown): value is Platform {
    return isOneOf(PLATFORMS, value);
}

export function isTheme(value: unknown): value is Theme {
    return isOneOf(THEMES, value);
}

export function isAppTheme(value: unknown): value is AppTheme {
    return isOneOf(APP_THEMES, value);
}

function normalizeMessage(message: unknown): Message {
    const source: Record<string, unknown> = isRecord(message) ? message : {};
    const id = source["id"];
    const text = source["text"];

    return {
        id: typeof id === "string" && id ? id : createMessageId(),
        sender: source["sender"] === "other" ? "other" : "me",
        text: typeof text === "string" ? text.slice(0, MESSAGE_MAX_LENGTH) : "",
        time: normalizeTime(source["time"]),
    };
}

/** Turns whatever was in storage into a well-formed state, field by field. */
export function normalizeState(saved: unknown, language: Language = DEFAULT_LANGUAGE): MockupState {
    const source: Record<string, unknown> = isRecord(saved) ? saved : {};
    const fallback = createDefaultState(language);
    const platform = source["platform"];
    const theme = source["theme"];
    const otherName = source["otherName"];
    const messages = source["messages"];
    const hasName = typeof otherName === "string" && otherName.trim().length > 0;

    return {
        platform: isPlatform(platform) ? platform : fallback.platform,
        theme: isTheme(theme) ? theme : fallback.theme,
        includeFrame: source["includeFrame"] === true,
        otherName: hasName ? otherName.slice(0, NAME_MAX_LENGTH) : fallback.otherName,
        exportWidth: normalizeExportDimension(source["exportWidth"], fallback.exportWidth, EXPORT_WIDTH_MIN, EXPORT_WIDTH_MAX),
        exportHeight: normalizeExportDimension(source["exportHeight"], fallback.exportHeight, EXPORT_HEIGHT_MIN, EXPORT_HEIGHT_MAX),
        messages: isArray(messages) ? messages.map(normalizeMessage) : fallback.messages,
    };
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

function readItem(storage: StorageLike, key: string): string | null {
    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
}

function writeItem(storage: StorageLike, key: string, value: string): boolean {
    try {
        storage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
}

function parseJson(raw: string): unknown {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function readJson(storage: StorageLike, key: string): unknown {
    const raw = readItem(storage, key);

    return raw ? parseJson(raw) : null;
}

export function loadLanguage(storage: StorageLike, languageTags: readonly string[] = []): Language {
    const stored = readItem(storage, LANGUAGE_KEY);

    if (isLanguage(stored)) {
        return stored;
    }

    // Earlier versions kept the UI language inside the mockup document.
    const legacy = readJson(storage, STORAGE_KEY);
    const legacyLanguage = isRecord(legacy) ? legacy["language"] : undefined;

    if (isLanguage(legacyLanguage)) {
        return legacyLanguage;
    }

    return detectLanguage(languageTags);
}

export function saveLanguage(storage: StorageLike, language: Language): boolean {
    return writeItem(storage, LANGUAGE_KEY, language);
}

export function normalizeAppTheme(value: unknown, fallback: AppTheme = "light"): AppTheme {
    return isAppTheme(value) ? value : fallback;
}

export function loadAppTheme(storage: StorageLike, fallback: AppTheme = "light"): AppTheme {
    return normalizeAppTheme(readItem(storage, APP_THEME_KEY), fallback);
}

export function saveAppTheme(storage: StorageLike, theme: AppTheme): boolean {
    return writeItem(storage, APP_THEME_KEY, theme);
}

export function loadState(storage: StorageLike, language: Language = DEFAULT_LANGUAGE): MockupState {
    const saved = readJson(storage, STORAGE_KEY);

    return saved ? normalizeState(saved, language) : createDefaultState(language);
}

export function saveState(storage: StorageLike, state: MockupState): boolean {
    return writeItem(storage, STORAGE_KEY, JSON.stringify(state));
}
