import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Lazy / safe Supabase client getter for Vercel Serverless environment
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) are missing.");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Helpers for safe type parsing
function parseNumber(val: unknown): number | null {
  if (val === undefined || val === null || val === "") return null;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? null : parsed;
}

function parseIntNumber(val: unknown, defaultVal = 0): number {
  if (val === undefined || val === null || val === "") return defaultVal;
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? defaultVal : parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Property fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: unknown) {
    console.error("Property GET error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userEmail = body.userEmail || body.user_email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Safely parse numeric fields
    const parsedPriceNum = parseNumber(body.numericPrice ?? body.price) ?? 0;
    const parsedArea = parseNumber(body.area) ?? 0;
    const parsedBedrooms = parseIntNumber(body.bedrooms ?? body.rooms, 0);
    const parsedBathrooms = parseIntNumber(body.bathrooms, 0);
    const parsedLatitude = parseNumber(body.latitude ?? body.lat);
    const parsedLongitude = parseNumber(body.longitude ?? body.lng);
    const parsedMapUrl = body.mapUrl || body.map_url ? String(body.mapUrl || body.map_url).trim() : null;

    // Cleanly extract images & videos arrays
    const cleanImages = Array.isArray(body.images) ? body.images : [];
    const cleanVideos = Array.isArray(body.videos) ? body.videos : [];

    const baseInsertData: Record<string, unknown> = {
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      listing_type: body.listingType || body.listing_type || "sale",
      property_type: body.propertyType || body.property_type || "apartment",
      price: String(body.price || parsedPriceNum || "0"),
      numeric_price: parsedPriceNum,
      currency: body.currency || "USD",
      country: String(body.country || "").trim(),
      city: String(body.city || "").trim(),
      district: String(body.district || "").trim(),
      address: String(body.address || "").trim(),
      location: String(body.location || "").trim(),
      area: parsedArea,
      area_unit: body.areaUnit || body.area_unit || "sqm",
      bedrooms: parsedBedrooms,
      bathrooms: parsedBathrooms,
      legal_status: body.legalStatus || body.legal_status || "freehold",
      status: body.status || "available",
      // Always pass arrays — prevents DB null default for videos column
      images: Array.isArray(cleanImages) ? cleanImages : [],
      videos: Array.isArray(cleanVideos) ? cleanVideos : [],
      user_email: String(userEmail).toLowerCase().trim(),
    };

    const fullInsertData: Record<string, unknown> = { ...baseInsertData };

    if (parsedLatitude !== null) fullInsertData.latitude = parsedLatitude;
    if (parsedLongitude !== null) fullInsertData.longitude = parsedLongitude;
    if (parsedMapUrl !== null) fullInsertData.map_url = parsedMapUrl;

    const supabase = getSupabaseClient();

    // Try inserting with full geospatial payload
    let { data, error } = await supabase
      .from("properties")
      .insert([fullInsertData])
      .select();

    // Fallback 1: Retrying WITHOUT geospatial columns if schema is missing lat/lng/map_url
    // NOTE: baseInsertData still contains images/videos — they are preserved here!
    if (error && (error.code === "PGRST204" || /column|latitude|longitude|map_url/i.test(error.message))) {
      console.warn(
        "Supabase properties table missing geospatial columns. Retrying insertion with base schema (images/videos preserved)...",
        error.message
      );

      const fallbackRes = await supabase
        .from("properties")
        .insert([baseInsertData])
        .select();

      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    // Fallback 2: Retrying WITHOUT images/videos columns if DB is missing array columns
    if (error && (error.code === "PGRST204" || /images|videos/i.test(error.message))) {
      console.warn(
        "Supabase properties table missing media array columns. Retrying insertion with minimal payload...",
        error.message
      );

      const minimalData: Record<string, unknown> = { ...baseInsertData };
      delete minimalData.images;
      delete minimalData.videos;

      const minimalRes = await supabase
        .from("properties")
        .insert([minimalData])
        .select();

      data = minimalRes.data;
      error = minimalRes.error;
    }

    if (error) {
      console.error("Property creation error (Supabase insert):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || baseInsertData, { status: 201 });
  } catch (error: unknown) {
    console.error("Property creation error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}