"use client";

import React from "react";
import { MapPin, ExternalLink, Globe } from "lucide-react";

interface PropertyMiniMapProps {
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  locationName?: string;
}

export default function PropertyMiniMap({
  latitude,
  longitude,
  mapUrl,
  locationName,
}: PropertyMiniMapProps) {
  const hasCoords = latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude);
  const targetUrl =
    mapUrl ||
    (hasCoords
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : undefined);

  if (!hasCoords && !mapUrl) return null;

  return (
    <div className="mt-2 text-xs bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <div className="truncate text-gray-700 font-medium">
          {hasCoords ? (
            <span className="font-mono text-[11px]">
              {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
            </span>
          ) : (
            <span>موقع الخريطة محدد</span>
          )}
        </div>
      </div>

      {targetUrl && (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 px-2 py-0.5 rounded-lg transition shrink-0 font-medium shadow-2xs"
          title="فتح على الخريطة"
        >
          <MapPin className="w-3 h-3" />
          <span>الخريطة</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
}
