import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type.startsWith("video/") ? "video" : "image";
    const fileExtension = file.name.split(".").pop() || (fileType === "video" ? "mp4" : "jpg");
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Try uploading to Supabase Storage bucket 'property-media'
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property-media")
        .upload(filePath, buffer, {
          contentType: file.type || (fileType === "video" ? "video/mp4" : "image/jpeg"),
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("property-media")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            type: fileType,
            fileName: file.name,
          });
        }
      } else if (uploadError) {
        console.warn("[Upload Route Warning] Supabase storage upload attempt:", uploadError.message);
      }
    } catch (storageErr) {
      console.warn("[Upload Route Warning] Supabase storage error:", storageErr);
    }

    // 2. Fallback: Convert to Data URL if storage bucket is not configured or unavailable
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || (fileType === "video" ? "video/mp4" : "image/jpeg");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      type: fileType,
      fileName: file.name,
      isFallback: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal upload error";
    console.error("[API Upload Error]:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
