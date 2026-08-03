/**
 * Database client placeholder.
 *
 * Recommended stack for multi-tenant SaaS:
 * - PostgreSQL with Row-Level Security (RLS) for tenant isolation
 * - Prisma ORM or Drizzle ORM
 * - pgvector extension for RAG embeddings
 *
 * TODO: Initialize Prisma/Drizzle client when DATABASE_URL is configured.
 */

export interface DbClient {
  /** Health check for database connectivity */
  ping(): Promise<boolean>;
}

class PlaceholderDbClient implements DbClient {
  async ping(): Promise<boolean> {
    // Returns false until DATABASE_URL is configured
    return Boolean(process.env.DATABASE_URL);
  }
}

export const db: DbClient = new PlaceholderDbClient();
