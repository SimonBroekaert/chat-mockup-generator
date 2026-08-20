export const LANGUAGES = Object.freeze(["nl", "en"]);
export const DEFAULT_LANGUAGE = "nl";

export const translations = {
    nl: {
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
    },
    en: {
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
    },
};

export function normalizeLanguage(value, fallback = DEFAULT_LANGUAGE) {
    return LANGUAGES.includes(value) ? value : fallback;
}

/** Maps a browser language list ("nl-BE", "en-GB", ...) onto a supported UI language. */
export function detectLanguage(languageTags = []) {
    const preferred = String(languageTags[0] ?? "").toLowerCase();

    if (preferred.startsWith("nl")) {
        return "nl";
    }

    if (preferred.startsWith("en")) {
        return "en";
    }

    return DEFAULT_LANGUAGE;
}

/**
 * Returns a translate(key, replacements) function bound to one language.
 * Missing keys fall back to Dutch, then to the key itself, so a typo shows up
 * in the UI instead of rendering nothing.
 */
export function createTranslator(language) {
    const table = translations[normalizeLanguage(language)];

    return function translate(key, replacements = {}) {
        let value = table[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;

        for (const [name, replacement] of Object.entries(replacements)) {
            value = value.replaceAll(`{${name}}`, String(replacement));
        }

        return value;
    };
}
