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

    console.info(`[WhatsApp] Received ${messages.length} message(s)`);

    // معالجة وتوجيه الرسائل المسلّمة من الـ Webhook
    for (const msg of messages) {
      const senderPhone = msg.from;
      // التأكد من استخراج النص بأمان لتفادي أخطاء TypeScript
      const messageText = (msg as any).text?.body || "";

      if (messageText) {
        // توجيه الرسالة إلى Chat API الداخلي للتجاوب التلقائي وحفظ المحادثة
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

        await fetch(`${protocol}://${host}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            leadInfo: {
              phone: senderPhone,
              channel: "whatsapp",
            },
          }),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[API] WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}