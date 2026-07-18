import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import pino from "pino";
import { randomUUID } from "node:crypto";
import { metricsRegistry, eventsReceived, deliveryLatency } from "./analytics/metrics.js";
import { isDndRegistered } from "./compliance/dnd/dndService.js";
import { withinFrequencyCap } from "./compliance/frequency-cap/frequencyCapService.js";
import { isQuietHours } from "./compliance/quiet-hours/quietHoursService.js";
import type { FinancialEvent, NotificationRecord } from "./events/models/types.js";
import { eventSchema } from "./events/validators/eventValidator.js";
import { selectChannels } from "./notifications/routing/router.js";
import { getPreferences, updatePreferences } from "./preferences/preferenceStore.js";
import { renderTemplate } from "./templates/engine/renderer.js";

dotenv.config();

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((req, _res, next) => {
  logger.info({ method: req.method, path: req.path }, "request");
  next();
});

const notifications = new Map<string, NotificationRecord & { content: string; channels_selected: string[] }>();

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    checks: {
      database: "simulated_up",
      redis: "simulated_up",
      kafka: "simulated_up",
      rabbitmq: "simulated_up",
      providers: "simulated_up",
    },
  });
});

app.get("/metrics", async (_req, res) => {
  res.setHeader("Content-Type", metricsRegistry.contentType);
  res.send(await metricsRegistry.metrics());
});

app.post("/api/v1/events", (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      error: "VALIDATION_FAILED",
      message: "Event payload validation failed",
      details: parsed.error.issues,
    });
  }

  const event = parsed.data as FinancialEvent;
  eventsReceived.labels(event.event_type, String(event.priority)).inc();

  const prefs = getPreferences(event.user_id);
  const channels = selectChannels(event, prefs);

  if (event.classification === "PROMOTIONAL" && !prefs.promotional_opt_in) {
    return res.status(202).json({ event_id: event.event_id, status: "SKIPPED_PROMOTIONAL_OPT_OUT" });
  }

  if (isDndRegistered(event.user_id) && event.classification === "PROMOTIONAL") {
    return res.status(202).json({ event_id: event.event_id, status: "DND_BLOCKED" });
  }

  if (!withinFrequencyCap(event.user_id, event.priority)) {
    return res.status(429).json({ event_id: event.event_id, status: "FREQUENCY_CAP_EXCEEDED" });
  }

  const now = new Date();
  if (isQuietHours(now, prefs) && event.priority >= 4) {
    return res.status(202).json({ event_id: event.event_id, status: "QUEUED_FOR_DIGEST" });
  }

  const t0 = process.hrtime.bigint();
  const notificationId = randomUUID();
  const channel = channels[0];
  const content = renderTemplate(event.event_type, channel, event.payload);
  notifications.set(notificationId, {
    notification_id: notificationId,
    event_id: event.event_id,
    event_type: event.event_type,
    user_id: event.user_id,
    channel,
    priority: event.priority,
    status: "DELIVERED",
    retry_attempts: 0,
    created_at: now.toISOString(),
    content,
    channels_selected: channels,
  });

  const t1 = process.hrtime.bigint();
  const seconds = Number(t1 - t0) / 1_000_000_000;
  deliveryLatency.labels(channel, String(event.priority)).observe(seconds);

  return res.status(202).json({
    event_id: event.event_id,
    status: "CREATED",
    channels_targeted: channels,
    estimated_delivery_ms: Math.ceil(seconds * 1000),
    created_at: now.toISOString(),
    notification_id: notificationId,
  });
});

app.get("/api/v1/users/:userId/preferences", (req, res) => {
  const prefs = getPreferences(req.params.userId);
  res.json(prefs);
});

app.put("/api/v1/users/:userId/preferences", (req, res) => {
  const updated = updatePreferences(req.params.userId, req.body ?? {});
  res.json(updated);
});

app.get("/api/v1/notifications/:notificationId", (req, res) => {
  const item = notifications.get(req.params.notificationId);
  if (!item) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json(item);
});

app.get("/api/v1/analytics/delivery-rates", (_req, res) => {
  const records = [...notifications.values()];
  const delivered = records.filter((r) => r.status === "DELIVERED").length;
  const total = records.length;
  res.json({
    total,
    delivered,
    delivery_rate: total === 0 ? 1 : delivered / total,
    by_priority: {
      CRITICAL: records.filter((r) => r.priority === 1).length,
      HIGH: records.filter((r) => r.priority === 2).length,
      MEDIUM: records.filter((r) => r.priority === 3).length,
      LOW: records.filter((r) => r.priority >= 4).length,
    },
  });
});

app.get("/api/v1/analytics/channel-performance", (_req, res) => {
  const out = [...notifications.values()].reduce<Record<string, number>>((acc, cur) => {
    acc[cur.channel] = (acc[cur.channel] ?? 0) + 1;
    return acc;
  }, {});
  res.json(out);
});

app.get("/api/v1/analytics/opt-out-trends", (_req, res) => {
  res.json({ period: "7d", promotional_opt_outs: 0, simulated: true });
});

export { app };

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    logger.info({ port }, "notification engine listening");
  });
}
