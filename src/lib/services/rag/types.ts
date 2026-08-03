export type CatalogSourceType = "pdf" | "text" | "database" | "csv";

export interface CatalogDocument {
  id: string;
  tenantId: string;
  title: string;
  sourceType: CatalogSourceType;
  sourceUrl?: string;
  chunkCount: number;
  ingestedAt: Date;
}

export interface CatalogChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    page?: number;
    propertyId?: string;
    section?: string;
  };
  embedding?: number[];
}

export interface RAGQueryInput {
  question: string;
  tenantId: string;
  locale: "en" | "ar";
  maxResults?: number;
}

export interface RAGQueryResult {
  answer: string;
  sources: Array<{
    documentId: string;
    chunkId: string;
    excerpt: string;
    relevanceScore: number;
  }>;
  confidence: number;
}
