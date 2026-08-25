import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userEmail, message, conversationId, leadInfo } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const email = userEmail || "demo@agency.com";

    // 1. جلب العقارات الخاصة بالوكالة الحالية فقط
    const { data: properties } = await supabase
      .from("properties")
      .select("*")
      .eq("user_email", email)
      .eq("status", "available");

    // 2. إدارة المحادثة في Supabase
    let currentConvId = conversationId;

    if (!currentConvId) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert([
          {
            user_email: email,
            lead_name: leadInfo?.name || "زائر جديد",
            lead_phone: leadInfo?.phone || null,
            lead_email: leadInfo?.email || null,
            last_message: message,
            channel: leadInfo?.channel || "widget",
          },
        ])
        .select()
        .single();

      if (newConv) {
        currentConvId = newConv.id;
      }
    } else {
      await supabase
        .from("conversations")
        .update({
          last_message: message,
          updated_at: new Date().toISOString(),
          ...(leadInfo?.name && { lead_name: leadInfo.name }),
          ...(leadInfo?.phone && { lead_phone: leadInfo.phone }),
          ...(leadInfo?.email && { lead_email: leadInfo.email }),
        })
        .eq("id", currentConvId);
    }

    // 3. حفظ رسالة العميل (Lead)
    if (currentConvId) {
      await supabase.from("messages").insert([
        {
          conversation_id: currentConvId,
          sender: "lead",
          content: message,
        },
      ]);
    }

    // 4. تجهيز قائمة العقارات لإضافتها للـ System Prompt
    const propertiesContext = properties && properties.length > 0
      ? properties
        .map(
          (p) =>
            `- ${p.title}: ${p.numeric_price ? p.numeric_price.toLocaleString() : p.price} ${p.currency || "USD"} (${p.property_type} ${p.listing_type === "sale" ? "للبيع" : "للإيجار"}) في ${p.city || p.location || "غير محدد"}. ${p.bedrooms || 0} غرف، ${p.bathrooms || 0} حمامات.`
        )
        .join("\n")
      : "لا توجد عقارات متاحة حالياً في المعرض.";

    const SYSTEM_PROMPT = `
You are an expert AI Real Estate Consultant for a premium property agency.
Your goal is to perform two main tasks:
1. Answer properties FAQ using ONLY the agency's available properties below:
${propertiesContext}

2. Qualify the lead by identifying their intent, budget, and purchasing timeframe.

Rules:
- Respond in the EXACT SAME language as the client (Arabic for Gulf/Arab clients, English for Western clients).
- Keep responses concise, warm, professional, and sales-oriented.
- If the client's budget or interest is strong, tag them as a "HOT_LEAD".
`;

    let aiReply = "";
    const apiKey = process.env.OPENAI_API_KEY;

    // 5. التوليد عبر OpenAI أو استخدام التجربة (Demo Mode)
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
      aiReply = `[وضع التجربة]: أهلاً بك! لدينا العقارات التالية المتاحة:\n${propertiesContext}\n\nاستلمت رسالتك: "${message}". النظام جاهز للعمل الحقيقي فور إضافة OpenAI Key.`;
    } else {
      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      });

      aiReply =
        response.choices[0]?.message?.content ||
        "عذراً، حدث خطأ في معالجة الطلب.";
    }

    // 6. حفظ رد الـ AI في جدول الرسائل
    if (currentConvId) {
      await supabase.from("messages").insert([
        {
          conversation_id: currentConvId,
          sender: "bot",
          content: aiReply,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      conversationId: currentConvId,
      reply: aiReply,
    });
  } catch (error: any) {
    console.error("[API] Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}