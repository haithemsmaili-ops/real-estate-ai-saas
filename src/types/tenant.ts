/** Multi-tenant agency workspace */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryLocale: "en" | "ar";
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  /** Enabled communication channels for this agency */
  channels: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  /** Lead qualification thresholds (0–100) */
  leadScoring: {
    qualifiedThreshold: number;
    hotThreshold: number;
  };
  /** RAG catalog bot configuration */
  catalogBot: {
    enabled: boolean;
    maxContextChunks: number;
  };
  /** Document verification settings */
  documentVerification: {
    enabled: boolean;
    acceptedDocumentTypes: ("national_id" | "passport" | "title_deed")[];
  };
}
