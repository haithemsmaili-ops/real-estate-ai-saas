import { env, requireEnv } from "@/config/env";
import type { MessagePayload } from "@/types/communication";

export interface EmailMessage extends MessagePayload {
  subject: string;
  html?: string;
}

/**
 * SendGrid email integration for Western markets (US, EU, CA, AU).
 * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
export class EmailService {
  async send(payload: EmailMessage): Promise<{ messageId: string }> {
    const apiKey = requireEnv(env.sendgrid.apiKey, "SENDGRID_API_KEY");
    const fromEmail = requireEnv(env.sendgrid.fromEmail, "SENDGRID_FROM_EMAIL");

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: fromEmail },
        subject: payload.subject,
        content: [
          {
            type: payload.html ? "text/html" : "text/plain",
            value: payload.html ?? payload.body,
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`SendGrid API error: ${error}`);
    }

    return { messageId: res.headers.get("x-message-id") ?? "unknown" };
  }
}

export const emailService = new EmailService();
