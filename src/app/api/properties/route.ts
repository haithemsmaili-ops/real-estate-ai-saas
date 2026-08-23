import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email;

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
    const session = await getServerSession();
    const userEmail = session?.user?.email || "anonymous@propai.com";

    const body = await req.json();

    const { data: newProperty, error } = await supabase
      .from("properties")
      .insert([
        {
          user_email: userEmail,
          title: body.title || "عقار جديد",
          listing_type: body.type === "rent" ? "rent" : "sale",
          price: body.price || "0 دج",
          location: body.location || "غير محدد",
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