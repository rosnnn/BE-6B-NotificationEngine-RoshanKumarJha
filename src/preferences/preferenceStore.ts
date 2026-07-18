import type { Channel, UserPreferences } from "../events/models/types.js";

const defaultPreferences: Omit<UserPreferences, "user_id"> = {
  channels: { sms: true, email: true, push: true, whatsapp: true, in_app: true },
  quiet_hours: { start: "22:00", end: "07:00", timezone: "Asia/Kolkata" },
  digest_mode: "immediate",
  promotional_opt_in: true,
};

const store = new Map<string, UserPreferences>();

export function getPreferences(userId: string): UserPreferences {
  const existing = store.get(userId);
  if (existing) return existing;
  const seeded: UserPreferences = { user_id: userId, ...defaultPreferences };
  store.set(userId, seeded);
  return seeded;
}

export function updatePreferences(
  userId: string,
  input: Partial<Pick<UserPreferences, "channels" | "quiet_hours" | "digest_mode" | "promotional_opt_in">>,
): UserPreferences {
  const current = getPreferences(userId);
  const next: UserPreferences = {
    ...current,
    ...input,
    channels: { ...current.channels, ...(input.channels as Partial<Record<Channel, boolean>> | undefined) },
  };
  store.set(userId, next);
  return next;
}
