import type { Channel } from "../../events/models/types.js";

export interface DeliveryRequest {
  notificationId: string;
  channel: Channel;
  userId: string;
  content: string;
}

export interface DeliveryProvider {
  readonly channel: Channel;
  send(input: DeliveryRequest): Promise<{ ok: boolean; externalId: string }>;
}

export class MockProvider implements DeliveryProvider {
  public constructor(public readonly channel: Channel) {}

  public async send(input: DeliveryRequest): Promise<{ ok: boolean; externalId: string }> {
    return {
      ok: true,
      externalId: `${this.channel}_${input.notificationId}`,
    };
  }
}
