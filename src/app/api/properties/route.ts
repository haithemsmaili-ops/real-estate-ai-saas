import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email || "";

    const properties = jsonDb.getProperties(userEmail);
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email || "anonymous@propai.com";

    const body = await req.json();

    const newProperty = jsonDb.addProperty({
      title: body.title || "عقار جديد",
      type: body.type === "rent" ? "rent" : "sale",
      price: body.price || "0 دج",
      location: body.location || "غير محدد",
      status: body.status || "available",
      userEmail: userEmail,
    });

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}