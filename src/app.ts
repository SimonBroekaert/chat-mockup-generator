import { must, query, queryAll } from "./dom.ts";
import { canCopyImages, copyBlobToClipboard, downloadBlob, exportFileName, renderExportBlob } from "./export.ts";
import { escapeHtml, html, setHtml, type SafeHtml } from "./html.ts";
import { createTranslator, isTranslationKey, normalizeLanguage, type Language, type TranslationKey, type Translator } from "./i18n.ts";
import { hydrateIcons, icon, type IconName } from "./icons.ts";
import {
    DEFAULT_NAME,
    EXPORT_HEIGHT_MAX,
    EXPORT_HEIGHT_MIN,
    EXPORT_WIDTH_MAX,
    EXPORT_WIDTH_MIN,
    MESSAGE_MAX_LENGTH,
    NAME_MAX_LENGTH,
    addMinutes,
    createDefaultState,
    createMessageId,
    getCurrentTime,
    isAppTheme,
    isPlatform,
    isTheme,
    loadAppTheme,
    loadLanguage,
    loadState,
    normalizeExportDimension,
    normalizeTime,
    saveAppTheme,
    saveLanguage,
    saveState,
    type AppTheme,
    type Message,
    type MockupState,
    type Platform,
    type StorageLike,
    type Theme,
} from "./state.ts";

const SAVE_DELAY = 220;
const TOAST_DURATION = 2800;

const storage = getStorage();

// The editor is English-only; the language preference applies to the text inside the phone.
const interfaceLanguage: Language = "en";
let mockupLanguage: Language = loadLanguage(storage, [interfaceLanguage]);
const t: Translator = createTranslator(interfaceLanguage);
let mockupTranslator: Translator = createTranslator(mockupLanguage);
const state: MockupState = loadState(storage, mockupLanguage);
let appTheme: AppTheme = loadAppTheme(storage);

let saveTimer: number | undefined;
let toastTimer: number | undefined;
let exportInFlight = false;

