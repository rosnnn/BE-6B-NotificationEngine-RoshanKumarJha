import type { Priority } from "../../events/models/types.js";

const policy: Record<Priority, { maxRetries: number; baseMs: number; maxMs: number }> = {
  1: { maxRetries: 10, baseMs: 500, maxMs: 60000 },
  2: { maxRetries: 5, baseMs: 1000, maxMs: 300000 },
  3: { maxRetries: 3, baseMs: 5000, maxMs: 1800000 },
  4: { maxRetries: 2, baseMs: 15000, maxMs: 3600000 },
  5: { maxRetries: 2, baseMs: 30000, maxMs: 7200000 },
};

export function computeBackoffMs(priority: Priority, attempt: number): number {
  const p = policy[priority];
  const exp = Math.min(p.maxMs, p.baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * p.baseMs);
  return Math.min(p.maxMs, exp + jitter);
}

export function maxRetries(priority: Priority): number {
  return policy[priority].maxRetries;
}
