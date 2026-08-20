import { snapshotElement, canvasToBlob } from "./snapshot.js";

export const EXPORT_SCALE = 3;

// CSS pixels. The preview's phone tops out at 760px tall; exporting at that
// size means the PNG is exactly the preview at its largest, every time,
// regardless of the window the user happens to have open.
const FRAME_HEIGHT = 760;
const SCREEN_WIDTH = 330;
const SCREEN_MIN_HEIGHT = 740;

/**
 * Renders the current preview to a PNG blob.
 *
 * "App only" grows with the conversation so every message fits.
 * "With frame" is a fixed phone: long conversations are pinned to the bottom,
 * exactly like a screenshot of a real device.
 *
 * @param {{ phoneShell: HTMLElement, includeFrame: boolean }} options
 * @returns {Promise<Blob>}
 */
export async function renderExportBlob({ phoneShell, includeFrame }) {
    const stage = document.createElement("div");
    stage.className = "snapshot-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.inert = true;

    const shell = phoneShell.cloneNode(true);
    stripIds(shell);
    shell.classList.add("is-export");

    const screen = shell.querySelector(".phone-screen");
    let target = shell;

    if (includeFrame) {
        shell.style.height = `${FRAME_HEIGHT}px`;
        shell.style.width = "auto";
        stage.appendChild(shell);
    } else {
        screen.classList.add("is-export-screen");
        screen.style.width = `${SCREEN_WIDTH}px`;
        screen.style.height = "auto";
        screen.style.minHeight = `${SCREEN_MIN_HEIGHT}px`;
        stage.appendChild(screen);
        target = screen;
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

export function exportFileName({ platform, theme, includeFrame }) {
    return `chatframe-${platform}-${theme}${includeFrame ? "-iphone" : ""}.png`;
}

export function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canCopyImages() {
    return typeof ClipboardItem === "function" && typeof navigator.clipboard?.write === "function";
}

/**
 * Copies a PNG to the clipboard. Safari only honours clipboard writes that are
 * set up synchronously inside the user gesture, so the ClipboardItem is handed
 * the pending blob rather than awaited first.
 */
export function copyBlobToClipboard(blobPromise) {
    const item = new ClipboardItem({ "image/png": blobPromise });

    return navigator.clipboard.write([item]);
}

function stripIds(root) {
    root.removeAttribute("id");
    root.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
}

/**
 * Scroll offsets do not survive serialisation, so when the conversation is
 * taller than the fixed screen, shift it up by the overflow instead.
 */
function pinToBottom(messages) {
    const inner = messages?.firstElementChild;

    if (!messages || !inner) {
        return;
    }

    const overflow = messages.scrollHeight - messages.clientHeight;

    if (overflow > 0) {
        messages.style.overflow = "hidden";
        inner.style.transform = `translateY(-${overflow}px)`;
    }
}

function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
