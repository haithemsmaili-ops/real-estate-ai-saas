import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// PATCH: تحديث حالة العميل
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // await لفك الـ Promise
        const body = await req.json();
        const { status } = body;

        const { data, error } = await supabase
            .from("leads")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, lead: data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// DELETE: حذف العميل
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // await لفك الـ Promise

        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}