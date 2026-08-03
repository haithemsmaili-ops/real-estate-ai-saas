import { NextResponse } from "next/server";
import { whatsAppService } from "@/lib/services/communication/whatsapp.service";

/** GET — Meta webhook verification */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const result = whatsAppService.verifyWebhook(mode, token, challenge);
  if (result) {
    return new Response(result, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** POST — Inbound WhatsApp messages */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const messages = whatsAppService.parseWebhookPayload(payload);

    // TODO: Route messages to lead qualifier and omnichannel inbox
    console.info(`[WhatsApp] Received ${messages.length} message(s)`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[API] WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
