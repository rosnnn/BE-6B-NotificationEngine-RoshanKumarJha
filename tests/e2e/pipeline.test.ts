import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/index.js";

describe("Pipeline e2e", () => {
  it("ingests event and exposes analytics", async () => {
    const userId = "550e8400-e29b-41d4-a716-446655440001";
    const post = await request(app).post("/api/v1/events").send({
      event_id: "EVT-e2e-1",
      event_type: "TXNX-001",
      source_system: "trade_engine",
      timestamp: new Date().toISOString(),
      priority: 2,
      user_id: userId,
      classification: "TRANSACTIONAL",
      payload: { order_id: "O-1", symbol: "RELIANCE" },
    });
    expect(post.status).toBe(202);

    const analytics = await request(app).get("/api/v1/analytics/delivery-rates");
    expect(analytics.status).toBe(200);
    expect(analytics.body.total).toBeGreaterThan(0);
  });
});
