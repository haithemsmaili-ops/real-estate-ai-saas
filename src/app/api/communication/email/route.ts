import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, text } = body;

    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, text)" },
        { status: 400 }
      );
    }

    // هنا يمكنك إضافة منطق إرسال البريد الإلكتروني الخاص بك (مثل Nodemailer أو SendGrid)

    return NextResponse.json({
      success: true,
      message: "Email processed successfully",
    });
  } catch (error: any) {
    console.error("[API] Email error:", error);
    return NextResponse.json(
      { error: "Failed to process email", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}