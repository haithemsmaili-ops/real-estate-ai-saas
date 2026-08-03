export type DocumentType = "national_id" | "passport" | "title_deed" | "visa" | "other";

export interface VerificationInput {
  tenantId: string;
  documentType: DocumentType;
  /** Base64-encoded image or file URL */
  imageData: string;
  locale: "en" | "ar";
}

export interface VerificationResult {
  verified: boolean;
  documentType: DocumentType;
  extractedFields: Record<string, string>;
  confidence: number;
  flags: string[];
  processedAt: Date;
}
