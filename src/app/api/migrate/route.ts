import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/migrate
 * One-time migration endpoint: adds missing geospatial columns (latitude, longitude, map_url)
 * to the properties table if they don't exist.
 *
 * Call this once from the browser or curl after deploying:
 *   GET /api/migrate
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing Supabase env vars" }, { status: 500 });
    }

    // Try direct Supabase Management API (requires service role key)
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    const mgmtUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

    const statements = [
      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;",
      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;",
      "ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS map_url TEXT;",
      "CREATE INDEX IF NOT EXISTS idx_properties_coords ON public.properties(latitude, longitude);",
    ];

    const results: Array<{ sql: string; success: boolean; error?: string }> = [];

    for (const sql of statements) {
      try {
        const res = await fetch(mgmtUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ query: sql }),
        });
        const data = await res.json();
        if (res.ok) {
          results.push({ sql, success: true });
        } else {
          results.push({ sql, success: false, error: data?.message || JSON.stringify(data) });
        }
      } catch (err: any) {
        results.push({ sql, success: false, error: err.message });
      }
    }

    // Verify columns now exist by selecting from properties
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: verifyData, error: verifyError } = await supabase
      .from("properties")
      .select("latitude, longitude, map_url")
      .limit(1);

    const columnsVerified = !verifyError;

    return NextResponse.json({
      message: columnsVerified
        ? "✅ Migration successful! latitude, longitude, map_url columns are now available."
        : "⚠️ Migration attempted. Verify manually in Supabase dashboard.",
      statements: results,
      columnsVerified,
      verifyError: verifyError?.message || null,
      note: "If migration failed via API, run these SQL statements in your Supabase Dashboard → SQL Editor.",
      sql: statements.join("\n"),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
