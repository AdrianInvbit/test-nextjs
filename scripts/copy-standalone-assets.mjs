import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = join(rootDir, ".next", "standalone");

function findStandaloneDir(dir) {
  if (existsSync(join(dir, "server.js"))) {
    return dir;
  }

  if (!existsSync(dir)) {
    return null;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "node_modules") {
      const found = findStandaloneDir(join(dir, entry.name));
      if (found) {
        return found;
      }
    }
  }

  return null;
}

const standaloneDir = findStandaloneDir(standaloneRoot);

if (!standaloneDir) {
  console.error(
    "No se encontró .next/standalone/server.js. Ejecuta npm run build primero.",
  );
  process.exit(1);
}

const publicDir = join(rootDir, "public");
if (existsSync(publicDir)) {
  cpSync(publicDir, join(standaloneDir, "public"), { recursive: true });
}

const staticDir = join(rootDir, ".next", "static");
if (existsSync(staticDir)) {
  const destination = join(standaloneDir, ".next", "static");
  mkdirSync(join(standaloneDir, ".next"), { recursive: true });
  cpSync(staticDir, destination, { recursive: true });
}

console.log(`Recursos estáticos copiados a ${standaloneDir}`);
