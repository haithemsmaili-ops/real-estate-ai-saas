import { NextResponse } from "next/server";
import { catalogIngestionService } from "@/lib/services/rag/catalog-ingestion.service";

/** POST /api/rag/ingest — Ingest property catalog documents */
export async function POST(request: Request) {
  try {
    const { tenantId, title, sourceType, content } = await request.json();

    if (!tenantId || !title || !content) {
      return NextResponse.json(
        { error: "tenantId, title, and content are required" },
        { status: 400 }
      );
    }

    const document = await catalogIngestionService.ingest({
      tenantId,
      title,
      sourceType: sourceType ?? "text",
      content,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[API] RAG ingest error:", error);
    return NextResponse.json({ error: "Failed to ingest catalog" }, { status: 500 });
  }
}
