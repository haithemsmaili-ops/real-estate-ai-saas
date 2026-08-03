import type { CatalogDocument, CatalogSourceType } from "./types";

export interface IngestInput {
  tenantId: string;
  title: string;
  sourceType: CatalogSourceType;
  /** Raw text content or file buffer reference */
  content: string | Buffer;
  metadata?: Record<string, string>;
}

/**
 * Catalog Ingestion Service
 *
 * Processes property catalogs from PDF, text, CSV, or database exports.
 * Chunks content, generates embeddings, and stores in vector DB.
 *
 * TODO: Integrate pdf-parse, embedding model, and vector DB client.
 */
export class CatalogIngestionService {
  private readonly CHUNK_SIZE = 512;
  private readonly CHUNK_OVERLAP = 64;

  /** Split text into overlapping chunks for embedding */
  chunkText(text: string): string[] {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    let start = 0;

    while (start < words.length) {
      const end = Math.min(start + this.CHUNK_SIZE, words.length);
      chunks.push(words.slice(start, end).join(" "));
      start += this.CHUNK_SIZE - this.CHUNK_OVERLAP;
    }

    return chunks;
  }

  async ingest(input: IngestInput): Promise<CatalogDocument> {
    const text =
      typeof input.content === "string"
        ? input.content
        : input.content.toString("utf-8");

    const chunks = this.chunkText(text);

    // TODO: Generate embeddings via OpenAI/Cohere and upsert to vector DB
    console.info(
      `[RAG] Ingested "${input.title}" — ${chunks.length} chunks for tenant ${input.tenantId}`
    );

    return {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      title: input.title,
      sourceType: input.sourceType,
      chunkCount: chunks.length,
      ingestedAt: new Date(),
    };
  }

  async deleteDocument(_tenantId: string, _documentId: string): Promise<void> {
    // TODO: Remove chunks and embeddings from vector DB
  }
}

export const catalogIngestionService = new CatalogIngestionService();
