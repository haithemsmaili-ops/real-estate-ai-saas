import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const properties = jsonDb.getProperties();
        const filtered = properties.filter((p) => p.id !== id);
        jsonDb.saveProperties(filtered);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete property" },
            { status: 500 }
        );
    }
}