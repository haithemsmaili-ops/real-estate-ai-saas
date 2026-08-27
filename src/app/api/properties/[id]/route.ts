import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function handleUpdate(
  request: Request,
  id: string
) {
  try {
    const { searchParams } = new URL(request.url);
    const queryUserEmail = searchParams.get("userEmail");

    const body = await request.json();
    const userEmail = body.userEmail || body.user_email || queryUserEmail;

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required for authorization" }, { status: 401 });
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

    const baseUpdateData: Record<string, unknown> = {
      title: body.title !== undefined ? String(body.title || "").trim() : undefined,
      description: body.description !== undefined ? String(body.description || "").trim() : undefined,
      listing_type: body.listingType || body.listing_type,
      property_type: body.propertyType || body.property_type,
      price: body.price !== undefined ? String(body.price || "0") : undefined,
      numeric_price: body.price !== undefined || body.numericPrice !== undefined ? parsedPriceNum : undefined,
      currency: body.currency,
      country: body.country !== undefined ? String(body.country || "").trim() : undefined,
      city: body.city !== undefined ? String(body.city || "").trim() : undefined,
      district: body.district !== undefined ? String(body.district || "").trim() : undefined,
      address: body.address !== undefined ? String(body.address || "").trim() : undefined,
      location: body.location !== undefined ? String(body.location || "").trim() : undefined,
      area: body.area !== undefined ? parsedArea : undefined,
      area_unit: body.areaUnit || body.area_unit,
      bedrooms: body.bedrooms !== undefined || body.rooms !== undefined ? parsedBedrooms : undefined,
      bathrooms: body.bathrooms !== undefined ? parsedBathrooms : undefined,
      legal_status: body.legalStatus || body.legal_status,
      status: body.status,
      // Always store arrays — guarantees videos column never stays null
      images: body.images !== undefined ? (Array.isArray(body.images) ? body.images : []) : undefined,
      videos: body.videos !== undefined ? (Array.isArray(body.videos) ? body.videos : []) : undefined,
    };

    // Remove undefined values to construct a clean patch/update payload
    Object.keys(baseUpdateData).forEach((key) => {
      if (baseUpdateData[key] === undefined) {
        delete baseUpdateData[key];
      }
    });

    const fullUpdateData: Record<string, unknown> = { ...baseUpdateData };

    if (parsedLatitude !== null) fullUpdateData.latitude = parsedLatitude;
    if (parsedLongitude !== null) fullUpdateData.longitude = parsedLongitude;
    if (parsedMapUrl !== null) fullUpdateData.map_url = parsedMapUrl;

    // Try updating with full geospatial payload
    let { data, error } = await supabase
      .from("properties")
      .update(fullUpdateData)
      .eq("id", id)
      .eq("user_email", String(userEmail).toLowerCase().trim())
      .select();

    // Fallback 1: Retrying without geospatial columns if schema missing lat/lng
    if (error && (error.code === "PGRST204" || /column|latitude|longitude|map_url/i.test(error.message))) {
      console.warn(
        "Supabase properties table missing geospatial columns. Retrying update with base schema fallback...",
        error.message
      );

      const fallbackRes = await supabase
        .from("properties")
        .update(baseUpdateData)
        .eq("id", id)
        .eq("user_email", String(userEmail).toLowerCase().trim())
        .select();

      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    // Fallback 2: Retrying without images/videos columns if DB missing array columns
    if (error && (error.code === "PGRST204" || /images|videos/i.test(error.message))) {
      console.warn(
        "Supabase properties table missing media array columns. Retrying update with minimal base payload...",
        error.message
      );

      const minimalData = { ...baseUpdateData };
      delete minimalData.images;
      delete minimalData.videos;

      const minimalRes = await supabase
        .from("properties")
        .update(minimalData)
        .eq("id", id)
        .eq("user_email", String(userEmail).toLowerCase().trim())
        .select();

      data = minimalRes.data;
      error = minimalRes.error;
    }

    if (error) {
      console.error("Property update error (Supabase update):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Property not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (err: any) {
    console.error("Property update handler catch-all error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
  }
  return handleUpdate(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
  }
  return handleUpdate(request, id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required for authorization" }, { status: 401 });
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}