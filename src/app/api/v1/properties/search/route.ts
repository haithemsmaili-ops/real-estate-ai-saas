import { NextRequest, NextResponse } from "next/server";
import { jsonDb, PropertyRecord } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail =
      searchParams.get("userEmail") || searchParams.get("email") || "";

    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: userEmail or email",
        },
        { status: 400 }
      );
    }

    const properties = await jsonDb.getProperties(userEmail);

    const activeProperties = properties.filter(
      (p: PropertyRecord) => p.status === "available"
    );

    if (activeProperties.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        text: "No active real estate listings found for this agency.",
        properties: [],
      });
    }

    const formattedProperties = activeProperties.map((p: PropertyRecord) => {
      const specsList: string[] = [];
      if (p.bedrooms !== undefined && p.bedrooms !== null)
        specsList.push(`${p.bedrooms} Beds`);
      if (p.bathrooms !== undefined && p.bathrooms !== null)
        specsList.push(`${p.bathrooms} Baths`);
      if (p.area !== undefined && p.area !== null)
        specsList.push(`${p.area} ${p.areaUnit || "sqm"}`);
      if (p.floorNumber !== undefined && p.floorNumber !== null)
        specsList.push(`Floor ${p.floorNumber}`);
      if (p.parkingSpaces !== undefined && p.parkingSpaces !== null)
        specsList.push(`${p.parkingSpaces} Parking`);
      if (p.legalStatus) specsList.push(`Status: ${p.legalStatus}`);

      return {
        id: p.id,
        title: p.title,
        type: p.listingType || p.type || "sale",
        propertyType: p.propertyType || "apartment",
        price: p.numericPrice
          ? `${p.numericPrice.toLocaleString()} ${p.currency || "USD"}`
          : p.price,
        location:
          p.location ||
          [p.district, p.city, p.country].filter(Boolean).join(", ") ||
          "N/A",
        specs: specsList.join(", ") || "N/A",
        description: p.description || "",
      };
    });

    const textList = formattedProperties
      .map(
        (
          p: {
            id: string;
            title: string;
            price: string;
            location: string;
            specs: string;
            description: string;
          },
          idx: number
        ) => {
          return `Listing ${idx + 1
            }: ${p.title} - Price: ${p.price} - Location: ${p.location} - Specs: ${p.specs} - Details: ${p.description || "N/A"}`;
        }
      )
      .join("\n\n");

    return NextResponse.json({
      success: true,
      count: formattedProperties.length,
      text: textList,
      properties: formattedProperties,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search properties",
        text: "Error searching properties.",
      },
      { status: 500 }
    );
  }
}