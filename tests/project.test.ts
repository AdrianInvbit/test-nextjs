import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  APP_NAME,
  APP_VERSION,
  getDeployMeta,
  UNAVAILABLE,
} from "../lib/deploy-meta";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "README.md",
  ".gitignore",
  ".env.example",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "next-env.d.ts",
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/productos/page.tsx",
  "app/productos/[id]/page.tsx",
  "app/contador/page.tsx",
  "app/api/health/route.ts",
  "components/Counter.tsx",
  "lib/products.ts",
  "lib/deploy-meta.ts",
  "public/favicon.svg",
  "scripts/copy-standalone-assets.mjs",
  "scripts/start-standalone.mjs",
];

function readProjectFile(relativePath: string): string {
  return readFileSync(join(rootDir, relativePath), "utf8");
}

describe("estructura del proyecto", () => {
  it("incluye los archivos necesarios", () => {
    const missing = requiredFiles.filter(
      (relativePath) => !existsSync(join(rootDir, relativePath)),
    );
    expect(missing).toEqual([]);
  });

  it("declara el nombre, la versión, standalone y los scripts", () => {
    const packageJson = JSON.parse(readProjectFile("package.json")) as {
      name: string;
      version: string;
      engines: { node: string };
      scripts: Record<string, string>;
    };
    const nextConfig = readProjectFile("next.config.ts");
    const envExample = readProjectFile(".env.example");
    const gitignore = readProjectFile(".gitignore");

    expect(packageJson.name).toBe("test-nextjs");
    expect(packageJson.version).toBe("0.1.0");
    expect(packageJson.engines.node).toContain("20.9");
    expect(packageJson.scripts.dev).toContain("next dev");
    expect(packageJson.scripts.build).toBe("next build");
    expect(packageJson.scripts.start).toContain("scripts/start-standalone.mjs");
    expect(packageJson.scripts.test).toBe("vitest run");
    expect(nextConfig).toContain('output: "standalone"');
    expect(nextConfig).not.toContain('output: "export"');
    expect(packageJson.scripts.build).not.toContain("next export");
    expect(envExample).toContain("APP_NAME=");
    expect(envExample).toContain("APP_VERSION=");
    expect(envExample).toContain("GIT_BRANCH=");
    expect(envExample).toContain("GIT_COMMIT=");
    expect(envExample).toContain("BUILD_DATE=");
    expect(envExample).toContain("PORT=");
    expect(envExample).not.toContain("NEXT_PUBLIC_");
    expect(gitignore).toContain(".next");
    expect(gitignore).toContain("node_modules");
  });

  it("fuerza el renderizado dinámico de la página de inicio", () => {
    const homePage = readProjectFile("app/page.tsx");

    expect(homePage).toContain('export const dynamic = "force-dynamic"');
    expect(homePage).toContain("connection");
    expect(homePage).toContain("toISOString");
    expect(homePage).toContain("ssr-timestamp");
  });
});

describe("metadatos de despliegue", () => {
  it("usa valores conocidos y No disponible si faltan variables Git", () => {
    expect(APP_NAME).toBe("test-nextjs");
    expect(APP_VERSION).toBe("v0.1.0");

    const emptyMeta = getDeployMeta({});
    expect(emptyMeta.name).toBe("test-nextjs");
    expect(emptyMeta.version).toBe("v0.1.0");
    expect(emptyMeta.framework).toMatch(/^Next\.js/);
    expect(emptyMeta.branch).toBe(UNAVAILABLE);
    expect(emptyMeta.commit).toBe(UNAVAILABLE);
    expect(emptyMeta.buildDate).toBe(UNAVAILABLE);
  });

  it("incorpora las variables de entorno del servidor cuando existen", () => {
    const meta = getDeployMeta({
      APP_NAME: "test-nextjs",
      APP_VERSION: "v0.1.0",
      GIT_BRANCH: "main",
      GIT_COMMIT: "abc1234",
      BUILD_DATE: "2026-10-30T12:00:00Z",
    });

    expect(meta.branch).toBe("main");
    expect(meta.commit).toBe("abc1234");
    expect(meta.buildDate).toBe("2026-10-30T12:00:00Z");
    expect(meta.framework).toMatch(/^Next\.js \d+\./);
  });
});
