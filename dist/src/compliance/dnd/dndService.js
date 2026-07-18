const dndRegistry = new Set([
    "11111111-1111-1111-1111-111111111111",
    "22222222-2222-2222-2222-222222222222",
]);
export function isDndRegistered(userId) {
    return dndRegistry.has(userId);
}
