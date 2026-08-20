// Development server: `bun run serve` (or `bun serve.ts [directory]`).
//
// Serves a directory — the repo root by default — as static files so the ES
// modules load over HTTP, and transpiles `.ts` files on the fly so the browser
// can import the TypeScript sources directly. No watch step, no `dist/`:
// edits show up on the next reload. Types are stripped here, not checked;
// `bun run check` does the checking.
//
// `bun run serve dist` serves the output of `bun run build` instead, which is
// the closest thing to the shipped site.
//
// Dev-only — the site itself is static and has no runtime dependencies.

import { stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dir, Bun.argv[2] ?? ".");
const HOST = process.env["HOST"] || "127.0.0.1";
const PORT = Number(process.env["PORT"]) || 8765;

const NO_CACHE = { "Cache-Control": "no-store" };
const JAVASCRIPT = { "Content-Type": "text/javascript; charset=utf-8" };

const transpiler = new Bun.Transpiler({ loader: "ts", target: "browser" });

function reply(status: number, body: BodyInit | null, headers: Record<string, string> = {}): Response {
    return new Response(body, { status, headers: { ...NO_CACHE, ...headers } });
}

async function serveFile(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
        return reply(405, "Method Not Allowed", { Allow: "GET, HEAD" });
    }

    let pathname: string;
    try {
        pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
        return reply(400, "Bad Request");
    }
    if (pathname.includes("\0")) {
        return reply(400, "Bad Request");
    }

    // Never leave the served directory, even for encoded `..` segments.
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
    if (filePath.endsWith(".ts")) {
        // Strip the types, keep the `./module.ts` specifiers: the browser asks
        // for those next and lands back here.
        const source = await Bun.file(filePath).text();
        return reply(200, transpiler.transformSync(source), JAVASCRIPT);
    }
    return reply(200, Bun.file(filePath));
}

function start(): void {
    try {
        const server = Bun.serve({
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

        console.log(`chatframe → http://${server.hostname}:${server.port}  serving ${ROOT}  (Ctrl+C to stop)`);
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EADDRINUSE") {
            console.error(`Port ${PORT} is already in use. Try: PORT=8766 bun run serve`);
            process.exit(1);
        }
        throw error;
    }
}

start();
