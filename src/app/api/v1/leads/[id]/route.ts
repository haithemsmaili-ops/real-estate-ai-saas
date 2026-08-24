import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 1. تحديث حالة العميل (مثلاً: تم التعامل معه / مكتمل)
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { status } = body;

        const { data, error } = await supabase
            .from("leads")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, lead: data });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
    }
}

// 2. حذف العميل
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete lead" }, { status: 500 });
    }
}