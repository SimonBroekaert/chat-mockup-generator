// Development server: `bun run serve` (or `bun serve.js`).
//
// Serves the repo root as static files so the ES modules load over HTTP.
// Dev-only — the site itself is static and has no runtime dependencies.
// Files are read per request, so edits show up on the next reload.

import { stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const ROOT = import.meta.dir;
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 8765;

const NO_CACHE = { "Cache-Control": "no-store" };

function reply(status, body, headers = {}) {
    return new Response(body, { status, headers: { ...NO_CACHE, ...headers } });
}

async function serveFile(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
        return reply(405, "Method Not Allowed", { Allow: "GET, HEAD" });
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
        return reply(400, "Bad Request");
    }
    if (pathname.includes("\0")) {
        return reply(400, "Bad Request");
    }

    // Never leave the repo root, even for encoded `..` segments.
    const filePath = resolve(ROOT, `.${pathname}`);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
        return reply(403, "Forbidden");
    }

    const info = await stat(filePath).catch(() => null);
    if (info === null) {
        return reply(404, "Not Found");
    }
    if (info.isDirectory()) {
        if (!pathname.endsWith("/")) {
            return reply(301, null, { Location: `${pathname}/` });
        }
        const index = Bun.file(`${filePath}/index.html`);
        return (await index.exists()) ? reply(200, index) : reply(404, "Not Found");
    }
    return reply(200, Bun.file(filePath));
}

let server;
try {
    server = Bun.serve({
        hostname: HOST,
        port: PORT,
        development: true,
        async fetch(request) {
            const response = await serveFile(request);
            console.log(`${response.status} ${request.method} ${new URL(request.url).pathname}`);
            return response;
        },
        error(error) {
            console.error(error);
            return reply(500, "Internal Server Error");
        },
    });
} catch (error) {
    if (error?.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Try: PORT=8766 bun run serve`);
        process.exit(1);
    }
    throw error;
}

console.log(`chatframe → http://${server.hostname}:${server.port}  (Ctrl+C to stop)`);
