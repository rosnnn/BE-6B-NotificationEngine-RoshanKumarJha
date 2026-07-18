const baseWeights = {
    sms: 95,
    push: 88,
    in_app: 85,
    whatsapp: 75,
    email: 70,
};
export function selectChannels(event, prefs) {
    const forcedRegulatory = event.event_type === "RISK-001" || event.event_type === "RISK-002";
    if (forcedRegulatory)
        return ["sms", "push", "in_app"];
    const allowed = Object.keys(prefs.channels).filter((channel) => prefs.channels[channel]);
    const scored = allowed
        .map((channel) => ({
        channel,
        score: baseWeights[channel] - event.priority * 4,
    }))
        .sort((a, b) => b.score - a.score);
    const top = scored.slice(0, event.priority <= 2 ? 3 : 2).map((s) => s.channel);
    return top.length ? top : ["in_app"];
}
