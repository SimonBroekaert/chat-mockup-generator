/**
 * DOM → PNG without a second renderer.
 *
 * The preview is already rendered by the browser with the real stylesheet, so
 * the export simply serialises a styled clone of it into an SVG <foreignObject>
 * and draws that onto a canvas. Whatever the CSS does, the PNG does too.
 *
 * Deliberate constraints that keep this small instead of pulling in a library:
 *  - System fonts only. An SVG image cannot load external resources, so web
 *    fonts would silently fall back. The chat screen uses the system UI stack.
 *  - No external images, iframes or canvases inside the snapshotted subtree.
 *  - Scroll offsets are not serialised; callers position content explicitly.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const PSEUDO_ELEMENTS = ["::before", "::after"];

/**
 * @param {Element} element  Laid-out element to rasterise.
 * @param {object} [options]
 * @param {number} [options.scale=2]    Device pixels per CSS pixel.
 * @param {number} [options.padding=0]  CSS pixels of transparent margin around the element,
 *                                      for shadows or children that stick out of its box.
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function snapshotElement(element, { scale = 2, padding = 0 } = {}) {
    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width) + padding * 2;
    const height = Math.ceil(rect.height) + padding * 2;

    const pseudoRules = [];
    const clone = cloneWithStyles(element, pseudoRules);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `margin:0;padding:${padding}px;width:${width}px;height:${height}px;box-sizing:border-box;`;

    if (pseudoRules.length > 0) {
        const style = document.createElement("style");
        style.textContent = pseudoRules.join("\n");
        wrapper.appendChild(style);
    }

    wrapper.appendChild(clone);

    const foreignObject = document.createElementNS(SVG_NS, "foreignObject");
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    foreignObject.setAttribute("width", String(width));
    foreignObject.setAttribute("height", String(height));
    foreignObject.appendChild(wrapper);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("xmlns", SVG_NS);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.appendChild(foreignObject);

    const markup = new XMLSerializer().serializeToString(svg);
    const image = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas 2D is not available");
    }

    context.scale(scale, scale);
    await drawUntilPainted(context, image, width, height);

    return canvas;
}

export function canvasToBlob(canvas, type = "image/png") {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image"))), type);
    });
}

/** Deep-clones a node, baking every computed style into inline styles. */
function cloneWithStyles(source, pseudoRules) {
    const clone = source.cloneNode(false);

    if (source.nodeType !== Node.ELEMENT_NODE) {
        return clone;
    }

    clone.setAttribute("style", serializeDeclarations(getComputedStyle(source)));

    for (const pseudo of PSEUDO_ELEMENTS) {
        const computed = getComputedStyle(source, pseudo);
        const content = computed.getPropertyValue("content");

        if (!content || content === "none" || content === "normal") {
            continue;
        }

        const className = `snapshot-pseudo-${pseudoRules.length}`;
        clone.classList.add(className);
        pseudoRules.push(`.${className}${pseudo}{${serializeDeclarations(computed)}}`);
    }

    for (const child of source.childNodes) {
        clone.appendChild(cloneWithStyles(child, pseudoRules));
    }

    return clone;
}

function serializeDeclarations(computed) {
    const declarations = [];

    for (let index = 0; index < computed.length; index += 1) {
        const property = computed[index];
        declarations.push(`${property}:${computed.getPropertyValue(property)}`);
    }

    return declarations.join(";");
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("The browser could not rasterise the preview"));
        image.src = url;
    }).then((image) => (image.decode ? image.decode().then(() => image, () => image) : image));
}

/**
 * Safari occasionally paints nothing on the first drawImage of a foreignObject
 * SVG. The centre of every export is opaque, so sample it and retry if blank.
 */
async function drawUntilPainted(context, image, width, height) {
    for (let attempt = 0; attempt < 4; attempt += 1) {
        context.drawImage(image, 0, 0, width, height);

        const { canvas } = context;
        const pixel = context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;

        if (pixel[3] > 0) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)));
    }
}
