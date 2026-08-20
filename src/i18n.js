export const LANGUAGES = Object.freeze(["nl", "en"]);
export const DEFAULT_LANGUAGE = "nl";

export const translations = {
    nl: {
        "document.title": "chatframe — Chat mockup generator",
        "language.aria": "Taal van de interface",
        "top.export": "Exporteer PNG",
        "editor.aria": "Mockup instellingen",
        "intro.eyebrow": "Mockup generator",
        "intro.title": "Maak een gesprek dat echt voelt.",
        "intro.description": "Stel je chat samen, bekijk hem live op een iPhone 17 en exporteer hem als PNG.",
        "platform.aria": "Kies een chat platform",
        "platform.title": "Platform",
        "platform.description": "Kies de stijl van je gesprek",
        "theme.aria": "Kies een thema",
        "theme.light": "Licht",
        "theme.dark": "Donker",
        "partner.title": "Gesprekspartner",
        "partner.description": "Wie staat er aan de andere kant?",
        "partner.name": "Naam",
        "partner.placeholder": "Naam van je gesprekspartner",
        "messages.title": "Berichten",
        "messages.description": "Schrijf wie wat zegt",
        "messages.add": "Bericht toevoegen",
        "messages.you": "Jij",
        "messages.senderAria": "Afzender voor bericht {index}",
        "messages.timeAria": "Tijdstip voor bericht {index}",
        "messages.deleteAria": "Verwijder bericht {index}",
        "messages.emptyEditor": "Voeg je eerste bericht toe aan dit gesprek.",
        "messages.placeholder": "Typ je bericht...",
        "export.title": "Export",
        "export.description": "Wat komt er in de PNG?",
        "export.aria": "Kies wat je exporteert",
        "export.appOnly": "Alleen de app",
        "export.withFrame": "Met iPhone-frame",
        "export.size": "Afmetingen",
        "export.width": "Breedte",
        "export.height": "Hoogte",
        "export.hint.app": "De PNG bevat alleen de chat-app.",
        "export.hint.frame": "Afmetingen gelden alleen voor de app-export.",
        "preview.aria": "Live preview",
        "preview.eyebrow": "Live preview",
        "preview.title": "Zo ziet je chat eruit",
        "preview.callout.frame": "iPhone 17 frame",
        "preview.callout.export.app": "PNG = alleen de chat-app",
        "preview.callout.export.frame": "PNG = app + iPhone-frame",
        "preview.tip.title": "Alles wordt lokaal bewaard",
        "preview.tip.description": "Je gesprekken verlaten deze browser niet.",
        "preview.export": "Exporteer als PNG",
        "preview.copy": "Kopieer",
        "preview.copyAria": "Kopieer de PNG naar het klembord",
        "preview.empty": "Je gesprek verschijnt hier.",
        "toast.exportReady": "Je PNG staat klaar",
        "toast.exportFailed": "Exporteren is mislukt",
        "toast.copied": "PNG gekopieerd naar het klembord",
        "toast.copyFailed": "Kopiëren is mislukt",
        "save.saved": "Lokaal opgeslagen",
        "save.saving": "Opslaan...",
        "save.failed": "Niet opgeslagen",
        "reset.button": "Reset",
        "reset.confirm": "Wil je deze chat terugzetten naar het voorbeeld?",
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
        "document.title": "chatframe — Chat mockup generator",
        "language.aria": "Interface language",
        "top.export": "Export PNG",
        "editor.aria": "Mockup settings",
        "intro.eyebrow": "Mockup generator",
        "intro.title": "Make a conversation that feels real.",
        "intro.description": "Build your chat, preview it live on an iPhone 17, and export it as a PNG.",
        "platform.aria": "Choose a chat platform",
        "platform.title": "Platform",
        "platform.description": "Choose your conversation style",
        "theme.aria": "Choose a theme",
        "theme.light": "Light",
        "theme.dark": "Dark",
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
        "preview.title": "This is what your chat looks like",
        "preview.callout.frame": "iPhone 17 frame",
        "preview.callout.export.app": "PNG = chat app only",
        "preview.callout.export.frame": "PNG = app + iPhone frame",
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
