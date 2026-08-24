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

    // إضافة await هنا لحل مشكلة الـ Promise
    const user = await jsonDb.getUserByEmail(userEmail);
    const tenantId = user?.id || "default";

    // إضافة await عند إضافة الـ lead في قاعدة البيانات
    const newLead = await jsonDb.addLead({
      userEmail,
      tenantId,
      name: client_name,
      phone: phone_number,
      source: "WhatsApp (AI Agent)",
      intentScore: 85,
      status: "new",
      locale: "en",
      qualification: {
        intent: "unknown",
        confidence: 1.0,
        summary: property_request || "No property request provided",
      },
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