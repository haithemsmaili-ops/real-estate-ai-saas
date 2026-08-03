export type CommunicationChannel = "whatsapp" | "email" | "sms";

export interface ChannelStatus {
  channel: CommunicationChannel;
  connected: boolean;
  lastSyncAt?: Date;
  errorMessage?: string;
}

export interface MessagePayload {
  to: string;
  body: string;
  locale?: "en" | "ar";
  metadata?: Record<string, string>;
}

export interface InboundMessage {
  id: string;
  channel: CommunicationChannel;
  from: string;
  body: string;
  tenantId: string;
  receivedAt: Date;
}
