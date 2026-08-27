"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Film, X, Loader2, Link as LinkIcon, Plus } from "lucide-react";

interface MediaUploadZoneProps {
  images: string[];
  videos: string[];
  onImagesChange: (images: string[]) => void;
  onVideosChange: (videos: string[]) => void;
}

export default function MediaUploadZone({
  images = [],
  videos = [],
  onImagesChange,
  onVideosChange,
}: MediaUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlType, setUrlType] = useState<"image" | "video">("image");
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle File Upload to /api/upload
  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const newImages = [...images];
    const newVideos = [...videos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            if (data.type === "video" || file.type.startsWith("video/")) {
              newVideos.push(data.url);
            } else {
              newImages.push(data.url);
            }
          }
        } else {
          setUploadError("حدث خطأ أثناء رفع أحد الملفات");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setUploadError("فشل الاتصال بخدمة الرفع");
      }
    }

    onImagesChange(newImages);
    onVideosChange(newVideos);
    setUploading(false);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Add Direct Media URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const cleanUrl = urlInput.trim();
    if (urlType === "video") {
      onVideosChange([...videos, cleanUrl]);
    } else {
      onImagesChange([...images, cleanUrl]);
    }
    setUrlInput("");
  };

  // Remove media handlers
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index);
    onVideosChange(updated);
  };

  return (
    <div className="space-y-4 dir-rtl text-right">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          وسائط العقار (الصور والفيديوهات)
        </label>
        <span className="text-[11px] text-gray-400 font-medium">
          {images.length} صور • {videos.length} فيديو
        </span>
      </div>

      {/* Drag & Drop Upload Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
          dragActive
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-emerald-700">جاري رفع وسائط العقار...</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">
                اسحب الصور والفيديوهات هنا، أو <span className="text-emerald-600 underline">اضغط للاختيار</span>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                يدعم صيغ Images (JPG, PNG, WEBP) و Videos (MP4, WEBM)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Paste Media URL Fallback */}
      <form onSubmit={handleAddUrl} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="أو الصق رابط صورة/فيديو مباشر هنا..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <LinkIcon className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
        </div>
        <select
          value={urlType}
          onChange={(e) => setUrlType(e.target.value as "image" | "video")}
          className="border border-gray-200 rounded-xl px-2 text-xs bg-white outline-none"
        >
          <option value="image">صورة</option>
          <option value="video">فيديو</option>
        </select>
        <button
          type="submit"
          disabled={!urlInput.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> إضافة رابط
        </button>
      </form>

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
          {uploadError}
        </p>
      )}

      {/* Uploaded Media Previews Grid */}
      {(images.length > 0 || videos.length > 0) && (
        <div className="space-y-3 pt-2">
          {/* Images Grid */}
          {images.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                الصور المرفقة ({images.length}):
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square"
                  >
                    <img
                      src={img}
                      alt={`Property image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 left-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition shadow-xs"
                      title="حذف الصورة"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        الرئيسية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos List */}
          {videos.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-cyan-600" />
                الفيديوهات المرفقة ({videos.length}):
              </span>
              <div className="space-y-1.5">
                {videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-cyan-50/70 border border-cyan-100 p-2 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Film className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="truncate text-gray-700 font-mono text-[11px]">{vid}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition shrink-0"
                      title="حذف الفيديو"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
