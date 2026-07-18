const counters = new Map();
const capByPriority = {
    1: 200,
    2: 120,
    3: 80,
    4: 40,
    5: 20,
};
export function withinFrequencyCap(userId, priority) {
    const key = `${userId}:${priority}`;
    const current = counters.get(key) ?? 0;
    if (current >= capByPriority[priority])
        return false;
    counters.set(key, current + 1);
    return true;
}
