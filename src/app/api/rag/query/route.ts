import { NextResponse } from "next/server";
import { ragQueryService } from "@/lib/services/rag/query.service";

/** POST /api/rag/query — Query property catalog with RAG */
export async function POST(request: Request) {
  try {
    const { question, tenantId, locale = "en" } = await request.json();

    if (!question || !tenantId) {
      return NextResponse.json(
        { error: "question and tenantId are required" },
        { status: 400 }
      );
    }

    const result = await ragQueryService.query({ question, tenantId, locale });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] RAG query error:", error);
    return NextResponse.json({ error: "Failed to query catalog" }, { status: 500 });
  }
}
