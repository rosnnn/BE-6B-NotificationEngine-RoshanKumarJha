export type Channel = "sms" | "email" | "push" | "whatsapp" | "in_app";

export type Priority = 1 | 2 | 3 | 4 | 5;

export type Classification = "TRANSACTIONAL" | "PROMOTIONAL";

export type EventType =
  | "RISK-001"
  | "RISK-002"
  | "REGX-001"
  | "REGX-002"
  | "TXNX-001"
  | "TXNX-002"
  | "TXNX-003"
  | "TXNX-004"
  | "TXNX-005"
  | "MKTX-001"
  | "MKTX-002"
  | "MKTX-003"
  | "SIPX-001"
  | "SIPX-002"
  | "SIPX-003"
  | "LOAN-001"
  | "LOAN-002"
  | "CARD-001"
  | "CARD-002"
  | "INS-001"
  | "INS-002"
  | "KYC-001"
  | "KYC-002"
  | "SEC-001"
  | "SEC-002"
  | "WALT-001";

export interface FinancialEvent {
  event_id: string;
  event_type: EventType;
  source_system: string;
  timestamp: string;
  priority: Priority;
  user_id: string;
  classification: Classification;
  payload: Record<string, unknown>;
}

export interface UserPreferences {
  user_id: string;
  channels: Record<Channel, boolean>;
  quiet_hours: { start: string; end: string; timezone: string };
  digest_mode: "immediate" | "daily";
  promotional_opt_in: boolean;
}

export interface NotificationRecord {
  notification_id: string;
  event_id: string;
  event_type: EventType;
  user_id: string;
  channel: Channel;
  priority: Priority;
  status: "CREATED" | "ROUTED" | "DELIVERED" | "FAILED";
  retry_attempts: number;
  created_at: string;
}
