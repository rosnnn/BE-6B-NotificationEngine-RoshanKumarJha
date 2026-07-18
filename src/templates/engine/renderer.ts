import Handlebars from "handlebars";

Handlebars.registerHelper("inr", (value: number) => `Rs ${value.toLocaleString("en-IN")}`);

const templateMap = new Map<string, string>([
  ["RISK-001:sms", "MARGIN CALL: shortfall {{inr payload.shortfall_amount}}. Action needed now."],
  ["TXNX-001:push", "Order {{payload.order_id}} executed for {{payload.symbol}}."],
]);

export function renderTemplate(eventType: string, channel: string, payload: Record<string, unknown>): string {
  const key = `${eventType}:${channel}`;
  const template = templateMap.get(key) ?? "Notification: {{event_type}}";
  const compiled = Handlebars.compile(template);
  return compiled({ payload, event_type: eventType });
}
