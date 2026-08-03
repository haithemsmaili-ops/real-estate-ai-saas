import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, agency } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // طباعة البيانات في الـ Console للتحقق المحلي
    console.info(`[NEW LEAD CAPTURED]: ${email} ${name ? `— Name: ${name}` : ""} ${agency ? `— Agency: ${agency}` : ""}`);

    // ==========================================
    // ربط N8N Webhook هنا:
    // ==========================================
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL; 
    
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name: name || "Not provided",
            agency: agency || "Not provided",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error("[N8N Webhook Error]: Failed to dispatch lead", webhookError);
        // لا نوقف العملية إذا فشل الويب هوك، بل نستمر لكي لا يظهر خطأ للمستخدم
      }
    }

    return NextResponse.json({ success: true, message: "Lead saved successfully" });
  } catch (error) {
    console.error("[API] Demo request error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}