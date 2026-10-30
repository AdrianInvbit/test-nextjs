import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = join(rootDir, ".next", "standalone");

function findServerFile(dir) {
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

const serverPath = findServerFile(standaloneRoot);

if (!serverPath) {
  console.error(
    "No existe .next/standalone/server.js. Ejecuta npm run build primero.",
  );
  process.exit(1);
}

const port = process.env.PORT || "3000";
const hostname = process.env.BIND_HOSTNAME || "0.0.0.0";

const child = spawn(process.execPath, [serverPath], {
  cwd: dirname(serverPath),
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname,
  },
  stdio: "inherit",
});

function forwardSignal(signal) {
  if (child.pid && process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  child.kill(signal);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => forwardSignal(signal));
}

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
