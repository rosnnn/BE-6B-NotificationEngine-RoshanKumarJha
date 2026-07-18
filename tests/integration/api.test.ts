import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../../src/index.js";

describe("API integration", () => {
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  it("returns health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("creates event", async () => {
    const response = await request(app).post("/api/v1/events").send({
      event_id: "EVT-123456",
      event_type: "RISK-001",
      source_system: "risk_engine",
      timestamp: new Date().toISOString(),
      priority: 1,
      user_id: userId,
      classification: "TRANSACTIONAL",
      payload: { shortfall_amount: 125000 },
    });
    expect(response.status).toBe(202);
    expect(response.body.status).toBe("CREATED");
  });

  it("rejects invalid event", async () => {
    const response = await request(app).post("/api/v1/events").send({
      event_id: "EVT-x",
      event_type: "RISK-001",
    });
    expect(response.status).toBe(422);
  });

  it("gets and updates preferences", async () => {
    const getResponse = await request(app).get(`/api/v1/users/${userId}/preferences`);
    expect(getResponse.status).toBe(200);

    const putResponse = await request(app)
      .put(`/api/v1/users/${userId}/preferences`)
      .send({ promotional_opt_in: false });
    expect(putResponse.status).toBe(200);
    expect(putResponse.body.promotional_opt_in).toBe(false);
  });
});
