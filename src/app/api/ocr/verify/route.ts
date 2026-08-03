import { NextResponse } from "next/server";
import { documentVerificationService } from "@/lib/services/ocr/document-verification.service";

/** POST /api/ocr/verify — Verify ID or title deed documents */
export async function POST(request: Request) {
  try {
    const { tenantId, documentType, imageData, locale = "en" } =
      await request.json();

    if (!tenantId || !documentType || !imageData) {
      return NextResponse.json(
        { error: "tenantId, documentType, and imageData are required" },
        { status: 400 }
      );
    }

    const result = await documentVerificationService.verify({
      tenantId,
      documentType,
      imageData,
      locale,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] OCR verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify document" },
      { status: 500 }
    );
  }
}
