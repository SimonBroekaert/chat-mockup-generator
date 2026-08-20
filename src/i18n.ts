export const LANGUAGES = ["nl", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "nl";

// Dutch is the fallback language, so its table defines the set of keys. The
// editor itself is English-only (`createTranslator("en")` in app.ts); the
// Dutch table matters for the strings rendered inside the phone mockup.
const nl = {
    "document.title": "Chat Mockup Generator",
    "top.export": "Export PNG",
    "editor.aria": "Mockup settings",
    "platform.aria": "Choose a chat platform",
    "platform.title": "Platform",
    "platform.description": "Choose your conversation style",
    "theme.deviceAria": "Choose a screen theme",
    "theme.deviceTitle": "Screen theme",
    "theme.deviceDescription": "For your mockup",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "appTheme.aria": "Interface theme",
    "appTheme.label": "Interface",
    "appTheme.lightAria": "Light interface",
    "appTheme.darkAria": "Dark interface",
    "mockupLanguage.label": "Screenshot language",
    "mockupLanguage.description": "Changes the language shown inside the phone mockup.",
    "mockupLanguage.aria": "Language used inside the phone mockup",
    "partner.title": "Conversation partner",
    "partner.description": "Who is on the other end?",
    "partner.name": "Name",
    "partner.placeholder": "Your conversation partner's name",
    "messages.title": "Messages",
    "messages.description": "Write who says what",
    "messages.add": "Add message",
    "messages.you": "Jij",
    "messages.senderAria": "Sender for message {index}",
    "messages.timeAria": "Time for message {index}",
    "messages.deleteAria": "Delete message {index}",
    "messages.emptyEditor": "Add your first message to this conversation.",
    "messages.placeholder": "Type your message...",
    "bubbles.title": "Bubbles",
    "bubbles.description": "Text size, spacing and details",
    "bubbles.textSize": "Text size",
    "bubbles.spacing": "Spacing",
    "bubbles.showTimestamps": "Show timestamps",
    "bubbles.showReadReceipts": "Show read receipts",
    "export.title": "Export",
    "export.description": "What goes into the PNG?",
    "export.aria": "Choose what to export",
    "export.appOnly": "App only",
    "export.withFrame": "With iPhone frame",
    "export.size": "Dimensions",
    "export.width": "Width",
    "export.height": "Height",
    "export.hint.app": "The PNG contains only the chat app.",
    "export.hint.frame": "Dimensions only apply to app export.",
    "preview.aria": "Live preview",
    "preview.eyebrow": "Live preview",
    "preview.tip.title": "Everything is saved locally",
    "preview.tip.description": "Your conversations never leave this browser.",
    "preview.export": "Export as PNG",
    "preview.copy": "Copy",
    "preview.copyAria": "Copy the PNG to the clipboard",
    "preview.empty": "Je gesprek verschijnt hier.",
    "toast.exportReady": "Your PNG is ready",
    "toast.exportFailed": "Export failed",
    "toast.copied": "PNG copied to clipboard",
    "toast.copyFailed": "Copy failed",
    "save.saved": "Saved locally",
    "save.saving": "Saving...",
    "save.failed": "Not saved",
    "reset.button": "Reset",
    "reset.confirm": "Reset this chat to the example?",
    "composer.more": "Meer opties",
    "composer.emoji": "Emoji",
    "composer.send": "Bericht versturen",
    "platform.instagram.status": "Actief",
    "platform.instagram.placeholder": "Bericht...",
    "platform.messenger.status": "Actief nu",
    "platform.messenger.placeholder": "Aa",
    "platform.whatsapp.status": "online",
    "platform.whatsapp.placeholder": "Typ een bericht",
};

/** Every string the UI can ask for. A typo, or a key that only exists in one language, is a compile error. */
export type TranslationKey = keyof typeof nl;

export type TranslationTable = Readonly<Record<TranslationKey, string>>;

// Typed against the Dutch keys: a missing or extra English string fails `bun run typecheck`.
const en: TranslationTable = {
    "document.title": "Chat Mockup Generator",
    "top.export": "Export PNG",
    "editor.aria": "Mockup settings",
    "platform.aria": "Choose a chat platform",
    "platform.title": "Platform",
    "platform.description": "Choose your conversation style",
    "theme.deviceAria": "Choose a screen theme",
    "theme.deviceTitle": "Screen theme",
    "theme.deviceDescription": "For your mockup",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "appTheme.aria": "Interface theme",
    "appTheme.label": "Interface",
    "appTheme.lightAria": "Light interface",
    "appTheme.darkAria": "Dark interface",
    "mockupLanguage.label": "Screenshot language",
    "mockupLanguage.description": "Changes the language shown inside the phone mockup.",
    "mockupLanguage.aria": "Language used inside the phone mockup",
    "partner.title": "Conversation partner",
    "partner.description": "Who is on the other end?",
    "partner.name": "Name",
    "partner.placeholder": "Your conversation partner's name",
    "messages.title": "Messages",
    "messages.description": "Write who says what",
    "messages.add": "Add message",
    "messages.you": "You",
    "messages.senderAria": "Sender for message {index}",
    "messages.timeAria": "Time for message {index}",
    "messages.deleteAria": "Delete message {index}",
    "messages.emptyEditor": "Add your first message to this conversation.",
    "messages.placeholder": "Type your message...",
    "bubbles.title": "Bubbles",
    "bubbles.description": "Text size, spacing and details",
    "bubbles.textSize": "Text size",
    "bubbles.spacing": "Spacing",
    "bubbles.showTimestamps": "Show timestamps",
    "bubbles.showReadReceipts": "Show read receipts",
    "export.title": "Export",
    "export.description": "What goes into the PNG?",
    "export.aria": "Choose what to export",
    "export.appOnly": "App only",
    "export.withFrame": "With iPhone frame",
    "export.size": "Dimensions",
    "export.width": "Width",
    "export.height": "Height",
    "export.hint.app": "The PNG contains only the chat app.",
    "export.hint.frame": "Dimensions only apply to app export.",
    "preview.aria": "Live preview",
    "preview.eyebrow": "Live preview",
    "preview.tip.title": "Everything is saved locally",
    "preview.tip.description": "Your conversations never leave this browser.",
    "preview.export": "Export as PNG",
    "preview.copy": "Copy",
    "preview.copyAria": "Copy the PNG to the clipboard",
    "preview.empty": "Your conversation appears here.",
    "toast.exportReady": "Your PNG is ready",
    "toast.exportFailed": "Export failed",
    "toast.copied": "PNG copied to clipboard",
    "toast.copyFailed": "Copy failed",
    "save.saved": "Saved locally",
    "save.saving": "Saving...",
    "save.failed": "Not saved",
    "reset.button": "Reset",
    "reset.confirm": "Reset this chat to the example?",
    "composer.more": "More options",
    "composer.emoji": "Emoji",
    "composer.send": "Send message",
    "platform.instagram.status": "Active",
    "platform.instagram.placeholder": "Message...",
    "platform.messenger.status": "Active now",
    "platform.messenger.placeholder": "Aa",
    "platform.whatsapp.status": "online",
    "platform.whatsapp.placeholder": "Type a message",
};

export const translations: Readonly<Record<Language, TranslationTable>> = { nl, en };

export function isLanguage(value: unknown): value is Language {
    return LANGUAGES.some((language) => language === value);
}

export function normalizeLanguage(value: unknown, fallback: Language = DEFAULT_LANGUAGE): Language {
    return isLanguage(value) ? value : fallback;
}

/** Narrows a string read from the DOM (`data-i18n="..."`) to a key the tables actually contain. */
export function isTranslationKey(value: unknown): value is TranslationKey {
    return typeof value === "string" && Object.hasOwn(nl, value);
}

/** Maps a browser language list ("nl-BE", "en-GB", ...) onto a supported UI language. */
export function detectLanguage(languageTags: readonly string[] = []): Language {
    const preferred = (languageTags[0] ?? "").toLowerCase();

    if (preferred.startsWith("nl")) {
        return "nl";
    }

    if (preferred.startsWith("en")) {
        return "en";
    }

    return DEFAULT_LANGUAGE;
}

export type Replacements = Readonly<Record<string, string | number>>;
export type Translator = (key: TranslationKey, replacements?: Replacements) => string;

/** Returns a translate(key, replacements) function bound to one language. */
export function createTranslator(language: Language): Translator {
    const table = translations[language];

    return (key, replacements = {}) => {
        let value = table[key];

        for (const [name, replacement] of Object.entries(replacements)) {
            value = value.replaceAll(`{${name}}`, String(replacement));
        }

        return value;
    };
}
