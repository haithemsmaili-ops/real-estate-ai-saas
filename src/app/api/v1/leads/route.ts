import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { data: leads, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return NextResponse.json({ success: true, leads: [] });
        }

        return NextResponse.json({
            success: true,
            leads: leads || [],
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ success: true, leads: [] });
    }
}