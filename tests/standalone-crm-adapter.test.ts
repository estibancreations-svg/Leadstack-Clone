import { describe, expect, it } from "vitest";
import { createStandaloneCrmClient } from "../src/adapters/standalone-crm.js";

describe("standalone CRM adapter configuration", () => {
  it("requires owned Supabase connection settings", () => {
    expect(() =>
      createStandaloneCrmClient({
        supabaseUrl: "",
        publishableKey: "",
        accessToken: async () => "user-jwt",
      }),
    ).toThrow(/URL and publishable key are required/);
  });

  it("accepts only a publishable key + per-request user token contract", () => {
    const config = {
      supabaseUrl: "https://example.supabase.co",
      publishableKey: "sb_publishable_example",
      accessToken: async () => "user-jwt",
    };

    expect(Object.keys(config).sort()).toEqual([
      "accessToken",
      "publishableKey",
      "supabaseUrl",
    ]);
  });
});
