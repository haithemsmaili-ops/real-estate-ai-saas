import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are an expert AI Real Estate Consultant for a premium property agency.
Your goal is to perform two main tasks:
1. Answer properties FAQ (prices, areas, locations) accurately and politely.
2. Qualify the lead by identifying their intent, budget, and purchasing timeframe.

Rules:
- Respond in the EXACT SAME language as the client (Arabic for Gulf/Arab clients, English for Western clients).
- Keep responses concise, warm, professional, and sales-oriented.
- If the client's budget or interest is strong, tag them as a "HOT_LEAD".
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
      return NextResponse.json({
        success: true,
        reply: `[وضع التجربة - Demo Mode]: أهلاً بك يا هيثم! استلمت رسالتك: "${message}". النظام يعمل بنجاح وجاهز لربطه بالذكاء الاصطناعي الحقيقي قريباً.`,
      });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const aiReply =
      response.choices[0]?.message?.content ||
      "عذراً، حدث خطأ في معالجة الطلب.";

    return NextResponse.json({
      success: true,
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