import type { CommunicationChannel, MessagePayload } from "@/types/communication";
import { whatsAppService } from "./whatsapp.service";
import { emailService } from "./email.service";
import { smsService } from "./sms.service";

/**
 * Unified omnichannel dispatcher — routes messages to the appropriate provider.
 */
export class OmnichannelService {
  async send(
    channel: CommunicationChannel,
    payload: MessagePayload & { subject?: string; html?: string }
  ): Promise<{ messageId: string; channel: CommunicationChannel }> {
    switch (channel) {
      case "whatsapp":
        return {
          channel,
          ...(await whatsAppService.sendMessage(payload)),
        };
      case "email":
        return {
          channel,
          ...(await emailService.send({
            ...payload,
            subject: payload.subject ?? "Message from your agency",
          })),
        };
      case "sms":
        return {
          channel,
          ...(await smsService.send(payload)),
        };
      default:
        throw new Error(`Unsupported channel: ${channel satisfies never}`);
    }
  }

  /** Returns connection status for each channel based on env config */
  getChannelStatuses() {
    return [
      {
        channel: "whatsapp" as const,
        connected: Boolean(
          process.env.WHATSAPP_CLOUD_API_TOKEN &&
            process.env.WHATSAPP_PHONE_NUMBER_ID
        ),
      },
      {
        channel: "email" as const,
        connected: Boolean(
          process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL
        ),
      },
      {
        channel: "sms" as const,
        connected: Boolean(
          process.env.TWILIO_ACCOUNT_SID &&
            process.env.TWILIO_AUTH_TOKEN &&
            process.env.TWILIO_PHONE_NUMBER
        ),
      },
    ];
  }
}

export const omnichannelService = new OmnichannelService();
