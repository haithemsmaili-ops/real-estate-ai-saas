import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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