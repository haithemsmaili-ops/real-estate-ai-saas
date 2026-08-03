import { NextResponse } from "next/server";
import { emailService } from "@/lib/services/communication/email.service";

/** POST /api/communication/email — Send email via SendGrid */
export async function POST(request: Request) {
  try {
    const { to, subject, body, html } = await request.json();

    if (!to || !body) {
      return NextResponse.json(
        { error: "to and body are required" },
        { status: 400 }
      );
    }

    const result = await emailService.send({ to, subject: subject ?? "Message", body, html });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Email send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