function getStorage(): StorageLike {
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

const getOtherName = (): string => state.otherName.trim() || DEFAULT_NAME;
const getOtherInitial = (): string => getOtherName().charAt(0).toUpperCase();
const getVisibleMessages = (): Message[] => state.messages.filter((message) => message.text.trim().length > 0);

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function setSaveStatus(key: TranslationKey): void {
    const status = query("#save-status", Element);

    if (status) {
        status.textContent = t(key);
        status.setAttribute("data-i18n", key);
    }
}

function persist(): void {
    window.clearTimeout(saveTimer);
    setSaveStatus(saveState(storage, state) ? "save.saved" : "save.failed");
}

function scheduleSave(): void {
    setSaveStatus("save.saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, SAVE_DELAY);
}

// ---------------------------------------------------------------------------
// Rendering: the editor
// ---------------------------------------------------------------------------

/** Keys come out of the markup as plain strings; an unknown one is shown as-is so the typo is visible. */
function translateAttribute(key: string | null): string {
    return isTranslationKey(key) ? t(key) : (key ?? "");
}

function applyLanguage(): void {
    document.documentElement.lang = interfaceLanguage;
    document.title = t("document.title");

    for (const element of queryAll("[data-i18n]", Element)) {
        element.textContent = translateAttribute(element.getAttribute("data-i18n"));
    }

    for (const element of queryAll("[data-i18n-aria]", Element)) {
        element.setAttribute("aria-label", translateAttribute(element.getAttribute("data-i18n-aria")));
    }

    for (const element of queryAll("[data-i18n-placeholder]", Element)) {
        element.setAttribute("placeholder", translateAttribute(element.getAttribute("data-i18n-placeholder")));
    }

    const languageSelect = query("#mockup-language-select", HTMLSelectElement);

    if (languageSelect) {
        languageSelect.value = mockupLanguage;
    }
}

function applyAppTheme(): void {
    document.documentElement.setAttribute("data-app-theme", appTheme);
    document.documentElement.classList.toggle("dark", appTheme === "dark");
    document.documentElement.style.colorScheme = appTheme;
}

/** Marks one option of a radio-style button group as selected. */
function renderChoice(groupSelector: string, attribute: string, value: string): void {
    for (const button of queryAll(`${groupSelector} [${attribute}]`, Element)) {
        const isActive = button.getAttribute(attribute) === value;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("data-state", isActive ? "on" : "off");
        button.setAttribute("aria-checked", String(isActive));
    }
}

function renderControls(): void {
    renderChoice("#platform-grid", "data-platform", state.platform);
    renderChoice("#theme-control", "data-theme", state.theme);
    renderChoice("#export-control", "data-export", state.includeFrame ? "frame" : "app");

    const exportHint = query("#export-size-hint", Element);

    if (exportHint) {
        const hintKey: TranslationKey = state.includeFrame ? "export.hint.frame" : "export.hint.app";

        exportHint.textContent = t(hintKey);
        exportHint.setAttribute("data-i18n", hintKey);
    }

    const exportWidth = query("#export-width", HTMLInputElement);
    const exportHeight = query("#export-height", HTMLInputElement);

    if (exportWidth && document.activeElement !== exportWidth) {
        exportWidth.value = String(state.exportWidth);
    }

    if (exportHeight && document.activeElement !== exportHeight) {
        exportHeight.value = String(state.exportHeight);
    }

    for (const input of [exportWidth, exportHeight]) {
        if (input) {
            input.disabled = state.includeFrame;
        }
    }
}

function renderAppThemeControl(): void {
    renderChoice("#app-theme-control", "data-app-theme", appTheme);
}

function renderPartner(): void {
    const nameInput = query("#other-name", HTMLInputElement);
    const nameAvatar = query("#name-avatar", Element);

    if (nameInput && document.activeElement !== nameInput) {
        nameInput.value = state.otherName;
    }

    if (nameAvatar) {
        nameAvatar.textContent = getOtherInitial();
    }

    for (const option of queryAll("[data-other-label]", Element)) {
        option.textContent = getOtherName();
    }
}

function renderMessageEditor(): void {
    const messageList = query("#message-editor-list", Element);
    const messageCount = query("#message-count", Element);

    if (!messageList || !messageCount) {
        return;
    }

    messageCount.textContent = String(state.messages.length);

    if (state.messages.length === 0) {
        setHtml(
            messageList,
            html`<div class="message-editor-empty rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs leading-5 text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">${escapeHtml(t("messages.emptyEditor"))}</div>`,
        );
        return;
    }

    setHtml(messageList, html`${state.messages.map(renderMessageEditorItem)}`);
}

function renderMessageEditorItem(message: Message, index: number): SafeHtml {
    const number = index + 1;

    return html`
        <article class="message-editor-item rounded-lg border border-slate-200 bg-slate-50/80 p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950" data-message-id="${escapeHtml(message.id)}">
            <div class="message-editor-top flex items-center gap-2">
                <span class="message-number inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">${escapeHtml(String(number).padStart(2, "0"))}</span>
                <select class="sender-select h-8 min-w-0 appearance-none rounded-md border border-transparent bg-slate-200 px-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-800 dark:text-zinc-300" data-sender-select aria-label="${escapeHtml(t("messages.senderAria", { index: number }))}">
                    <option value="me" ${message.sender === "me" ? "selected" : ""}>${escapeHtml(t("messages.you"))}</option>
                    <option value="other" ${message.sender === "other" ? "selected" : ""} data-other-label>${escapeHtml(getOtherName())}</option>
                </select>
                <label class="message-time-control flex h-8 min-w-0 items-center gap-1.5 rounded-md bg-slate-200 px-2 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400" aria-label="${escapeHtml(t("messages.timeAria", { index: number }))}">
                    ${icon("clock")}
                    <input class="message-time-input w-[68px] min-w-0 border-0 bg-transparent p-0 text-xs font-semibold text-slate-700 outline-none dark:text-zinc-300" data-message-time type="time" value="${escapeHtml(normalizeTime(message.time))}" />
                </label>
                <button class="message-delete-button ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-400" type="button" data-delete-message aria-label="${escapeHtml(t("messages.deleteAria", { index: number }))}">
                    ${icon("trash")}
                </button>
            </div>
            <textarea class="message-editor-textarea mt-2 block min-h-28 max-h-60 w-full resize-y overflow-y-auto rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500" data-message-text rows="4" maxlength="${MESSAGE_MAX_LENGTH}" placeholder="${escapeHtml(t("messages.placeholder"))}">${escapeHtml(message.text)}</textarea>
        </article>
    `;
}

// ---------------------------------------------------------------------------
// Rendering: the phone
//
// The screen's look is a map of utility classes per platform and theme. The
// tables are `as const`, so every value is a string literal the code wrote —
// which is what lets the html`` tag accept them without escaping. A class
// string computed at runtime would be typed `string` and rejected.
// ---------------------------------------------------------------------------

function getPhoneStyles() {
    const isDark = state.theme === "dark";
    const baseStyles = isDark
        ? ({
              screen: "bg-black text-zinc-50",
              status: "bg-black text-white",
              header: "border-white/10 bg-black text-white",
              headerSub: "text-zinc-400",
              headerIcon: "text-white",
              headerBack: "text-white",
              messages: "bg-black",
              incomingBubble: "bg-zinc-800 text-zinc-100",
              outgoingBubble: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
              caption: "text-zinc-500",
              tick: "text-violet-400",
              composer: "border-white/10 bg-black",
              composerIcon: "text-zinc-200",
              composerField: "border-zinc-800 bg-zinc-800 text-zinc-400",
              send: "bg-transparent text-zinc-200",
          } as const)
        : ({
              screen: "bg-white text-slate-900",
              status: "bg-white text-slate-900",
              header: "border-slate-200/90 bg-white text-slate-900",
              headerSub: "text-slate-400",
              headerIcon: "text-slate-900",
              headerBack: "text-slate-900",
              messages: "bg-white",
              incomingBubble: "bg-slate-100 text-slate-800",
              outgoingBubble: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
              caption: "text-slate-400",
              tick: "text-violet-500",
              composer: "border-slate-200/90 bg-white",
              composerIcon: "text-slate-500",
              composerField: "border-slate-200 bg-slate-50 text-slate-400",
              send: "bg-transparent text-slate-500",
          } as const);

    if (state.platform === "messenger") {
        return {
            ...baseStyles,
            headerBack: "text-blue-500",
            incomingBubble: isDark ? "bg-[#303030] text-zinc-100" : "bg-[#e9ebee] text-slate-800",
            outgoingBubble: "bg-[#0084ff] text-white",
            tick: "text-[#0084ff]",
            composerField: isDark ? "border-[#3a3b3c] bg-[#3a3b3c] text-zinc-400" : "border-slate-200 bg-slate-50 text-slate-400",
            send: "bg-transparent text-[#0084ff]",
        } as const;
    }

    if (state.platform === "whatsapp") {
        return isDark
            ? ({
                  ...baseStyles,
                  screen: "bg-[#0b141a] text-[#e9edef]",
                  status: "bg-[#202c33] text-[#e9edef]",
                  header: "border-white/5 bg-[#202c33] text-[#e9edef]",
                  headerSub: "text-[#aebac1]/70",
                  headerIcon: "text-[#aebac1]",
                  headerBack: "text-[#aebac1]",
                  messages: "bg-[#0b141a]",
                  incomingBubble: "bg-[#202c33] text-[#e9edef]",
                  outgoingBubble: "bg-[#005c4b] text-[#e9edef]",
                  caption: "text-[#e9edef]/60",
                  tick: "text-[#53bdeb]",
                  composer: "border-white/5 bg-[#202c33]",
                  composerIcon: "text-[#8696a0]",
                  composerField: "border-[#2a3942] bg-[#2a3942] text-[#8696a0]",
                  send: "bg-[#00a884] text-white",
              } as const)
            : ({
                  ...baseStyles,
                  screen: "bg-[#efeae2] text-[#29332f]",
                  status: "bg-[#075e54] text-white",
                  header: "border-black/10 bg-[#075e54] text-white",
                  headerSub: "text-white/70",
                  headerIcon: "text-white",
                  headerBack: "text-white",
                  messages: "bg-[#efeae2]",
                  incomingBubble: "bg-white text-[#29332f]",
                  outgoingBubble: "bg-[#d9fdd3] text-[#1c2c28]",
                  caption: "text-[#859089]",
                  tick: "text-[#53bdeb]",
                  composer: "border-black/10 bg-[#f0f2f5]",
                  composerIcon: "text-[#54656f]",
                  composerField: "border-transparent bg-white text-[#859089]",
                  send: "bg-[#128c7e] text-white",
              } as const);
    }

    return baseStyles;
}

type PhoneStyles = ReturnType<typeof getPhoneStyles>;

const AVATAR_BACKGROUND = {
    instagram: "bg-gradient-to-br from-amber-300 via-pink-500 to-purple-700",
    messenger: "bg-gradient-to-br from-sky-400 to-indigo-600",
    whatsapp: "bg-gradient-to-br from-green-400 to-green-700",
} as const satisfies Record<Platform, string>;

function renderDeviceStatusBar(styles: PhoneStyles): SafeHtml {
    return html`
        <div class="flex h-[31px] min-h-[31px] items-center justify-between px-6 text-[10px] font-bold ${styles.status}">
            <span class="w-14 pt-px">9:41</span>
            <span class="flex items-center gap-1.5">
                <span class="flex h-3.5 w-3.5 items-center justify-center">${icon("signal", "h-3.5 w-3.5")}</span>
                <span class="flex h-3.5 w-3.5 items-center justify-center">${icon("wifi", "h-3.5 w-3.5")}</span>
                <span class="flex h-3.5 w-3.5 items-center justify-center">${icon("battery", "h-3.5 w-3.5")}</span>
            </span>
        </div>
    `;
}

function renderAppHeader(styles: PhoneStyles): SafeHtml {
    const actionIcons: IconName[] = state.platform === "instagram" ? ["video", "more"] : ["video", "phone"];

    return html`
        <header class="flex min-h-[67px] items-center justify-between gap-2 border-b px-3 py-2 ${styles.header}">
            <div class="flex min-w-0 items-center gap-2">
                <span class="flex h-7 w-5 items-center justify-center ${styles.headerBack}">${icon("back", "h-4 w-4")}</span>
                <div class="flex min-w-0 items-center gap-2">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-inner ${AVATAR_BACKGROUND[state.platform]}">${escapeHtml(getOtherInitial())}</span>
                    <span class="min-w-0">
                        <strong class="block max-w-[135px] truncate text-[11px] font-bold leading-tight">${escapeHtml(getOtherName())}</strong>
                        <span class="mt-0.5 block truncate text-[8px] font-medium ${styles.headerSub}">${escapeHtml(mockupTranslator(`platform.${state.platform}.status`))}</span>
                    </span>
                </div>
            </div>
            <div class="flex items-center gap-2.5 ${styles.headerIcon}">
                ${actionIcons.map((name) => html`<span class="flex h-5 w-5 items-center justify-center">${icon(name, "h-4 w-4")}</span>`)}
            </div>
        </header>
    `;
}

function renderMessages(styles: PhoneStyles): SafeHtml {
    const visibleMessages = getVisibleMessages();

    if (visibleMessages.length === 0) {
        return html`
            <div class="flex min-h-40 flex-col items-center justify-center gap-2 text-center text-[10px] ${styles.caption}">
                ${icon("message", "h-6 w-6 opacity-80")}
                <span>${escapeHtml(mockupTranslator("preview.empty"))}</span>
            </div>
        `;
    }

    return html`${visibleMessages.map((message) => renderBubble(message, styles))}`;
}

function renderBubble(message: Message, styles: PhoneStyles): SafeHtml {
    const isOutgoing = message.sender === "me";

    return html`
        <div class="flex max-w-[84%] flex-col ${isOutgoing ? "items-end self-end" : "items-start"}">
            <div class="rounded-[17px] px-2.5 pb-2 pt-2 text-[11px] font-medium leading-[1.36] whitespace-pre-wrap break-words ${isOutgoing ? `rounded-br-[5px] ${styles.outgoingBubble}` : `rounded-bl-[5px] ${styles.incomingBubble}`}">${escapeHtml(message.text.trim())}</div>
            <div class="mt-0.5 ml-1 mr-1 flex items-center gap-1 text-[7px] font-medium ${styles.caption}">
                <span>${escapeHtml(message.time)}</span>
                ${isOutgoing && icon("double-check", `h-3 w-3 ${styles.tick}`)}
            </div>
        </div>
    `;
}

function renderComposer(styles: PhoneStyles): SafeHtml {
    const sendIcon: IconName = state.platform === "instagram" ? "mic" : "send";
    const moreButtonVisibility = state.platform === "messenger" ? "hidden" : "flex";
    const sendButtonSize = state.platform === "whatsapp" ? "h-8 w-8" : "h-7 w-7";

    return html`
        <footer class="flex min-h-[59px] items-center gap-2 border-t px-3 py-2 ${styles.composer}">
            <button class="${moreButtonVisibility} h-7 w-7 shrink-0 items-center justify-center rounded-full bg-transparent ${styles.composerIcon}" type="button" tabindex="-1" aria-label="${escapeHtml(mockupTranslator("composer.more"))}">${icon("plus", "h-4 w-4")}</button>
            <div class="flex h-8 min-w-0 flex-1 items-center rounded-full border px-3 text-[9px] whitespace-nowrap ${styles.composerField}">${escapeHtml(mockupTranslator(`platform.${state.platform}.placeholder`))}</div>
            <button class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-transparent ${styles.composerIcon}" type="button" tabindex="-1" aria-label="${escapeHtml(mockupTranslator("composer.emoji"))}">${icon("smile", "h-4 w-4")}</button>
            <button class="flex ${sendButtonSize} shrink-0 items-center justify-center rounded-full ${styles.send}" type="button" tabindex="-1" aria-label="${escapeHtml(mockupTranslator("composer.send"))}">${icon(sendIcon, "h-4 w-4")}</button>
        </footer>
    `;
}

function renderPreview(): void {
    const phoneScreen = query("#phone-screen", HTMLElement);

    if (!phoneScreen) {
        return;
    }

    const styles = getPhoneStyles();

    phoneScreen.className = `phone-screen platform-${state.platform} theme-${state.theme} flex h-full w-full flex-col overflow-hidden rounded-[49px] font-sans ${styles.screen}`;
    setHtml(
        phoneScreen,
        html`
            ${renderDeviceStatusBar(styles)}
            <div class="chat-screen flex min-h-0 flex-1 flex-col overflow-hidden">
                ${renderAppHeader(styles)}
                <div class="chat-messages flex min-h-0 flex-1 flex-col overflow-y-auto ${styles.messages}">
                    <div class="chat-messages-inner mt-auto flex flex-col gap-2 px-3 pb-4 pt-3">${renderMessages(styles)}</div>
                </div>
                ${renderComposer(styles)}
            </div>
        `,
    );

    // Like a real chat: the newest message is the one you see.
    const messages = query(".chat-messages", Element, phoneScreen);

    if (messages) {
        messages.scrollTop = messages.scrollHeight;
    }
}

function renderAll(): void {
    applyAppTheme();
    applyLanguage();
    renderAppThemeControl();
    renderControls();
    renderPartner();
    renderMessageEditor();
    renderPreview();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function findMessage(messageId: string): Message | undefined {
    return state.messages.find((message) => message.id === messageId);
}

function addMessage(): void {
    const previous = state.messages.at(-1);
    const message: Message = {
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

    query(`[data-message-id="${CSS.escape(message.id)}"] [data-message-text]`, HTMLTextAreaElement)?.focus();
}

function removeMessage(messageId: string): void {
    state.messages = state.messages.filter((message) => message.id !== messageId);
    renderMessageEditor();
    renderPreview();
    scheduleSave();
}

function updateMessage(messageId: string, patch: Partial<Message>): void {
    const message = findMessage(messageId);

    if (!message) {
        return;
    }

    Object.assign(message, patch);
    renderPreview();
    scheduleSave();
}

function selectPlatform(platform: Platform): void {
    if (platform === state.platform) {
        return;
    }

    state.platform = platform;
    renderControls();
    renderPreview();
    scheduleSave();
}

function selectTheme(theme: Theme): void {
    if (theme === state.theme) {
        return;
    }

    state.theme = theme;
    renderControls();
    renderPreview();
    scheduleSave();
}

function selectAppTheme(theme: AppTheme): void {
    if (theme === appTheme) {
        return;
    }

    appTheme = theme;
    saveAppTheme(storage, appTheme);
    applyAppTheme();
    renderAppThemeControl();
}

function selectExportMode(includeFrame: boolean): void {
    if (includeFrame === state.includeFrame) {
        return;
    }

    state.includeFrame = includeFrame;
    renderControls();
    scheduleSave();
}

function updateOtherName(value: string): void {
    state.otherName = value.slice(0, NAME_MAX_LENGTH);
    renderPartner();
    renderPreview();
    scheduleSave();
}

/**
 * If the conversation is still the untouched example, switching the mockup
 * language swaps it for the example in the new language. Returns whether it did.
 */
function replaceExampleMessagesLanguage(previousLanguage: Language, nextLanguage: Language): boolean {
    const previousMessages = createDefaultState(previousLanguage).messages;
    const nextMessages = createDefaultState(nextLanguage).messages;

    const isExampleConversation =
        state.messages.length === previousMessages.length &&
        state.messages.every((message, index) => {
            const previousMessage = previousMessages[index];

            return (
                previousMessage !== undefined &&
                message.sender === previousMessage.sender &&
                message.text === previousMessage.text &&
                message.time === previousMessage.time
            );
        });

    if (!isExampleConversation) {
        return false;
    }

    state.messages = state.messages.map((message, index) => ({
        ...message,
        text: nextMessages[index]?.text ?? message.text,
    }));

    return true;
}

function setMockupLanguage(value: string): void {
    const nextLanguage = normalizeLanguage(value, mockupLanguage);

    if (nextLanguage === mockupLanguage) {
        return;
    }

    const previousLanguage = mockupLanguage;

    mockupLanguage = nextLanguage;
    mockupTranslator = createTranslator(mockupLanguage);
    const replacedExampleMessages = replaceExampleMessagesLanguage(previousLanguage, mockupLanguage);

    saveLanguage(storage, mockupLanguage);
    renderAll();

    if (replacedExampleMessages) {
        scheduleSave();
    }
}

function resetState(): void {
    if (!window.confirm(t("reset.confirm"))) {
        return;
    }

    Object.assign(state, createDefaultState(mockupLanguage));
    renderAll();
    scheduleSave();
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function showToast(key: TranslationKey, tone: "success" | "error" = "success"): void {
    const toast = query("#export-toast", Element);
    const text = query("#toast-text", Element);
    const toastIcon = query("#toast-icon", Element);

    if (!toast || !text || !toastIcon) {
        return;
    }

    const isError = tone === "error";

    text.textContent = t(key);
    setHtml(toastIcon, icon(isError ? "alert-circle" : "check-circle"));
    toast.classList.toggle("is-error", isError);

    for (const className of ["border-red-200", "bg-red-50", "text-red-700", "dark:border-red-900", "dark:bg-red-950", "dark:text-red-300"]) {
        toast.classList.toggle(className, isError);
    }

    toastIcon.classList.toggle("bg-red-500", isError);
    toastIcon.classList.toggle("bg-emerald-500", !isError);

    window.clearTimeout(toastTimer);
    toast.classList.remove("translate-y-2", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-2", "opacity-0");
    }, TOAST_DURATION);
}

function setExportBusy(busy: boolean): void {
    exportInFlight = busy;

    for (const button of queryAll("[data-export-action]", HTMLButtonElement)) {
        button.disabled = busy;
        button.setAttribute("aria-busy", String(busy));
    }
}

function createExportBlob(): Promise<Blob> {
    return renderExportBlob({
        phoneShell: must(query("#phone-shell", HTMLElement), "#phone-shell"),
        includeFrame: state.includeFrame,
        width: state.exportWidth,
        height: state.exportHeight,
    });
}

async function exportPng(): Promise<void> {
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

function copyPng(): void {
    if (exportInFlight || !canCopyImages()) {
        return;
    }

    setExportBusy(true);

    const blobPromise = createExportBlob();
    blobPromise.catch(() => undefined); // Surfaced through the clipboard promise below.

    copyBlobToClipboard(blobPromise)
        .then(
            () => showToast("toast.copied"),
            (error: unknown) => {
                console.error("Clipboard copy failed", error);
                showToast("toast.copyFailed", "error");
            },
        )
        .finally(() => setExportBusy(false));
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function messageIdOf(element: Element): string | null {
    return element.closest("[data-message-id]")?.getAttribute("data-message-id") ?? null;
}

function bindEvents(): void {
    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const platformButton = target.closest("#platform-grid [data-platform]");
        if (platformButton) {
            const platform = platformButton.getAttribute("data-platform");

            if (isPlatform(platform)) {
                selectPlatform(platform);
            }

            return;
        }

        const themeButton = target.closest("#theme-control [data-theme]");
        if (themeButton) {
            const theme = themeButton.getAttribute("data-theme");

            if (isTheme(theme)) {
                selectTheme(theme);
            }

            return;
        }

        const appThemeButton = target.closest("#app-theme-control [data-app-theme]");
        if (appThemeButton) {
            const theme = appThemeButton.getAttribute("data-app-theme");

            if (isAppTheme(theme)) {
                selectAppTheme(theme);
            }

            return;
        }

        const exportModeButton = target.closest("#export-control [data-export]");
        if (exportModeButton) {
            selectExportMode(exportModeButton.getAttribute("data-export") === "frame");
            return;
        }

        if (target.closest("#add-message-button")) {
            addMessage();
            return;
        }

        const deleteButton = target.closest("[data-delete-message]");
        if (deleteButton) {
            const messageId = messageIdOf(deleteButton);

            if (messageId) {
                removeMessage(messageId);
            }

            return;
        }

        if (target.closest("#export-button, #preview-export-button")) {
            void exportPng();
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

        if (target instanceof HTMLInputElement && target.id === "other-name") {
            updateOtherName(target.value);
            return;
        }

        if (target instanceof HTMLTextAreaElement && target.hasAttribute("data-message-text")) {
            const messageId = messageIdOf(target);

            if (messageId) {
                updateMessage(messageId, { text: target.value });
            }
        }
    });

    document.addEventListener("change", (event) => {
        const target = event.target;

        if (target instanceof HTMLSelectElement && target.id === "mockup-language-select") {
            setMockupLanguage(target.value);
            return;
        }

        if (target instanceof HTMLInputElement && (target.id === "export-width" || target.id === "export-height")) {
            const isWidth = target.id === "export-width";
            const stateKey = isWidth ? "exportWidth" : "exportHeight";
            const minimum = isWidth ? EXPORT_WIDTH_MIN : EXPORT_HEIGHT_MIN;
            const maximum = isWidth ? EXPORT_WIDTH_MAX : EXPORT_HEIGHT_MAX;

            state[stateKey] = normalizeExportDimension(target.value, state[stateKey], minimum, maximum);
            target.value = String(state[stateKey]);
            persist();
            return;
        }

        if (!(target instanceof Element)) {
            return;
        }

        const messageId = messageIdOf(target);

        if (!messageId) {
            return;
        }

        if (target instanceof HTMLSelectElement && target.hasAttribute("data-sender-select")) {
            updateMessage(messageId, { sender: target.value === "other" ? "other" : "me" });
            return;
        }

        if (target instanceof HTMLInputElement && target.hasAttribute("data-message-time")) {
            const time = normalizeTime(target.value, findMessage(messageId)?.time);

            target.value = time;
            updateMessage(messageId, { time });
        }
    });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function init(): void {
    hydrateIcons();

    const nameInput = query("#other-name", HTMLInputElement);

    if (nameInput) {
        nameInput.maxLength = NAME_MAX_LENGTH;
    }

    // The inputs' limits come from the same constants normalizeExportDimension() clamps with.
    const ranges = [
        [query("#export-width", HTMLInputElement), EXPORT_WIDTH_MIN, EXPORT_WIDTH_MAX],
        [query("#export-height", HTMLInputElement), EXPORT_HEIGHT_MIN, EXPORT_HEIGHT_MAX],
    ] as const;

    for (const [input, minimum, maximum] of ranges) {
        if (input) {
            input.min = String(minimum);
            input.max = String(maximum);
        }
    }

    const copyButton = query("#copy-button", HTMLElement);

    if (copyButton && !canCopyImages()) {
        copyButton.hidden = true;
    }

    bindEvents();
    renderAll();
    persist();
}

init();
