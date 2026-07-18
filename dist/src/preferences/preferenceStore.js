const defaultPreferences = {
    channels: { sms: true, email: true, push: true, whatsapp: true, in_app: true },
    quiet_hours: { start: "22:00", end: "07:00", timezone: "Asia/Kolkata" },
    digest_mode: "immediate",
    promotional_opt_in: true,
};
const store = new Map();
export function getPreferences(userId) {
    const existing = store.get(userId);
    if (existing)
        return existing;
    const seeded = { user_id: userId, ...defaultPreferences };
    store.set(userId, seeded);
    return seeded;
}
export function updatePreferences(userId, input) {
    const current = getPreferences(userId);
    const next = {
        ...current,
        ...input,
        channels: { ...current.channels, ...input.channels },
    };
    store.set(userId, next);
    return next;
}
