import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail") || searchParams.get("email") || "";

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: userEmail or email" },
        { status: 400 }
      );
    }

    // Fetch properties for the agent
    const properties = jsonDb.getProperties(userEmail);

    // Filter properties to return active ones (status === 'available')
    const activeProperties = properties.filter((p) => p.status === "available");

    // Format properties for n8n AI Agent tool
    const formattedProperties = activeProperties.map((p) => {
      const specsList: string[] = [];
      if (p.bedrooms !== undefined) specsList.push(`${p.bedrooms} Beds`);
      if (p.bathrooms !== undefined) specsList.push(`${p.bathrooms} Baths`);
      if (p.area !== undefined) specsList.push(`${p.area} ${p.areaUnit || "sqm"}`);
      if (p.floorNumber !== undefined) specsList.push(`Floor ${p.floorNumber}`);
      if (p.parkingSpaces !== undefined) specsList.push(`${p.parkingSpaces} Parking`);
      if (p.legalStatus) specsList.push(`Status: ${p.legalStatus}`);

      return {
        id: p.id,
        title: p.title,
        type: p.listingType || p.type || "sale",
        propertyType: p.propertyType || "apartment",
        price: p.numericPrice ? `${p.numericPrice.toLocaleString()} ${p.currency || "USD"}` : p.price,
        location: p.location || [p.district, p.city, p.country].filter(Boolean).join(", ") || "N/A",
        specs: specsList.join(", ") || "N/A",
        description: p.description || "",
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search properties" },
      { status: 500 }
    );
  }
}
