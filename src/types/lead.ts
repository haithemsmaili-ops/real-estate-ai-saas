export type LeadStatus = "new" | "qualified" | "pending" | "disqualified" | "converted";
export type LeadSource = "whatsapp" | "email" | "sms" | "web" | "phone";

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  /** AI-generated intent score 0–100 */
  intentScore: number;
  /** Extracted qualification data from AI conversation */
  qualification?: LeadQualificationResult;
  locale: "en" | "ar";
  createdAt: Date;
  updatedAt: Date;
}

/** Output from the AI Lead Qualifier module */
export interface LeadQualificationResult {
  intent: "buy" | "rent" | "sell" | "invest" | "unknown";
  budget?: { min?: number; max?: number; currency: string };
  timeline?: "immediate" | "1-3months" | "3-6months" | "6months+";
  propertyType?: string[];
  location?: string[];
  confidence: number;
  summary: string;
}
