import { selectChannels } from "../../src/notifications/routing/router.js";
import { describe, it, expect } from "vitest";

describe("selectChannels", () => {
  it("enforces regulatory channels for RISK-001", () => {
    const out = selectChannels(
      {
        event_id: "e1",
        event_type: "RISK-001",
        source_system: "risk",
        timestamp: new Date().toISOString(),
        priority: 1,
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        classification: "TRANSACTIONAL",
        payload: {},
      },
      {
        user_id: "550e8400-e29b-41d4-a716-446655440000",
        channels: { sms: false, email: true, push: true, whatsapp: false, in_app: true },
        quiet_hours: { start: "22:00", end: "07:00", timezone: "Asia/Kolkata" },
        digest_mode: "immediate",
        promotional_opt_in: true,
      },
    );

    expect(out).toEqual(["sms", "push", "in_app"]);
  });
});
