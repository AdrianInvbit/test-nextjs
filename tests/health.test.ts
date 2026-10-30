import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";
import { getHealthPayload } from "../lib/health";

describe("endpoint de salud", () => {
  it("devuelve estado, nombre y versión", () => {
    const payload = getHealthPayload({});

    expect(payload).toEqual({
      status: "ok",
      name: "test-nextjs",
      version: "v0.1.0",
    });
  });

  it("responde JSON desde GET /api/health", async () => {
    const response = GET();
    const body = (await response.json()) as {
      status: string;
      name: string;
      version: string;
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/application\/json/);
    expect(body.status).toBe("ok");
    expect(body.name).toBe("test-nextjs");
    expect(body.version).toBe("v0.1.0");
  });
});
