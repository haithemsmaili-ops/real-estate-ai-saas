import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      listingType,
      propertyType,
      price,
      numericPrice,
      currency,
      country,
      city,
      district,
      address,
      location,
      area,
      areaUnit,
      bedrooms,
      bathrooms,
      legalStatus,
      status,
      images,
      userEmail,
      latitude,
      longitude,
      mapUrl,
      map_url,
    } = body;

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      title,
      description,
      listing_type: listingType,
      property_type: propertyType,
      price: String(price),
      numeric_price: numericPrice,
      currency,
      country,
      city,
      district,
      address,
      location,
      area,
      area_unit: areaUnit,
      bedrooms,
      bathrooms,
      legal_status: legalStatus,
      status,
      images: images || [],
      user_email: userEmail,
    };

    if (latitude !== undefined && latitude !== null && latitude !== "") {
      insertData.latitude = Number(latitude);
    }
    if (longitude !== undefined && longitude !== null && longitude !== "") {
      insertData.longitude = Number(longitude);
    }
    if (mapUrl || map_url) {
      insertData.map_url = mapUrl || map_url;
    }

    const { data, error } = await supabase
      .from("properties")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}