import { env, requireEnv } from "@/config/env";
import type { MessagePayload } from "@/types/communication";

export interface SmsMessage extends MessagePayload {}

/**
 * Twilio SMS integration for Western markets.
 * @see https://www.twilio.com/docs/sms/api
 */
export class SmsService {
  async send(payload: SmsMessage): Promise<{ messageId: string }> {
    const accountSid = requireEnv(env.twilio.accountSid, "TWILIO_ACCOUNT_SID");
    const authToken = requireEnv(env.twilio.authToken, "TWILIO_AUTH_TOKEN");
    const fromNumber = requireEnv(env.twilio.phoneNumber, "TWILIO_PHONE_NUMBER");

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString(
      "base64"
    );

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: payload.to,
          From: fromNumber,
          Body: payload.body,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Twilio API error: ${error}`);
    }

    const data = (await res.json()) as { sid: string };
    return { messageId: data.sid };
  }
}

export const smsService = new SmsService();
