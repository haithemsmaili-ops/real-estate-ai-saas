import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, client_name, phone_number, property_request } = body;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userEmail" },
        { status: 400 }
      );
    }

    if (!client_name || !phone_number) {
      return NextResponse.json(
        { success: false, error: "Missing client_name or phone_number" },
        { status: 400 }
      );
    }

    // Try to lookup user/tenant details for appropriate tenantId assignment, or fallback
    const user = jsonDb.getUserByEmail(userEmail);
    const tenantId = user?.id || "default";

    // Add new lead via jsonDb
    const newLead = jsonDb.addLead({
      userEmail,
      tenantId,
      name: client_name,
      phone: phone_number,
      source: "WhatsApp (AI Agent)",
      intentScore: 85,
      status: "new",
      locale: "en", // Default to English for international search or auto-detect if needed
      // Store property request in qualification summary so it displays in Lead Detail views
      qualification: {
        intent: "unknown",
        confidence: 1.0,
        summary: property_request || "No property request provided",
      },
      // Direct field backup
      propertyRequest: property_request || "",
    } as any);

    return NextResponse.json({
      success: true,
      message: "Lead added successfully to PropAI Dashboard",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error appending lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to append lead" },
      { status: 500 }
    );
  }
}
