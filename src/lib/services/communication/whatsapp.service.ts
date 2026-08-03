import { env, requireEnv } from "@/config/env";
import type { MessagePayload } from "@/types/communication";

export interface WhatsAppMessage extends MessagePayload {
  templateName?: string;
  templateParams?: string[];
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
        }>;
      };
      field: string;
    }>;
  }>;
}

const WHATSAPP_API_BASE = "https://graph.facebook.com/v21.0";

/**
 * WhatsApp Cloud API integration for Gulf / MENA markets.
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api
 */
export class WhatsAppService {
  private getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async sendMessage(payload: WhatsAppMessage): Promise<{ messageId: string }> {
    const token = requireEnv(env.whatsapp.token, "WHATSAPP_CLOUD_API_TOKEN");
    const phoneNumberId = requireEnv(
      env.whatsapp.phoneNumberId,
      "WHATSAPP_PHONE_NUMBER_ID"
    );

    const body = payload.templateName
      ? {
          messaging_product: "whatsapp",
          to: payload.to,
          type: "template",
          template: {
            name: payload.templateName,
            language: { code: payload.locale === "ar" ? "ar" : "en" },
            components: payload.templateParams
              ? [
                  {
                    type: "body",
                    parameters: payload.templateParams.map((text) => ({
                      type: "text",
                      text,
                    })),
                  },
                ]
              : [],
          },
        }
      : {
          messaging_product: "whatsapp",
          to: payload.to,
          type: "text",
          text: { body: payload.body },
        };

    const res = await fetch(`${WHATSAPP_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`WhatsApp API error: ${error}`);
    }

    const data = (await res.json()) as { messages: Array<{ id: string }> };
    return { messageId: data.messages[0].id };
  }

  /** Verify webhook subscription challenge from Meta */
  verifyWebhook(
    mode: string | null,
    token: string | null,
    challenge: string | null
  ): string | null {
    const verifyToken = env.whatsapp.webhookVerifyToken;
    if (mode === "subscribe" && token === verifyToken && challenge) {
      return challenge;
    }
    return null;
  }

  /** Parse inbound webhook payload into normalized messages */
  parseWebhookPayload(payload: WhatsAppWebhookPayload) {
    const messages: Array<{ from: string; body: string; messageId: string }> =
      [];

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        for (const msg of change.value.messages ?? []) {
          if (msg.type === "text" && msg.text) {
            messages.push({
              from: msg.from,
              body: msg.text.body,
              messageId: msg.id,
            });
          }
        }
      }
    }

    return messages;
  }
}

export const whatsAppService = new WhatsAppService();
