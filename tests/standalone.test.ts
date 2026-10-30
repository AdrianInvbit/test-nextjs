import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { products } from "../lib/products";
import { findStandaloneServer } from "../lib/standalone";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.TEST_STANDALONE_PORT || "4317";
const baseUrl = `http://127.0.0.1:${port}`;

let child: ChildProcess | undefined;

function stopProcess(processToStop: ChildProcess | undefined) {
  if (!processToStop?.pid) {
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(processToStop.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  processToStop.kill("SIGTERM");
}

async function waitForServer(url: string, timeoutMs = 25_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.status > 0) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw new Error(`El servidor standalone no respondió en ${url}`);
}

describe("compilación y servidor standalone", () => {
  beforeAll(async () => {
    const serverPath = findStandaloneServer(rootDir);
    expect(
      serverPath,
      "Ejecuta npm run build antes de esta prueba",
    ).toBeTruthy();

    const standaloneDir = dirname(serverPath as string);
    expect(existsSync(join(standaloneDir, ".next", "static"))).toBe(true);
    expect(existsSync(join(standaloneDir, "public", "favicon.svg"))).toBe(true);

    child = spawn(process.execPath, [serverPath as string], {
      cwd: standaloneDir,
      env: {
        ...process.env,
        PORT: port,
        HOSTNAME: "0.0.0.0",
      },
      stdio: "ignore",
      windowsHide: true,
    });

    await waitForServer(`${baseUrl}/api/health`);
  });

  afterAll(() => {
    stopProcess(child);
  });

  it("genera la salida standalone de producción", () => {
    const nextConfig = readFileSync(join(rootDir, "next.config.ts"), "utf8");
    expect(nextConfig).toContain('output: "standalone"');
    expect(existsSync(join(rootDir, ".next", "standalone"))).toBe(true);
    expect(findStandaloneServer(rootDir)).toBeTruthy();
  });

  it("renderiza la página de inicio en el servidor con una marca temporal", async () => {
    const first = await fetch(`${baseUrl}/`);
    const firstHtml = await first.text();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const second = await fetch(`${baseUrl}/`);
    const secondHtml = await second.text();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(firstHtml).toContain("test-nextjs");
    expect(firstHtml).toContain("v0.1.0");
    expect(firstHtml).toContain("Next.js");
    expect(firstHtml).toContain("No disponible");

    const firstStamp = firstHtml.match(
      /id="ssr-timestamp"[^>]*>([^<]+)</,
    )?.[1];
    const secondStamp = secondHtml.match(
      /id="ssr-timestamp"[^>]*>([^<]+)</,
    )?.[1];

    expect(firstStamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(secondStamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(firstStamp).not.toBe(secondStamp);
  });

  it("lista los productos y resuelve una ruta dinámica", async () => {
    const listResponse = await fetch(`${baseUrl}/productos`);
    const listHtml = await listResponse.text();
    const product = products[0];
    const detailResponse = await fetch(`${baseUrl}/productos/${product.id}`);
    const detailHtml = await detailResponse.text();

    expect(listResponse.status).toBe(200);
    for (const item of products) {
      expect(listHtml).toContain(item.name);
      expect(listHtml).toContain(`/productos/${item.id}`);
    }

    expect(detailResponse.status).toBe(200);
    expect(detailHtml).toContain(product.name);
    expect(detailHtml).toContain(product.price);
    expect(detailHtml).toContain(product.id);
  });

  it("responde 404 si el producto no existe", async () => {
    const response = await fetch(`${baseUrl}/productos/no-existe`);
    const html = await response.text();

    expect(response.status).toBe(404);
    expect(html).toContain("Producto no encontrado");
  });

  it("sirve el contador interactivo y el endpoint de salud", async () => {
    const counterResponse = await fetch(`${baseUrl}/contador`);
    const counterHtml = await counterResponse.text();
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const health = (await healthResponse.json()) as {
      status: string;
      name: string;
      version: string;
    };

    expect(counterResponse.status).toBe(200);
    expect(counterHtml).toContain("id=\"counter-value\"");
    expect(counterHtml).toContain("Incrementar");
    expect(healthResponse.status).toBe(200);
    expect(health).toEqual({
      status: "ok",
      name: "test-nextjs",
      version: "v0.1.0",
    });
  });
});
