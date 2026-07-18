import type { UserPreferences } from "../../events/models/types.js";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((v) => Number(v));
  return h * 60 + m;
}

export function isQuietHours(now: Date, prefs: UserPreferences): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(prefs.quiet_hours.start);
  const end = toMinutes(prefs.quiet_hours.end);
  if (start < end) return mins >= start && mins < end;
  return mins >= start || mins < end;
}
