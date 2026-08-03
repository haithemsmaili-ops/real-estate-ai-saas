import { NextResponse } from "next/server";
import { smsService } from "@/lib/services/communication/sms.service";

/** POST /api/communication/sms — Send SMS via Twilio */
export async function POST(request: Request) {
  try {
    const { to, body } = await request.json();

    if (!to || !body) {
      return NextResponse.json(
        { error: "to and body are required" },
        { status: 400 }
      );
    }

    const result = await smsService.send({ to, body });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] SMS send error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send SMS" },
      { status: 500 }
    );
  }
}
