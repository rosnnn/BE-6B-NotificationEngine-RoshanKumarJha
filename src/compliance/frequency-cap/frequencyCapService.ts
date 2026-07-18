import type { Priority } from "../../events/models/types.js";

const counters = new Map<string, number>();

const capByPriority: Record<Priority, number> = {
  1: 200,
  2: 120,
  3: 80,
  4: 40,
  5: 20,
};

export function withinFrequencyCap(userId: string, priority: Priority): boolean {
  const key = `${userId}:${priority}`;
  const current = counters.get(key) ?? 0;
  if (current >= capByPriority[priority]) return false;
  counters.set(key, current + 1);
  return true;
}
