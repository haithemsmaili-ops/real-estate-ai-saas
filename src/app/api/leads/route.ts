import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);

    // جلب الإيميل من الجلسة أو من الرابط إذا وجد
    const userEmail = searchParams.get("userEmail") || session?.user?.email || "";

    const leads = await jsonDb.getLeads(userEmail);
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Fetch Leads Error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();

    const userEmail = body.userEmail || session?.user?.email || "anonymous@propai.com";

    const newLead = await jsonDb.addLead({
      tenantId: body.tenantId || "default",
      name: body.name || "عميل جديد",
      email: body.email || "",
      phone: body.phone || "",
      source: body.source || "web",
      status: body.status || "new",
      intentScore: body.intentScore || 50,
      locale: body.locale || "ar",
      userEmail: userEmail,
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Create Lead Error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}