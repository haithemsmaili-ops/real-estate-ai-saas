import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email || "";

    const leads = jsonDb.getLeads(userEmail);
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email || "anonymous@propai.com";

    const body = await req.json();

    const newLead = jsonDb.addLead({
      tenantId: body.tenantId || "default",
      name: body.name || "عميل جديد",
      email: body.email || "",
      phone: body.phone || "",
      source: body.source || "web",
      status: body.status || "new",
      intentScore: body.intentScore || 50,
      locale: body.locale || "ar",
      userEmail: userEmail, // إضافة حقل userEmail المطلوب
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}