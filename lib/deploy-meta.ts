import { createRequire } from "node:module";

export const APP_NAME = "test-nextjs";
export const APP_VERSION = "v0.1.0";
export const UNAVAILABLE = "No disponible";

export type DeployMeta = {
  name: string;
  version: string;
  framework: string;
  branch: string;
  commit: string;
  buildDate: string;
};

const nodeRequire = createRequire(import.meta.url);

export type EnvMap = Record<string, string | undefined>;

function readEnv(env: EnvMap, key: string, fallback: string): string {
  const trimmed = env[key]?.trim();
  return trimmed ? trimmed : fallback;
}

export function getNextVersion(): string {
  try {
    const pkg = nodeRequire("next/package.json") as { version?: string };
    const version = pkg.version?.trim();
    return version ? version : UNAVAILABLE;
  } catch {
    return UNAVAILABLE;
  }
}

export function getFrameworkLabel(): string {
  const version = getNextVersion();
  return version === UNAVAILABLE ? "Next.js" : `Next.js ${version}`;
}

export function getDeployMeta(env: EnvMap = process.env): DeployMeta {
  return {
    name: readEnv(env, "APP_NAME", APP_NAME),
    version: readEnv(env, "APP_VERSION", APP_VERSION),
    framework: getFrameworkLabel(),
    branch: readEnv(env, "GIT_BRANCH", UNAVAILABLE),
    commit: readEnv(env, "GIT_COMMIT", UNAVAILABLE),
    buildDate: readEnv(env, "BUILD_DATE", UNAVAILABLE),
  };
}
