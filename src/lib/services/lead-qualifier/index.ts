import type { Lead, LeadQualificationResult } from "@/types/lead";

export interface QualifierInput {
  message: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
  locale: "en" | "ar";
  tenantId: string;
}

export interface QualifierOutput {
  lead: Partial<Lead>;
  qualification: LeadQualificationResult;
  recommendedStatus: Lead["status"];
}

/**
 * AI Lead Qualifier Service
 *
 * Analyzes inbound messages and conversation context to extract intent,
 * budget, timeline, and property preferences. Integrates with LLM providers
 * (OpenAI / Anthropic) for production use.
 */
export class LeadQualifierService {
  /**
   * Qualify a lead from a single message or conversation thread.
   * TODO: Wire to OpenAI/Anthropic with structured output schema.
   */
  async qualify(input: QualifierInput): Promise<QualifierOutput> {
    const { message, locale } = input;

    // Placeholder heuristic scoring — replace with LLM structured extraction
    const hasBudget = /\$|€|£|AED|SAR|USD|budget|ميزانية/i.test(message);
    const hasTimeline = /month|week|urgent|soon|شهر|عاجل/i.test(message);
    const intentBuy = /buy|purchase|own|شراء|اشتري/i.test(message);
    const intentRent = /rent|lease|إيجار|استئجار/i.test(message);

    let intent: LeadQualificationResult["intent"] = "unknown";
    if (intentBuy) intent = "buy";
    else if (intentRent) intent = "rent";

    const confidence = (hasBudget ? 0.3 : 0) + (hasTimeline ? 0.2 : 0) + (intent !== "unknown" ? 0.3 : 0) + 0.2;
    const intentScore = Math.round(confidence * 100);

    const qualification: LeadQualificationResult = {
      intent,
      confidence,
      summary:
        locale === "ar"
          ? "تم تحليل الرسالة الأولي — في انتظار تكامل الذكاء الاصطناعي الكامل."
          : "Initial message analyzed — awaiting full AI integration.",
    };

    return {
      lead: { intentScore, locale },
      qualification,
      recommendedStatus: intentScore >= 70 ? "qualified" : intentScore >= 40 ? "pending" : "new",
    };
  }

  /** Batch re-score existing leads after model updates */
  async rescoreLeads(_tenantId: string, _leadIds: string[]): Promise<void> {
    // TODO: Implement batch re-scoring pipeline
  }
}

export const leadQualifierService = new LeadQualifierService();
