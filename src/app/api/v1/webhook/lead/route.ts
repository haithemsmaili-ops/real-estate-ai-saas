import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            name,
            phone,
            email,
            source = "WhatsApp (AI Agent)",
            status = "new",
            user_email,
            deal_type,      // شراء / إيجار
            property_type,  // شقة / فيلا
            rooms,          // عدد الغرف
            budget,         // الميزانية
            location,       // المكان / المدينة
            viewing_date,   // موعد المعاينة
            summary,        // ملخص طلب العميل
            intent_score = 85
        } = body;

        const { data, error } = await supabase
            .from("leads")
            .insert([
                {
                    name: name || "عميل مهتم",
                    phone,
                    email,
                    source,
                    status,
                    user_email,
                    deal_type,
                    property_type,
                    rooms,
                    budget,
                    location,
                    viewing_date,
                    summary,
                    intent_score,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, lead: data });
    } catch (err: any) {
        console.error("Webhook error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}