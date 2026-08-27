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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
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
      videos,
      userEmail,
    } = body;

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    // Cleanly extract images & videos arrays
    const cleanImages = Array.isArray(images) ? images : [];
    const cleanVideos = Array.isArray(videos) ? videos : [];

    // Cleanly extract and parse latitude, longitude, and mapUrl
    const rawLat = body.latitude ?? body.lat;
    const rawLng = body.longitude ?? body.lng;
    const rawMapUrl = body.mapUrl ?? body.map_url;

    const parsedLatitude = rawLat !== undefined && rawLat !== null && rawLat !== ""
      ? parseFloat(String(rawLat))
      : null;
    const parsedLongitude = rawLng !== undefined && rawLng !== null && rawLng !== ""
      ? parseFloat(String(rawLng))
      : null;
    const cleanLatitude = (parsedLatitude !== null && !isNaN(parsedLatitude)) ? parsedLatitude : null;
    const cleanLongitude = (parsedLongitude !== null && !isNaN(parsedLongitude)) ? parsedLongitude : null;
    const cleanMapUrl = rawMapUrl ? String(rawMapUrl) : null;

    const baseInsertData: Record<string, unknown> = {
      title: title || "",
      description: description || "",
      listing_type: listingType || "sale",
      property_type: propertyType || "apartment",
      price: String(price || "0"),
      numeric_price: numericPrice ? Number(numericPrice) : 0,
      currency: currency || "USD",
      country: country || "",
      city: city || "",
      district: district || "",
      address: address || "",
      location: location || "",
      area: area ? Number(area) : 0,
      area_unit: areaUnit || "sqm",
      bedrooms: bedrooms ? Number(bedrooms) : 0,
      bathrooms: bathrooms ? Number(bathrooms) : 0,
      legal_status: legalStatus || "freehold",
      status: status || "available",
      images: cleanImages,
      videos: cleanVideos,
      user_email: String(userEmail).toLowerCase(),
    };

    const fullInsertData: Record<string, unknown> = { ...baseInsertData };

    if (cleanLatitude !== null) {
      fullInsertData.latitude = cleanLatitude;
    }
    if (cleanLongitude !== null) {
      fullInsertData.longitude = cleanLongitude;
    }
    if (cleanMapUrl !== null) {
      fullInsertData.map_url = cleanMapUrl;
    }

    // Try inserting with full geospatial payload
    let { data, error } = await supabase
      .from("properties")
      .insert([fullInsertData])
      .select();

    // Fallback: If DB schema is missing latitude/longitude/map_url columns, retry with base payload
    if (error && (error.code === "PGRST204" || /column|latitude|longitude|map_url/i.test(error.message))) {
      console.warn(
        "Supabase properties table missing geospatial columns. Retrying insertion with base schema fallback...",
        error.message
      );

      const fallbackRes = await supabase
        .from("properties")
        .insert([baseInsertData])
        .select();

      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || baseInsertData, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Error creating property:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}