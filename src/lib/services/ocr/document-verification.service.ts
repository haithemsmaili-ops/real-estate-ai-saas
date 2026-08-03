import type { VerificationInput, VerificationResult } from "./types";

/**
 * OCR & Document Verification Service
 *
 * Uses AI vision models to extract and verify ID cards, passports,
 * and title deeds for KYC/compliance workflows.
 *
 * TODO: Integrate OpenAI Vision, Google Document AI, or Azure Form Recognizer.
 */
export class DocumentVerificationService {
  async verify(input: VerificationInput): Promise<VerificationResult> {
    const { documentType, locale } = input;

    // TODO: Send image to vision API with document-specific extraction schema
    console.info(
      `[OCR] Processing ${documentType} for tenant ${input.tenantId}`
    );

    return {
      verified: false,
      documentType,
      extractedFields: {},
      confidence: 0,
      flags: [
        locale === "ar"
          ? "في انتظار تكامل OCR"
          : "Awaiting OCR integration",
      ],
      processedAt: new Date(),
    };
  }

  /** Validate extracted fields against business rules */
  validateExtractedFields(
    documentType: VerificationInput["documentType"],
    fields: Record<string, string>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (documentType === "national_id" && !fields.idNumber) {
      errors.push("Missing ID number");
    }
    if (documentType === "title_deed" && !fields.propertyReference) {
      errors.push("Missing property reference");
    }

    return { valid: errors.length === 0, errors };
  }
}

export const documentVerificationService = new DocumentVerificationService();
