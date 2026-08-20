import { ensure } from "./dom.ts";
import { snapshotElement, canvasToBlob } from "./snapshot.ts";
import { DEFAULT_EXPORT_HEIGHT, DEFAULT_EXPORT_WIDTH, type MockupState } from "./state.ts";

export const EXPORT_SCALE = 1;

// CSS pixels. The preview's phone tops out at 760px tall; exporting at that
// size means the PNG is exactly the preview at its largest, every time,
// regardless of the window the user happens to have open.
const FRAME_HEIGHT = 760;

export type ExportOptions = {
    phoneShell: HTMLElement;
    includeFrame: boolean;
    width?: number;
    height?: number;
};

/**
 * Renders the current preview to a PNG blob.
 *
 * "App only" uses the configured width and height.
 * "With frame" is a fixed phone: long conversations are pinned to the bottom,
 * exactly like a screenshot of a real device. Dimensions are disabled for this
 * mode because changing them would distort the device frame.
 */
export async function renderExportBlob({ phoneShell, includeFrame, width = DEFAULT_EXPORT_WIDTH, height = DEFAULT_EXPORT_HEIGHT }: ExportOptions): Promise<Blob> {
    const stage = document.createElement("div");
    stage.className = "snapshot-stage fixed -left-[100000px] top-0 -z-10 pointer-events-none";
    stage.setAttribute("aria-hidden", "true");
    stage.inert = true;

    const shell = ensure(phoneShell.cloneNode(true), HTMLElement, "the phone shell clone");
    stripIds(shell);
    shell.classList.add("is-export");

    const screen = ensure(shell.querySelector(".phone-screen"), HTMLElement, "the cloned phone screen");
    const sourceScreen = ensure(phoneShell.querySelector(".phone-screen"), HTMLElement, "the phone screen");
    let target: HTMLElement = shell;

    if (includeFrame) {
        shell.style.height = `${FRAME_HEIGHT}px`;
        shell.style.width = "auto";
        stage.appendChild(shell);
    } else {
        const chatScreen = ensure(screen.querySelector(".chat-screen"), HTMLElement, "the chat screen");

        // The screen's look (platform-*/theme-* markers and the utility classes
        // behind them) lives on `.phone-screen`; the detached `.chat-screen`
        // needs the same classes and custom properties to render identically.
        sourceScreen.classList.forEach((className) => {
            if (className !== "phone-screen") {
                chatScreen.classList.add(className);
            }
        });

        copyCustomProperties(sourceScreen, chatScreen);
        chatScreen.classList.add("is-export-screen");
        chatScreen.style.width = `${width}px`;
        chatScreen.style.height = `${height}px`;
        chatScreen.style.minHeight = `${height}px`;
        chatScreen.style.borderRadius = "0";
        chatScreen.style.overflow = "visible";

        const messages = chatScreen.querySelector(".chat-messages");

        if (messages instanceof HTMLElement) {
            messages.style.overflow = "visible";
        }

        stage.appendChild(chatScreen);
        target = chatScreen;
    }

    document.body.appendChild(stage);

    try {
        await nextFrame();
        pinToBottom(target.querySelector(".chat-messages"));

        const canvas = await snapshotElement(target, {
            scale: EXPORT_SCALE,
            padding: includeFrame ? 4 : 0,
        });

        return await canvasToBlob(canvas);
    } finally {
        stage.remove();
    }
}

export function exportFileName({ platform, theme, includeFrame }: Pick<MockupState, "platform" | "theme" | "includeFrame">): string {
    return `chat-mockup-generator-${platform}-${theme}${includeFrame ? "-iphone" : ""}.png`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canCopyImages(): boolean {
    return typeof ClipboardItem === "function" && typeof navigator.clipboard?.write === "function";
}

/**
 * Copies a PNG to the clipboard. Safari only honours clipboard writes that are
 * set up synchronously inside the user gesture, so the ClipboardItem is handed
 * the pending blob rather than awaited first.
 */
export function copyBlobToClipboard(blobPromise: Promise<Blob>): Promise<void> {
    const item = new ClipboardItem({ "image/png": blobPromise });

    return navigator.clipboard.write([item]);
}

function stripIds(root: Element): void {
    root.removeAttribute("id");
    root.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
}

function copyCustomProperties(source: Element, target: HTMLElement): void {
    const computed = getComputedStyle(source);

    for (let index = 0; index < computed.length; index += 1) {
        const property = computed.item(index);

        if (property.startsWith("--")) {
            target.style.setProperty(property, computed.getPropertyValue(property));
        }
    }
}

/**
 * Scroll offsets do not survive serialisation, so when the conversation is
 * taller than the fixed screen, shift it up by the overflow instead.
 */
function pinToBottom(messages: Element | null): void {
    const inner = messages?.firstElementChild;

    if (!(messages instanceof HTMLElement) || !(inner instanceof HTMLElement)) {
        return;
    }

    const overflow = messages.scrollHeight - messages.clientHeight;

    if (overflow > 0) {
        messages.style.overflow = "hidden";
        inner.style.transform = `translateY(-${overflow}px)`;
    }
}

function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}
