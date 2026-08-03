/**
 * Typed environment variable accessors.
 * Validates required vars at runtime when services are invoked.
 */
export const env = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en",
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  },
  whatsapp: {
    token: process.env.WHATSAPP_CLOUD_API_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  vectorDb: {
    url: process.env.VECTOR_DB_URL,
    apiKey: process.env.VECTOR_DB_API_KEY,
  },
  ocr: {
    apiKey: process.env.DOCUMENT_VERIFICATION_API_KEY,
  },
  n8n: {
    leadWebhookUrl: process.env.NEXT_PUBLIC_N8N_LEAD_WEBHOOK_URL,
    demoWebhookUrl: process.env.N8N_WEBHOOK_URL,
  },
} as const;

export function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
