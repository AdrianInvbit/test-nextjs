import {
  APP_NAME,
  APP_VERSION,
  getDeployMeta,
  type EnvMap,
} from "./deploy-meta";

export type HealthPayload = {
  status: "ok";
  name: string;
  version: string;
};

export function getHealthPayload(env: EnvMap = process.env): HealthPayload {
  const meta = getDeployMeta(env);

  return {
    status: "ok",
    name: meta.name || APP_NAME,
    version: meta.version || APP_VERSION,
  };
}
