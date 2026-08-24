import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    const user = await jsonDb.getUserByEmail(userEmail);
    const tenantId = user?.id || "default";

    // تنفيذ عملية Upsert لمنع تكرار الليد بناءً على رقم الهاتف
    const { data: newLead, error } = await supabase
      .from("leads")
      .upsert(
        {
          user_email: userEmail,
          name: client_name,
          phone: phone_number,
          source: "WhatsApp (AI Agent)",
          status: "new",
        },
        { onConflict: "phone" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead processed successfully in PropAI Dashboard",
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