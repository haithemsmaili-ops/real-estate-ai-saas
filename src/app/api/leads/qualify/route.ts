import { NextResponse } from "next/server";
import { leadQualifierService } from "@/lib/services/lead-qualifier";

/** POST /api/leads/qualify — AI lead qualification endpoint */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, locale = "en", tenantId = "demo" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await leadQualifierService.qualify({
      message,
      locale,
      tenantId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Lead qualification error:", error);
    return NextResponse.json(
      { error: "Failed to qualify lead" },
      { status: 500 }
    );
  }
}
