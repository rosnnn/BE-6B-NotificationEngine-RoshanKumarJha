import { z } from "zod";

export const eventSchema = z.object({
  event_id: z.string().min(6),
  event_type: z.string().min(4),
  source_system: z.string().min(2),
  timestamp: z.string().datetime(),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  user_id: z.string().uuid(),
  classification: z.union([z.literal("TRANSACTIONAL"), z.literal("PROMOTIONAL")]),
  payload: z.record(z.unknown()),
});

export type EventInput = z.infer<typeof eventSchema>;
