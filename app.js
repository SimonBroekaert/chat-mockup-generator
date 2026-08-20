const storageKey = "chatframe-mockup-v1";

const defaultState = {
    platform: "instagram",
    language: "nl",
    otherName: "Sophie",
    messages: [
        { id: "message-1", sender: "other", text: "Hey! Heb je vanavond tijd?", time: "19:32" },
        { id: "message-2", sender: "me", text: "Ja, lijkt me gezellig 😊", time: "19:34" },
        { id: "message-3", sender: "other", text: "Top. Ik stuur je zo de locatie.", time: "19:35" },
        { id: "message-4", sender: "me", text: "Helemaal goed!", time: "19:36" },
    ],
};

const platforms = {
    instagram: {
        label: "Instagram",
        status: "Actief",
        placeholder: "Bericht...",
        background: "#ffffff",
        bubbleOutgoing: "#6958ea",
        bubbleIncoming: "#f0f1f4",
        textOutgoing: "#ffffff",
        textIncoming: "#25303d",
        accent: "#6958ea",
    },
    messenger: {
        label: "Messenger",
        status: "Actief nu",
        placeholder: "Aa",
        background: "#ffffff",
        bubbleOutgoing: "#0084ff",
        bubbleIncoming: "#e9ebee",
        textOutgoing: "#ffffff",
        textIncoming: "#1d2631",
        accent: "#0084ff",
    },
    whatsapp: {
        label: "WhatsApp",
        status: "online",
        placeholder: "Typ een bericht",
        background: "#efeae2",
        bubbleOutgoing: "#d9fdd3",
        bubbleIncoming: "#ffffff",
        textOutgoing: "#1c2c28",
        textIncoming: "#29332f",
        accent: "#128c7e",
    },
};

