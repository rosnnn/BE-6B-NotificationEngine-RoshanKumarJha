export class MockProvider {
    channel;
    constructor(channel) {
        this.channel = channel;
    }
    async send(input) {
        return {
            ok: true,
            externalId: `${this.channel}_${input.notificationId}`,
        };
    }
}
