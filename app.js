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

const lucideIconNames = {
    globe: "globe",
    "chevron-down": "chevron-down",
    download: "download",
    instagram: "camera",
    messenger: "message-circle",
    whatsapp: "phone",
    "check-circle": "circle-check",
    clock: "clock-3",
    plus: "plus",
    trash: "trash-2",
    smartphone: "smartphone",
    sparkles: "sparkles",
    back: "chevron-left",
    more: "ellipsis",
    video: "video",
    phone: "phone",
    image: "image",
    smile: "smile",
    mic: "mic",
    send: "send",
    signal: "signal",
    wifi: "wifi",
    battery: "battery",
    message: "message-square",
    "double-check": "check-check",
};

const state = loadState();
let saveTimer = null;
let toastTimer = null;

function icon(name, className = "") {
    const iconName = lucideIconNames[name] ?? lucideIconNames.message;

    return `<i class="icon ${className}" data-lucide="${iconName}" aria-hidden="true"></i>`;
}

function hydrateLucideIcons() {
    if (!window.lucide) {
        return;
    }

    window.lucide.createIcons({ icons: window.lucide.icons });
}

function toLucideIconKey(iconName) {
    return iconName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function getLucideIconMarkup(name, color) {
    const iconName = lucideIconNames[name] ?? lucideIconNames.message;
    const iconNode = window.lucide?.icons?.[toLucideIconKey(iconName)];

    if (!iconNode) {
        return "";
    }

    const children = iconNode
        .map(([tagName, attributes]) => {
            const serializedAttributes = Object.entries(attributes)
                .map(([attributeName, attributeValue]) => `${attributeName}="${attributeValue}"`)
                .join(" ");

            return `<${tagName} ${serializedAttributes}></${tagName}>`;
        })
        .join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

function loadLucideIcon(name, color) {
    return new Promise((resolve) => {
        const markup = getLucideIconMarkup(name, color);

        if (!markup) {
            resolve(null);
            return;
        }

        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    });
}

function drawLucideIcon(context, image, x, y, width, height) {
    if (image) {
        context.drawImage(image, x, y, width, height);
    }
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

    hydrateLucideIcons();
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

    hydrateLucideIcons();
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

    hydrateLucideIcons();
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

async function loadExportIcons() {
    const isWhatsApp = state.platform === "whatsapp";
    const headerColor = isWhatsApp ? "#ffffff" : "#202b39";
    const composerAction = state.platform === "instagram" ? "mic" : "send";
    const action = state.platform === "instagram" ? "more" : "phone";
    const iconsToLoad = {
        back: ["back", headerColor],
        video: ["video", headerColor],
        action: [action, headerColor],
        doubleCheck: ["double-check", isWhatsApp ? "#719b6e" : "#ffffff"],
        plus: ["plus", "#838c98"],
        smile: ["smile", "#838c98"],
        composerAction: [composerAction, getPlatform().accent],
    };

    const loadedIcons = await Promise.all(
        Object.entries(iconsToLoad).map(async ([key, [name, color]]) => [key, await loadLucideIcon(name, color)]),
    );

    return Object.fromEntries(loadedIcons);
}

function drawExportCanvas(context, width, height, layout, exportIcons) {
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

    drawLucideIcon(context, exportIcons.back, 14, 32, 24, 24);

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

    drawLucideIcon(context, exportIcons.video, width - 111, 31, 24, 24);
    drawLucideIcon(context, exportIcons.action, width - 61, 31, 24, 24);

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
        context.fillText(message.time, x + bubbleWidth - (isOutgoing ? 31 : 11), y + bubbleHeight - 8);
        context.textAlign = "left";

        if (isOutgoing) {
            drawLucideIcon(context, exportIcons.doubleCheck, x + bubbleWidth - 27, y + bubbleHeight - 20, 17, 17);
        }
    });

    const composerY = height - layout.composerHeight;
    context.fillStyle = "#ffffff";
    context.fillRect(0, composerY, width, layout.composerHeight);
    context.strokeStyle = isWhatsApp ? "rgba(0,0,0,.1)" : "#e5e7eb";
    context.beginPath();
    context.moveTo(0, composerY + 0.5);
    context.lineTo(width, composerY + 0.5);
    context.stroke();

    if (state.platform !== "messenger") {
        drawLucideIcon(context, exportIcons.plus, 14, composerY + 25, 24, 24);
    }

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

    drawLucideIcon(context, exportIcons.smile, width - 81, composerY + 25, 20, 20);
    drawLucideIcon(context, exportIcons.composerAction, width - 48, composerY + 24, 23, 23);
}

async function exportPng() {
    const visibleMessages = state.messages.filter((message) => message.text.trim().length > 0);
    const width = 402;
    const measuringCanvas = document.createElement("canvas");
    const measuringContext = measuringCanvas.getContext("2d");

    if (!measuringContext) {
        return;
    }

    const layout = calculateExportLayout(measuringContext, visibleMessages, width);
    const exportIcons = await loadExportIcons();
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = layout.height * scale;

    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    context.scale(scale, scale);
    drawExportCanvas(context, width, layout.height, layout, exportIcons);

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