const translations = {
    nl: {
        "document.title": "chatframe — Chat mockup generator",
        "language.aria": "Taal van de interface",
        "top.export": "Exporteer PNG",
        "editor.aria": "Mockup instellingen",
        "intro.eyebrow": "Mockup generator",
        "intro.title": "Maak een gesprek dat echt voelt.",
        "intro.description": "Stel je chat samen, bekijk hem live op een iPhone 17 en exporteer alleen de app.",
        "platform.aria": "Kies een chat platform",
        "platform.title": "Platform",
        "platform.description": "Kies de stijl van je gesprek",
        "partner.title": "Gesprekspartner",
        "partner.description": "Wie staat er aan de andere kant?",
        "partner.name": "Naam",
        "messages.title": "Berichten",
        "messages.description": "Schrijf wie wat zegt",
        "messages.add": "Bericht toevoegen",
        "messages.you": "Jij",
        "messages.senderAria": "Afzender voor bericht {index}",
        "messages.timeAria": "Tijdstip voor bericht {index}",
        "messages.deleteAria": "Verwijder bericht {index}",
        "messages.emptyEditor": "Voeg je eerste bericht toe aan dit gesprek.",
        "messages.placeholder": "Typ je bericht...",
        "preview.aria": "Live preview",
        "preview.eyebrow": "Live preview",
        "preview.title": "Zo ziet je chat eruit",
        "preview.callout.frame": "iPhone 17 frame",
        "preview.callout.export": "PNG = alleen de chat-app",
        "preview.tip.title": "Alles wordt lokaal bewaard",
        "preview.tip.description": "Je gesprekken verlaten deze browser niet.",
        "preview.export": "Exporteer chat als PNG",
        "preview.empty": "Je gesprek verschijnt hier.",
        "toast.exportReady": "Je PNG staat klaar",
        "save.saved": "Lokaal opgeslagen",
        "save.saving": "Opslaan...",
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
        "intro.description": "Build your chat, preview it live on an iPhone 17, and export only the app.",
        "platform.aria": "Choose a chat platform",
        "platform.title": "Platform",
        "platform.description": "Choose your conversation style",
        "partner.title": "Conversation partner",
        "partner.description": "Who is on the other end?",
        "partner.name": "Name",
        "messages.title": "Messages",
        "messages.description": "Write who says what",
        "messages.add": "Add message",
        "messages.you": "You",
        "messages.senderAria": "Sender for message {index}",
        "messages.timeAria": "Time for message {index}",
        "messages.deleteAria": "Delete message {index}",
        "messages.emptyEditor": "Add your first message to this conversation.",
        "messages.placeholder": "Type your message...",
        "preview.aria": "Live preview",
        "preview.eyebrow": "Live preview",
        "preview.title": "This is what your chat looks like",
        "preview.callout.frame": "iPhone 17 frame",
        "preview.callout.export": "PNG = chat app only",
        "preview.tip.title": "Everything is saved locally",
        "preview.tip.description": "Your conversations never leave this browser.",
        "preview.export": "Export chat as PNG",
        "preview.empty": "Your conversation appears here.",
        "toast.exportReady": "Your PNG is ready",
        "save.saved": "Saved locally",
        "save.saving": "Saving...",
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

const iconPaths = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.1 2.4 3.1 5.4 3.1 9S14.1 18.6 12 21c-2.1-2.4-3.1-5.4-3.1-9S9.9 5.4 12 3Z"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    download: '<path d="M12 3v11m0 0 4-4m-4 4-4-4M4 19h16"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.6" cy="6.6" r=".8" fill="currentColor" stroke="none"/>',
    messenger: '<path d="M12 3.2c-5.1 0-9 3.6-9 8.4 0 2.6 1.2 4.8 3.3 6.3V21l3.1-1.7c.8.2 1.7.3 2.6.3 5.1 0 9-3.6 9-8.4s-3.9-8-9-8Z"/><path d="m7.2 13.7 3.1-3.3 1.9 1.7 3.7-2  -3.1 3.3-1.9-1.7-3.7 2Z" fill="currentColor" stroke="none"/>',
    whatsapp: '<path d="M20.4 3.6A11.4 11.4 0 0 0 2.5 17.3L1.8 21l3.8-.7A11.4 11.4 0 0 0 20.4 3.6Z"/><path d="M8.2 7.5c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.6.1-.8.5-.3.4-1 1-1 2.5s1 2.9 1.2 3.1c.2.4 2 3.2 4.9 4.3 2.4 1 2.4.7 2.9.7.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.7-.4l-1.6-.8c-.4-.2-.6-.1-.8.2l-.6.8c-.2.2-.4.3-.7.1-1.1-.5-1.9-1.1-2.7-2-.4-.5-.7-1-.8-1.3-.1-.3 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.7-1.7Z" fill="currentColor" stroke="none"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7m-9 0 .8 13h10.4L18 7M10 11v5m4-5v5"/>',
    smartphone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.2"/><path d="M10 5h4M11 18.5h2"/>',
    sparkles: '<path d="m12 3-1.1 4.1L7 8.2l3.9 1.1L12 13l1.1-3.7L17 8.2l-3.9-1.1L12 3ZM19 13l-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13ZM5 14l-.6 1.9L2.5 16.5l1.9.6L5 19l.6-1.9 1.9-.6-1.9-.6L5 14Z"/>',
    back: '<path d="m15 4-8 8 8 8"/>',
    more: '<circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    video: '<path d="M14.5 8.5h-8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2ZM16.5 11l4-2v6l-4-2"/>',
    phone: '<path d="M7 4.5 9.2 4l1.5 3.7-1.9 1.4a13 13 0 0 0 5.1 5.1l1.4-1.9L19 13.8l-.5 2.2a2 2 0 0 1-2.2 1.6A14.4 14.4 0 0 1 5.4 6.7 2 2 0 0 1 7 4.5Z"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="8" cy="9" r="1.3"/><path d="m4 17 4.5-4 3.4 3 2.2-2 5.4 4"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.3c.9 1.2 2 1.8 3.5 1.8s2.6-.6 3.5-1.8M8.5 9.5h.1M15.4 9.5h.1"/>',
    mic: '<rect x="8.5" y="3" width="7" height="12" rx="3.5"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
    send: '<path d="m4 4 16 8-16 8 2.5-8L4 4Zm2.5 8h13"/>',
    signal: '<path d="M4 19v-2M8 19v-5M12 19v-8M16 19V8M20 19V5"/>',
    wifi: '<path d="M3.5 9.5a13 13 0 0 1 17 0M6.5 13a8.5 8.5 0 0 1 11 0M9.7 16.4a4 4 0 0 1 4.6 0M12 20h.01"/>',
    battery: '<rect x="3" y="7" width="17" height="10" rx="2"/><path d="M21 10v4"/><path d="M6 10v4h8v-4Z" fill="currentColor" stroke="none"/>',
    message: '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9.7 9.7 0 0 1-3.6-.7L4 20l1.2-3.4A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>',
    "double-check": '<path d="m3.5 12.5 3 3 5.5-6M10 14l2 2 6.5-7"/>',
};

const state = loadState();
let saveTimer = null;
let toastTimer = null;

function icon(name, className = "") {
    const path = iconPaths[name] ?? iconPaths.message;

    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function cloneDefaultState() {
    return {
        platform: defaultState.platform,
        language: defaultState.language,
        otherName: defaultState.otherName,
        messages: defaultState.messages.map((message) => ({ ...message })),
    };
}

function createMessageId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `message-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function getCurrentTime() {
    return new Intl.DateTimeFormat("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date());
}

function normalizeTime(value, fallback = getCurrentTime()) {
    const match = /^(\d{1,2}):(\d{1,2})$/.exec(String(value));

    if (!match) {
        return fallback;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) {
        return fallback;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function addRandomMinutes(time) {
    const normalizedTime = normalizeTime(time);
    const [hours, minutes] = normalizedTime.split(":").map(Number);
    const randomMinutes = Math.floor(Math.random() * 61);
    const totalMinutes = (hours * 60 + minutes + randomMinutes) % (24 * 60);

    return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function normalizeState(savedState) {
    const normalizedMessages = Array.isArray(savedState.messages)
        ? savedState.messages.map((message, index) => ({
              id: String(message.id ?? createMessageId()),
              sender: message.sender === "other" ? "other" : "me",
              text: typeof message.text === "string" ? message.text : "",
              time: normalizeTime(message.time),
          }))
        : cloneDefaultState().messages;

    return {
        platform: platforms[savedState.platform] ? savedState.platform : defaultState.platform,
        language: savedState.language === "en" ? "en" : "nl",
        otherName:
            typeof savedState.otherName === "string" && savedState.otherName.trim().length > 0
                ? savedState.otherName.slice(0, 28)
                : defaultState.otherName,
        messages: normalizedMessages,
    };
}

function loadState() {
    try {
        const savedValue = window.localStorage.getItem(storageKey);

        if (!savedValue) {
            return cloneDefaultState();
        }

        return normalizeState(JSON.parse(savedValue));
    } catch (error) {
        return cloneDefaultState();
    }
}

function saveState() {
    window.clearTimeout(saveTimer);

    try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
        // The generator remains usable when browser storage is unavailable.
    }

    const status = document.querySelector("#save-status");

    if (status) {
        status.textContent = translate("save.saved");
    }
}

function scheduleSave() {
    const status = document.querySelector("#save-status");

    if (status) {
        status.textContent = translate("save.saving");
    }

    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveState, 220);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function translate(key, replacements = {}) {
    const languageTranslations = translations[state.language] ?? translations.nl;
    let value = languageTranslations[key] ?? translations.nl[key] ?? key;

    Object.entries(replacements).forEach(([replacementKey, replacementValue]) => {
        value = value.replaceAll(`{${replacementKey}}`, String(replacementValue));
    });

    return value;
}

function applyLanguage() {
    document.documentElement.lang = state.language;
    document.title = translate("document.title");

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = translate(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", translate(element.dataset.i18nAria));
    });
}

function getOtherName() {
    return state.otherName.trim() || "Sophie";
}

function getOtherInitial() {
    return getOtherName().charAt(0).toUpperCase();
}

function getPlatform() {
    return platforms[state.platform] ?? platforms.instagram;
}

function getPlatformStatus() {
    return translate(`platform.${state.platform}.status`);
}

function getPlatformPlaceholder() {
    return translate(`platform.${state.platform}.placeholder`);
}

function hydrateStaticIcons() {
    document.querySelectorAll("[data-icon]").forEach((element) => {
        element.innerHTML = icon(element.dataset.icon);
    });
}

function renderPlatformOptions() {
    document.querySelectorAll(".platform-option").forEach((button) => {
        const isActive = button.dataset.platform === state.platform;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
}

function renderMessageEditor() {
    const messageList = document.querySelector("#message-editor-list");
    const messageCount = document.querySelector("#message-count");

    if (!messageList || !messageCount) {
        return;
    }

    messageCount.textContent = String(state.messages.length);

    if (state.messages.length === 0) {
        messageList.innerHTML = `<div class="message-editor-empty">${escapeHtml(translate("messages.emptyEditor"))}</div>`;
        return;
    }

    messageList.innerHTML = state.messages
        .map(
            (message, index) => `
                <article class="message-editor-item" data-message-id="${escapeHtml(message.id)}">
                    <div class="message-editor-top">
                        <span class="message-number">${String(index + 1).padStart(2, "0")}</span>
                        <select class="sender-select" data-sender-select aria-label="${escapeHtml(translate("messages.senderAria", { index: index + 1 }))}">
                            <option value="me" ${message.sender === "me" ? "selected" : ""}>${escapeHtml(translate("messages.you"))}</option>
                            <option value="other" ${message.sender === "other" ? "selected" : ""} data-other-label>${escapeHtml(getOtherName())}</option>
                        </select>
                        <label class="message-time-control" aria-label="${escapeHtml(translate("messages.timeAria", { index: index + 1 }))}">
                            ${icon("clock")}
                            <input class="message-time-input" data-message-time type="time" value="${escapeHtml(normalizeTime(message.time))}" />
                        </label>
                        <button class="message-delete-button" type="button" data-delete-message aria-label="${escapeHtml(translate("messages.deleteAria", { index: index + 1 }))}">
                            ${icon("trash")}
                        </button>
                    </div>
                    <textarea class="message-editor-textarea" data-message-text rows="2" maxlength="240" placeholder="${escapeHtml(translate("messages.placeholder"))}">${escapeHtml(message.text)}</textarea>
                </article>
            `,
        )
        .join("");
}

function renderDeviceStatusBar() {
    return `
        <div class="device-status-bar">
            <span class="device-status-time">9:41</span>
            <span class="device-status-icons">
                <span class="device-status-icon">${icon("signal")}</span>
                <span class="device-status-icon">${icon("wifi")}</span>
                <span class="device-status-icon">${icon("battery")}</span>
            </span>
        </div>
    `;
}

function renderAppHeader() {
    const platformHeaderClass = `${state.platform}-header`;
    const actionIcons = state.platform === "instagram" ? ["video", "more"] : ["video", "phone"];

    return `
        <header class="chat-app-header ${platformHeaderClass}">
            <div class="chat-header-left">
                <span class="chat-header-back">${icon("back")}</span>
                <div class="chat-contact">
                    <span class="chat-avatar avatar-${state.platform}">${escapeHtml(getOtherInitial())}</span>
                    <span class="chat-contact-copy">
                        <strong>${escapeHtml(getOtherName())}</strong>
                        <span>${escapeHtml(getPlatformStatus())}</span>
                    </span>
                </div>
            </div>
            <div class="chat-header-actions">
                ${actionIcons.map((actionIcon) => `<span class="chat-header-action">${icon(actionIcon)}</span>`).join("")}
            </div>
        </header>
    `;
}

function renderMessages() {
    const visibleMessages = state.messages.filter((message) => message.text.trim().length > 0);

    if (visibleMessages.length === 0) {
        return `
            <div class="empty-chat-state">
                ${icon("message")}
                <span>${escapeHtml(translate("preview.empty"))}</span>
            </div>
        `;
    }

    return visibleMessages
            .map(
                (message) => `
                    <div class="message-group ${message.sender === "me" ? "outgoing" : "incoming"}">
                        <div class="message-bubble">${escapeHtml(message.text.trim())}</div>
                        <div class="message-caption">
                            <span>${escapeHtml(message.time)}</span>
                            ${message.sender === "me" ? icon("double-check") : ""}
                        </div>
                    </div>
                `,
            )
            .join("");
}

function renderComposer() {
    return `
        <footer class="chat-composer">
            <button class="composer-icon-button" type="button" aria-label="${escapeHtml(translate("composer.more"))}">${icon("plus")}</button>
            <div class="composer-field">${escapeHtml(getPlatformPlaceholder())}</div>
            <button class="composer-icon-button" type="button" aria-label="${escapeHtml(translate("composer.emoji"))}">${icon("smile")}</button>
            <button class="composer-send" type="button" aria-label="${escapeHtml(translate("composer.send"))}">${icon(state.platform === "whatsapp" || state.platform === "messenger" ? "send" : "mic")}</button>
        </footer>
    `;
}

function renderPreview() {
    const phoneShell = document.querySelector("#phone-shell");
    const phoneScreen = document.querySelector("#phone-screen");

    if (!phoneShell || !phoneScreen) {
        return;
    }

    phoneShell.dataset.platform = state.platform;
    phoneScreen.innerHTML = `
        ${renderDeviceStatusBar()}
        <div class="chat-screen platform-${state.platform}">
            ${renderAppHeader()}
            <div class="chat-messages">
                ${renderMessages()}
            </div>
            ${renderComposer()}
        </div>
    `;
}

function renderAll() {
    const nameInput = document.querySelector("#other-name");
    const nameAvatar = document.querySelector("#name-avatar");
    const languageSelect = document.querySelector("#language-select");

    applyLanguage();
    renderPlatformOptions();
    renderMessageEditor();
    renderPreview();

    if (nameInput) {
        nameInput.value = state.otherName;
    }

    if (nameAvatar) {
        nameAvatar.textContent = getOtherInitial();
    }

    if (languageSelect) {
        languageSelect.value = state.language;
    }

    saveState();
}

function findMessage(messageId) {
    return state.messages.find((message) => message.id === messageId);
}

function addMessage() {
    const previousMessage = state.messages.at(-1);
    const newMessage = {
        id: createMessageId(),
        sender: "me",
        text: "",
        time: addRandomMinutes(previousMessage?.time ?? getCurrentTime()),
    };

    state.messages.push(newMessage);
    renderMessageEditor();
    renderPreview();
    scheduleSave();

    window.requestAnimationFrame(() => {
        const textarea = document.querySelector(`[data-message-id="${CSS.escape(newMessage.id)}"] [data-message-text]`);

        textarea?.focus();
    });
}

function removeMessage(messageId) {
    state.messages = state.messages.filter((message) => message.id !== messageId);
    renderMessageEditor();
    renderPreview();
    scheduleSave();
}

function selectPlatform(platform) {
    if (!platforms[platform] || platform === state.platform) {
        return;
    }

    state.platform = platform;
    renderPlatformOptions();
    renderPreview();
    scheduleSave();
}

function updateOtherName(value) {
    state.otherName = value.slice(0, 28);

    const nameAvatar = document.querySelector("#name-avatar");

    if (nameAvatar) {
        nameAvatar.textContent = getOtherInitial();
    }

    document.querySelectorAll("[data-other-label]").forEach((option) => {
        option.textContent = getOtherName();
    });

    renderPreview();
    scheduleSave();
}

function showToast() {
    const toast = document.querySelector("#export-toast");

    if (!toast) {
        return;
    }

    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function roundedRect(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);

    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + width, y, x + width, y + height, safeRadius);
    context.arcTo(x + width, y + height, x, y + height, safeRadius);
    context.arcTo(x, y + height, x, y, safeRadius);
    context.arcTo(x, y, x + width, y, safeRadius);
    context.closePath();
}

function wrapCanvasText(context, text, maxWidth) {
    const lines = [];

    text.split(/\r?\n/).forEach((paragraph, paragraphIndex, paragraphs) => {
        const words = paragraph.split(/\s+/).filter(Boolean);
        let currentLine = "";

        if (words.length === 0) {
            lines.push("");
        }

        words.forEach((word) => {
            if (context.measureText(word).width > maxWidth) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = "";
                }

                let fragment = "";

                [...word].forEach((character) => {
                    const characterCandidate = `${fragment}${character}`;

                    if (context.measureText(characterCandidate).width > maxWidth && fragment) {
                        lines.push(fragment);
                        fragment = character;
                        return;
                    }

                    fragment = characterCandidate;
                });

                currentLine = fragment;
                return;
            }

            const candidate = currentLine ? `${currentLine} ${word}` : word;

            if (context.measureText(candidate).width <= maxWidth || !currentLine) {
                currentLine = candidate;
                return;
            }

            lines.push(currentLine);
            currentLine = word;
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        if (paragraphIndex < paragraphs.length - 1) {
            lines.push("");
        }
    });

    return lines.length > 0 ? lines : [""];
}

function drawCanvasBack(context) {
    context.save();
    context.beginPath();
    context.moveTo(27, 34);
    context.lineTo(17, 44);
    context.lineTo(27, 54);
    context.strokeStyle = "#27313d";
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    context.restore();
}

function drawCanvasHeaderAction(context, type, x, y, color) {
    context.save();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";

    if (type === "video") {
        roundedRect(context, x, y + 2, 20, 15, 4);
        context.stroke();
        context.beginPath();
        context.moveTo(x + 20, y + 6);
        context.lineTo(x + 27, y + 3);
        context.lineTo(x + 27, y + 16);
        context.lineTo(x + 20, y + 13);
        context.stroke();
    }

    if (type === "phone") {
        context.beginPath();
        context.moveTo(x + 5, y + 3);
        context.lineTo(x + 9, y + 2);
        context.lineTo(x + 12, y + 8);
        context.lineTo(x + 9, y + 10);
        context.quadraticCurveTo(x + 13, y + 15, x + 18, y + 17);
        context.lineTo(x + 20, y + 14);
        context.lineTo(x + 26, y + 17);
        context.lineTo(x + 25, y + 21);
        context.stroke();
    }

    if (type === "more") {
        context.beginPath();
        context.fillStyle = color;
        [5, 13, 21].forEach((offset) => context.arc(x + offset, y + 11, 2, 0, Math.PI * 2));
        context.fill();
    }

    context.restore();
}

function calculateExportLayout(context, visibleMessages, width) {
    const headerHeight = 79;
    const composerHeight = 70;
    const messageFont = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const lineHeight = 22;
    const layouts = [];
    let y = headerHeight + 22;

    context.font = messageFont;

    visibleMessages.forEach((message) => {
        const maxTextWidth = 275;
        const lines = wrapCanvasText(context, message.text.trim(), maxTextWidth);
        const measuredWidth = Math.max(...lines.map((line) => context.measureText(line).width), 38);
        const bubbleWidth = Math.min(315, Math.max(74, measuredWidth + 30));
        const bubbleHeight = lines.length * lineHeight + 27;

        layouts.push({
            message,
            lines,
            x: message.sender === "me" ? width - 16 - bubbleWidth : 16,
            y,
            width: bubbleWidth,
            height: bubbleHeight,
        });

        y += bubbleHeight + 15;
    });

    return {
        headerHeight,
        composerHeight,
        layouts,
        height: Math.max(650, y + composerHeight + 8),
    };
}

function drawExportCanvas(context, width, height, layout) {
    const platform = getPlatform();
    const isWhatsApp = state.platform === "whatsapp";
    const headerColor = isWhatsApp ? "#075e54" : "#ffffff";
    const baseColor = platform.background;

    context.fillStyle = baseColor;
    context.fillRect(0, 0, width, height);

    if (isWhatsApp) {
        context.save();
        context.globalAlpha = 0.16;
        context.fillStyle = "#847967";
        for (let x = 8; x < width; x += 35) {
            for (let y = layout.headerHeight + 15; y < height - layout.composerHeight; y += 35) {
                context.beginPath();
                context.arc(x + ((y / 35) % 2) * 10, y, 1.4, 0, Math.PI * 2);
                context.fill();
            }
        }
        context.restore();
    }

    context.fillStyle = headerColor;
    context.fillRect(0, 0, width, layout.headerHeight);

    context.strokeStyle = isWhatsApp ? "rgba(0, 0, 0, .1)" : "#e5e7eb";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, layout.headerHeight - 0.5);
    context.lineTo(width, layout.headerHeight - 0.5);
    context.stroke();

    drawCanvasBack(context);

    const avatarX = 51;
    const avatarY = 25;
    context.fillStyle = platform.accent;
    context.beginPath();
    context.arc(avatarX, avatarY + 14, 17, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(255,255,255,.22)";
    context.beginPath();
    context.arc(avatarX - 5, avatarY + 8, 5, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.textAlign = "center";
    context.fillText(getOtherInitial(), avatarX, avatarY + 18);
    context.textAlign = "left";

    context.fillStyle = isWhatsApp ? "#ffffff" : "#18222f";
    context.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillText(getOtherName(), 76, 34);
    context.fillStyle = isWhatsApp ? "rgba(255,255,255,.72)" : "#929aa6";
    context.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillText(getPlatformStatus(), 76, 53);

    const actionColor = isWhatsApp ? "#ffffff" : "#202b39";
    drawCanvasHeaderAction(context, "video", width - 107, 31, actionColor);
    drawCanvasHeaderAction(context, state.platform === "instagram" ? "more" : "phone", width - 57, 30, actionColor);

    layout.layouts.forEach(({ message, lines, x, y, width: bubbleWidth, height: bubbleHeight }) => {
        const isOutgoing = message.sender === "me";
        const bubbleColor = isOutgoing ? platform.bubbleOutgoing : platform.bubbleIncoming;
        const textColor = isOutgoing ? platform.textOutgoing : platform.textIncoming;
        const radius = state.platform === "whatsapp" ? 13 : 19;

        context.fillStyle = bubbleColor;
        roundedRect(context, x, y, bubbleWidth, bubbleHeight, radius);
        context.fill();

        context.fillStyle = textColor;
        context.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        lines.forEach((line, index) => {
            context.fillText(line, x + 15, y + 22 + index * 22);
        });

        context.fillStyle = isOutgoing && state.platform === "whatsapp" ? "#719b6e" : isOutgoing ? "rgba(255,255,255,.68)" : "#9da5b0";
        context.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        context.textAlign = "right";
        context.fillText(`${message.time}${isOutgoing ? "  ✓✓" : ""}`, x + bubbleWidth - 11, y + bubbleHeight - 8);
        context.textAlign = "left";
    });

    const composerY = height - layout.composerHeight;
    context.fillStyle = "#ffffff";
    context.fillRect(0, composerY, width, layout.composerHeight);
    context.strokeStyle = isWhatsApp ? "rgba(0,0,0,.1)" : "#e5e7eb";
    context.beginPath();
    context.moveTo(0, composerY + 0.5);
    context.lineTo(width, composerY + 0.5);
    context.stroke();

    context.fillStyle = "#838c98";
    context.font = '500 23px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillText("+", 17, composerY + 43);

    const fieldX = state.platform === "messenger" ? 19 : 48;
    const fieldWidth = state.platform === "messenger" ? width - 78 : width - 112;
    context.fillStyle = state.platform === "whatsapp" ? "#ffffff" : "#fafbfc";
    roundedRect(context, fieldX, composerY + 18, fieldWidth, 36, 18);
    context.fill();
    context.strokeStyle = state.platform === "whatsapp" ? "transparent" : "#e5e8ed";
    context.stroke();
    context.fillStyle = "#a2aab5";
    context.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillText(getPlatformPlaceholder(), fieldX + 14, composerY + 41);

    context.fillStyle = platform.accent;
    context.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    context.fillText(state.platform === "instagram" ? "☺" : "➤", width - 42, composerY + 43);
}

function exportPng() {
    const visibleMessages = state.messages.filter((message) => message.text.trim().length > 0);
    const width = 402;
    const measuringCanvas = document.createElement("canvas");
    const measuringContext = measuringCanvas.getContext("2d");

    if (!measuringContext) {
        return;
    }

    const layout = calculateExportLayout(measuringContext, visibleMessages, width);
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = layout.height * scale;

    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    context.scale(scale, scale);
    drawExportCanvas(context, width, layout.height, layout);

    const download = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `chatframe-${state.platform}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (canvas.toBlob) {
        canvas.toBlob((blob) => {
            if (!blob) {
                download(canvas.toDataURL("image/png"));
                showToast();
                return;
            }

            const url = URL.createObjectURL(blob);
            download(url);
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            showToast();
        }, "image/png");
        return;
    }

    download(canvas.toDataURL("image/png"));
    showToast();
}

function resetState() {
    if (!window.confirm(translate("reset.confirm"))) {
        return;
    }

    const freshState = cloneDefaultState();
    Object.assign(state, freshState);
    renderAll();
}

function bindEvents() {
    document.addEventListener("click", (event) => {
        const platformButton = event.target.closest(".platform-option");

        if (platformButton) {
            selectPlatform(platformButton.dataset.platform);
            return;
        }

        if (event.target.closest("#add-message-button")) {
            addMessage();
            return;
        }

        const deleteButton = event.target.closest("[data-delete-message]");

        if (deleteButton) {
            const messageItem = deleteButton.closest("[data-message-id]");

            if (messageItem) {
                removeMessage(messageItem.dataset.messageId);
            }

            return;
        }

        if (event.target.closest("#export-button") || event.target.closest("#preview-export-button")) {
            exportPng();
            return;
        }

        if (event.target.closest("#reset-button")) {
            resetState();
        }
    });

    document.addEventListener("input", (event) => {
        if (event.target.matches("#other-name")) {
            updateOtherName(event.target.value);
            return;
        }

        if (!event.target.matches("[data-message-text]")) {
            return;
        }

        const messageItem = event.target.closest("[data-message-id]");
        const message = messageItem ? findMessage(messageItem.dataset.messageId) : null;

        if (!message) {
            return;
        }

        message.text = event.target.value;
        renderPreview();
        scheduleSave();
    });

    document.addEventListener("change", (event) => {
        if (event.target.matches("[data-sender-select]")) {
            const messageItem = event.target.closest("[data-message-id]");
            const message = messageItem ? findMessage(messageItem.dataset.messageId) : null;

            if (message) {
                message.sender = event.target.value === "other" ? "other" : "me";
                renderPreview();
                scheduleSave();
            }

            return;
        }

        if (event.target.matches("[data-message-time]")) {
            const messageItem = event.target.closest("[data-message-id]");
            const message = messageItem ? findMessage(messageItem.dataset.messageId) : null;

            if (message) {
                message.time = normalizeTime(event.target.value, message.time);
                event.target.value = message.time;
                renderPreview();
                scheduleSave();
            }

            return;
        }

        if (event.target.matches("#language-select")) {
            state.language = event.target.value === "en" ? "en" : "nl";
            renderAll();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    hydrateStaticIcons();
    bindEvents();
    renderAll();
});
