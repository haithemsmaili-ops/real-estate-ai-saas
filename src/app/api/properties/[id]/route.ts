import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // حذف العقار مباشرة من قاعدة البيانات Supabase
        const success = await jsonDb.deleteProperty(id);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to delete property from database" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Property Error:", error);
        return NextResponse.json(
            { error: "Failed to delete property" },
            { status: 500 }
        );
    }
}