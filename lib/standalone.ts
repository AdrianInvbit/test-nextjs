import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function findStandaloneServer(rootDir: string): string | null {
  const standaloneRoot = join(rootDir, ".next", "standalone");
  return findServerFile(standaloneRoot);
}

function findServerFile(dir: string): string | null {
  const candidate = join(dir, "server.js");
  if (existsSync(candidate)) {
    return candidate;
  }

  if (!existsSync(dir)) {
    return null;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "node_modules") {
      const found = findServerFile(join(dir, entry.name));
      if (found) {
        return found;
      }
    }
  }

  return null;
}
