import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession();

    // إمكانية جلب البريد سواء من السلسلة أو من جلسة NextAuth
    const userEmail = searchParams.get("userEmail") || session?.user?.email;

    let query = supabase.from("properties").select("*");

    if (userEmail) {
      query = query.eq("user_email", userEmail);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
    const body = await req.json();
    const session = await getServerSession();

    const userEmail = body.userEmail || session?.user?.email || "anonymous@propai.com";

    // إدراج كل البيانات القادمة من الاستمارة
    const { data: newProperty, error } = await supabase
      .from("properties")
      .insert([
        {
          user_email: userEmail,
          title: body.title || "عقار جديد",
          description: body.description || "",
          listing_type: body.listingType || "sale",
          property_type: body.propertyType || "apartment",
          price: body.price || "0",
          numeric_price: body.numericPrice || 0,
          currency: body.currency || "USD",
          country: body.country || "",
          city: body.city || "",
          district: body.district || "",
          address: body.address || "",
          location: body.location || "غير محدد",
          area: body.area || 0,
          area_unit: body.areaUnit || "sqm",
          bedrooms: body.bedrooms || 0,
          bathrooms: body.bathrooms || 0,
          legal_status: body.legalStatus || "freehold",
          status: body.status || "available",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase POST Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}