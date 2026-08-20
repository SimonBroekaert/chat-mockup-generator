import { icon, hydrateIcons } from "./icons.js";
import { createTranslator, normalizeLanguage } from "./i18n.js";
import {
    PLATFORMS,
    THEMES,
    NAME_MAX_LENGTH,
    MESSAGE_MAX_LENGTH,
    DEFAULT_NAME,
    EXPORT_WIDTH_MIN,
    EXPORT_WIDTH_MAX,
    EXPORT_HEIGHT_MIN,
    EXPORT_HEIGHT_MAX,
    createDefaultState,
    createMessageId,
    addMinutes,
    getCurrentTime,
    normalizeTime,
    normalizeExportDimension,
    loadLanguage,
    saveLanguage,
    loadState,
    saveState,
} from "./state.js";
import { renderExportBlob, exportFileName, downloadBlob, canCopyImages, copyBlobToClipboard } from "./export.js";

const SAVE_DELAY = 220;
const TOAST_DURATION = 2800;

const storage = getStorage();

let language = loadLanguage(storage);
let t = createTranslator(language);
const state = loadState(storage, language);

let saveTimer = null;
let toastTimer = null;
let exportInFlight = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function getStorage() {
    try {
        return window.localStorage;
    } catch {
        // Sandboxed iframes and strict privacy modes throw on access; keep the app usable without persistence.
        return {
            getItem: () => null,
            setItem() {
                throw new Error("Storage unavailable");
            },
        };
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const getOtherName = () => state.otherName.trim() || DEFAULT_NAME;
const getOtherInitial = () => getOtherName().charAt(0).toUpperCase();
const getVisibleMessages = () => state.messages.filter((message) => message.text.trim().length > 0);

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function setSaveStatus(key) {
    const status = $("#save-status");

    if (status) {
        status.textContent = t(key);
        status.dataset.i18n = key;
    }
}

function persist() {
    window.clearTimeout(saveTimer);
    setSaveStatus(saveState(storage, state) ? "save.saved" : "save.failed");
}

function scheduleSave() {
    setSaveStatus("save.saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, SAVE_DELAY);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function applyLanguage() {
    document.documentElement.lang = language;
    document.title = t("document.title");

    $$("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    $$("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });

    $$("[data-i18n-placeholder]").forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    const languageSelect = $("#language-select");

    if (languageSelect) {
        languageSelect.value = language;
    }
}

/** Marks one option of a radio-style button group as selected. */
function renderChoice(groupSelector, dataKey, value) {
    $$(`${groupSelector} [data-${dataKey}]`).forEach((button) => {
        const isActive = button.dataset[dataKey] === value;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-checked", String(isActive));
    });
}

function renderControls() {
    renderChoice("#platform-grid", "platform", state.platform);
    renderChoice("#theme-control", "theme", state.theme);
    renderChoice("#export-control", "export", state.includeFrame ? "frame" : "app");

    const callout = $("#export-callout");

    if (callout) {
        callout.textContent = t(state.includeFrame ? "preview.callout.export.frame" : "preview.callout.export.app");
    }

    const exportHint = $("#export-size-hint");

    if (exportHint) {
        const hintKey = state.includeFrame ? "export.hint.frame" : "export.hint.app";

        exportHint.textContent = t(hintKey);
        exportHint.dataset.i18n = hintKey;
    }

    const exportWidth = $("#export-width");
    const exportHeight = $("#export-height");

    if (exportWidth && document.activeElement !== exportWidth) {
        exportWidth.value = String(state.exportWidth);
    }

    if (exportHeight && document.activeElement !== exportHeight) {
        exportHeight.value = String(state.exportHeight);
    }

    [exportWidth, exportHeight].forEach((input) => {
        if (input) {
            input.disabled = state.includeFrame;
        }
    });
}

function renderPartner() {
    const nameInput = $("#other-name");
    const nameAvatar = $("#name-avatar");

    if (nameInput && document.activeElement !== nameInput) {
        nameInput.value = state.otherName;
    }

    if (nameAvatar) {
        nameAvatar.textContent = getOtherInitial();
    }

    $$("[data-other-label]").forEach((option) => {
        option.textContent = getOtherName();
    });
}

function renderMessageEditor() {
    const messageList = $("#message-editor-list");
    const messageCount = $("#message-count");

    if (!messageList || !messageCount) {
        return;
    }

    messageCount.textContent = String(state.messages.length);

    if (state.messages.length === 0) {
        messageList.innerHTML = `<div class="message-editor-empty">${escapeHtml(t("messages.emptyEditor"))}</div>`;
        return;
    }

    messageList.innerHTML = state.messages
        .map((message, index) => {
            const number = index + 1;

            return `
                <article class="message-editor-item" data-message-id="${escapeHtml(message.id)}">
                    <div class="message-editor-top">
                        <span class="message-number">${String(number).padStart(2, "0")}</span>
                        <select class="sender-select" data-sender-select aria-label="${escapeHtml(t("messages.senderAria", { index: number }))}">
                            <option value="me" ${message.sender === "me" ? "selected" : ""}>${escapeHtml(t("messages.you"))}</option>
                            <option value="other" ${message.sender === "other" ? "selected" : ""} data-other-label>${escapeHtml(getOtherName())}</option>
                        </select>
                        <label class="message-time-control" aria-label="${escapeHtml(t("messages.timeAria", { index: number }))}">
                            ${icon("clock")}
                            <input class="message-time-input" data-message-time type="time" value="${escapeHtml(normalizeTime(message.time))}" />
                        </label>
                        <button class="message-delete-button" type="button" data-delete-message aria-label="${escapeHtml(t("messages.deleteAria", { index: number }))}">
                            ${icon("trash")}
                        </button>
                    </div>
                    <textarea class="message-editor-textarea" data-message-text rows="2" maxlength="${MESSAGE_MAX_LENGTH}" placeholder="${escapeHtml(t("messages.placeholder"))}">${escapeHtml(message.text)}</textarea>
                </article>
            `;
        })
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
    const actionIcons = state.platform === "instagram" ? ["video", "more"] : ["video", "phone"];

    return `
        <header class="chat-app-header">
            <div class="chat-header-left">
                <span class="chat-header-back">${icon("back")}</span>
                <div class="chat-contact">
                    <span class="chat-avatar avatar-${state.platform}">${escapeHtml(getOtherInitial())}</span>
                    <span class="chat-contact-copy">
                        <strong>${escapeHtml(getOtherName())}</strong>
                        <span>${escapeHtml(t(`platform.${state.platform}.status`))}</span>
                    </span>
                </div>
            </div>
            <div class="chat-header-actions">
                ${actionIcons.map((name) => `<span class="chat-header-action">${icon(name)}</span>`).join("")}
            </div>
        </header>
    `;
}

function renderMessages() {
    const visibleMessages = getVisibleMessages();

    if (visibleMessages.length === 0) {
        return `
            <div class="empty-chat-state">
                ${icon("message")}
                <span>${escapeHtml(t("preview.empty"))}</span>
            </div>
        `;
    }

    const bubbles = visibleMessages
        .map((message) => {
            const isOutgoing = message.sender === "me";

            return `
                <div class="message-group ${isOutgoing ? "outgoing" : "incoming"}">
                    <div class="message-bubble">${escapeHtml(message.text.trim())}</div>
                    <div class="message-caption">
                        <span>${escapeHtml(message.time)}</span>
                        ${isOutgoing ? icon("double-check") : ""}
                    </div>
                </div>
            `;
        })
        .join("");

    return bubbles;
}

function renderComposer() {
    const sendIcon = state.platform === "instagram" ? "mic" : "send";

    return `
        <footer class="chat-composer">
            <button class="composer-icon-button" type="button" tabindex="-1" aria-label="${escapeHtml(t("composer.more"))}">${icon("plus")}</button>
            <div class="composer-field">${escapeHtml(t(`platform.${state.platform}.placeholder`))}</div>
            <button class="composer-icon-button" type="button" tabindex="-1" aria-label="${escapeHtml(t("composer.emoji"))}">${icon("smile")}</button>
            <button class="composer-send" type="button" tabindex="-1" aria-label="${escapeHtml(t("composer.send"))}">${icon(sendIcon)}</button>
        </footer>
    `;
}

function renderPreview() {
    const phoneScreen = $("#phone-screen");

    if (!phoneScreen) {
        return;
    }

    phoneScreen.className = `phone-screen platform-${state.platform} theme-${state.theme}`;
    phoneScreen.innerHTML = `
        ${renderDeviceStatusBar()}
        <div class="chat-screen">
            ${renderAppHeader()}
            <div class="chat-messages">
                <div class="chat-messages-inner">${renderMessages()}</div>
            </div>
            ${renderComposer()}
        </div>
    `;

    // Like a real chat: the newest message is the one you see.
    const messages = $(".chat-messages", phoneScreen);
    messages.scrollTop = messages.scrollHeight;
}

function renderAll() {
    applyLanguage();
    renderControls();
    renderPartner();
    renderMessageEditor();
    renderPreview();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function findMessage(messageId) {
    return state.messages.find((message) => message.id === messageId);
}

function addMessage() {
    const previous = state.messages.at(-1);
    const message = {
        id: createMessageId(),
        // Conversations alternate; a fresh chat usually opens with the other person.
        sender: previous ? (previous.sender === "me" ? "other" : "me") : "other",
        text: "",
        time: addMinutes(previous?.time ?? getCurrentTime(), Math.floor(Math.random() * 61)),
    };

    state.messages.push(message);
    renderMessageEditor();
    renderPreview();
    scheduleSave();

    $(`[data-message-id="${CSS.escape(message.id)}"] [data-message-text]`)?.focus();
}

function removeMessage(messageId) {
    state.messages = state.messages.filter((message) => message.id !== messageId);
    renderMessageEditor();
    renderPreview();
    scheduleSave();
}

function updateMessage(messageId, patch) {
    const message = findMessage(messageId);

    if (!message) {
        return;
    }

    Object.assign(message, patch);
    renderPreview();
    scheduleSave();
}

function selectPlatform(platform) {
    if (!PLATFORMS.includes(platform) || platform === state.platform) {
        return;
    }

    state.platform = platform;
    renderControls();
    renderPreview();
    scheduleSave();
}

function selectTheme(theme) {
    if (!THEMES.includes(theme) || theme === state.theme) {
        return;
    }

    state.theme = theme;
    renderControls();
    renderPreview();
    scheduleSave();
}

function selectExportMode(mode) {
    const includeFrame = mode === "frame";

    if (includeFrame === state.includeFrame) {
        return;
    }

    state.includeFrame = includeFrame;
    renderControls();
    scheduleSave();
}

function updateOtherName(value) {
    state.otherName = value.slice(0, NAME_MAX_LENGTH);
    renderPartner();
    renderPreview();
    scheduleSave();
}

function setLanguage(value) {
    language = normalizeLanguage(value, language);
    t = createTranslator(language);
    saveLanguage(storage, language);
    renderAll();
}

function resetState() {
    if (!window.confirm(t("reset.confirm"))) {
        return;
    }

    Object.assign(state, createDefaultState(language));
    renderAll();
    scheduleSave();
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function showToast(key, tone = "success") {
    const toast = $("#export-toast");
    const text = $("#toast-text");
    const toastIcon = $("#toast-icon");

    if (!toast || !text || !toastIcon) {
        return;
    }

    text.textContent = t(key);
    toastIcon.innerHTML = icon(tone === "error" ? "alert-circle" : "check-circle");
    toast.classList.toggle("is-error", tone === "error");

    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), TOAST_DURATION);
}

function setExportBusy(busy) {
    exportInFlight = busy;

    $$("[data-export-action]").forEach((button) => {
        button.disabled = busy;
        button.setAttribute("aria-busy", String(busy));
    });
}

function createExportBlob() {
    return renderExportBlob({
        phoneShell: $("#phone-shell"),
        includeFrame: state.includeFrame,
        width: state.exportWidth,
        height: state.exportHeight,
    });
}

async function exportPng() {
    if (exportInFlight) {
        return;
    }

    setExportBusy(true);

    try {
        downloadBlob(await createExportBlob(), exportFileName(state));
        showToast("toast.exportReady");
    } catch (error) {
        console.error("PNG export failed", error);
        showToast("toast.exportFailed", "error");
    } finally {
        setExportBusy(false);
    }
}

function copyPng() {
    if (exportInFlight || !canCopyImages()) {
        return;
    }

    setExportBusy(true);

    const blobPromise = createExportBlob();
    blobPromise.catch(() => {}); // Surfaced through the clipboard promise below.

    copyBlobToClipboard(blobPromise)
        .then(
            () => showToast("toast.copied"),
            (error) => {
                console.error("Clipboard copy failed", error);
                showToast("toast.copyFailed", "error");
            },
        )
        .finally(() => setExportBusy(false));
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function bindEvents() {
    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const platformButton = target.closest("#platform-grid [data-platform]");
        if (platformButton) {
            selectPlatform(platformButton.dataset.platform);
            return;
        }

        const themeButton = target.closest("#theme-control [data-theme]");
        if (themeButton) {
            selectTheme(themeButton.dataset.theme);
            return;
        }

        const exportModeButton = target.closest("#export-control [data-export]");
        if (exportModeButton) {
            selectExportMode(exportModeButton.dataset.export);
            return;
        }

        if (target.closest("#add-message-button")) {
            addMessage();
            return;
        }

        const deleteButton = target.closest("[data-delete-message]");
        if (deleteButton) {
            const messageId = deleteButton.closest("[data-message-id]")?.dataset.messageId;

            if (messageId) {
                removeMessage(messageId);
            }

            return;
        }

        if (target.closest("#export-button, #preview-export-button")) {
            exportPng();
            return;
        }

        if (target.closest("#copy-button")) {
            copyPng();
            return;
        }

        if (target.closest("#reset-button")) {
            resetState();
        }
    });

    document.addEventListener("input", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        if (target.matches("#other-name")) {
            updateOtherName(target.value);
            return;
        }

        if (target.matches("[data-message-text]")) {
            const messageId = target.closest("[data-message-id]")?.dataset.messageId;
            updateMessage(messageId, { text: target.value });
        }
    });

    document.addEventListener("change", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        if (target.matches("#language-select")) {
            setLanguage(target.value);
            return;
        }

        if (target.matches("#export-width, #export-height")) {
            const isWidth = target.id === "export-width";
            const stateKey = isWidth ? "exportWidth" : "exportHeight";
            const minimum = isWidth ? EXPORT_WIDTH_MIN : EXPORT_HEIGHT_MIN;
            const maximum = isWidth ? EXPORT_WIDTH_MAX : EXPORT_HEIGHT_MAX;

            state[stateKey] = normalizeExportDimension(target.value, state[stateKey], minimum, maximum);
            target.value = String(state[stateKey]);
            persist();
            return;
        }

        const messageId = target.closest("[data-message-id]")?.dataset.messageId;

        if (!messageId) {
            return;
        }

        if (target.matches("[data-sender-select]")) {
            updateMessage(messageId, { sender: target.value === "other" ? "other" : "me" });
            return;
        }

        if (target.matches("[data-message-time]")) {
            const current = findMessage(messageId)?.time;
            const time = normalizeTime(target.value, current);

            target.value = time;
            updateMessage(messageId, { time });
        }
    });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function init() {
    hydrateIcons();

    const nameInput = $("#other-name");

    if (nameInput) {
        nameInput.maxLength = NAME_MAX_LENGTH;
    }

    const copyButton = $("#copy-button");

    if (copyButton && !canCopyImages()) {
        copyButton.hidden = true;
    }

    bindEvents();
    renderAll();
    persist();
}

init();
