"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search, MapPin, Navigation, ExternalLink, RefreshCw } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  onLocationSelect: (lat: number, lng: number, mapUrl?: string) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  mapUrl,
  onLocationSelect,
}: LocationPickerMapProps) {
  // Default center: Riyadh (24.7136, 46.6753) if lat/lng not provided
  const initialLat = latitude && !isNaN(latitude) ? latitude : 24.7136;
  const initialLng = longitude && !isNaN(longitude) ? longitude : 46.6753;

  const [currentLat, setCurrentLat] = useState<number>(initialLat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pastedUrl, setPastedUrl] = useState<string>(mapUrl || "");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Generate standard Google Maps URL for current lat/lng
  const generateGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  };

  // Synchronize internal state when props change
  useEffect(() => {
    if (latitude && !isNaN(latitude) && longitude && !isNaN(longitude)) {
      setCurrentLat(latitude);
      setCurrentLng(longitude);
    }
  }, [latitude, longitude]);

  // Parse lat/lng from a pasted Google Maps URL
  const parseGoogleMapsUrl = useCallback(
    (url: string) => {
      if (!url.trim()) return null;

      // Pattern 1: q=lat,lng or ll=lat,lng or query=lat,lng
      const qMatch = url.match(/(?:q|ll|query)=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
      if (qMatch && qMatch[1] && qMatch[2]) {
        return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
      }

      // Pattern 2: @lat,lng,zoom
      const atMatch = url.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
      if (atMatch && atMatch[1] && atMatch[2]) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
      }

      // Pattern 3: place/lat,lng or place/.../@lat,lng
      const placeMatch = url.match(/place\/([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
      if (placeMatch && placeMatch[1] && placeMatch[2]) {
        return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
      }

      return null;
    },
    []
  );

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || googleApiKey) return;

    let isMounted = true;

    // Dynamically import Leaflet client-side to ensure SSR safety
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default leaflet marker icon path issue in Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!leafletMapRef.current) {
        // Create Leaflet map instance
        const map = L.map(mapContainerRef.current, {
          center: [currentLat, currentLng],
          zoom: 13,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Create draggable marker
        const marker = L.marker([currentLat, currentLng], { draggable: true }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const lat = parseFloat(pos.lat.toFixed(6));
          const lng = parseFloat(pos.lng.toFixed(6));
          setCurrentLat(lat);
          setCurrentLng(lng);
          const generatedUrl = generateGoogleMapsUrl(lat, lng);
          setPastedUrl(generatedUrl);
          onLocationSelect(lat, lng, generatedUrl);
        });

        map.on("click", (e: any) => {
          const lat = parseFloat(e.latlng.lat.toFixed(6));
          const lng = parseFloat(e.latlng.lng.toFixed(6));
          marker.setLatLng([lat, lng]);
          setCurrentLat(lat);
          setCurrentLng(lng);
          const generatedUrl = generateGoogleMapsUrl(lat, lng);
          setPastedUrl(generatedUrl);
          onLocationSelect(lat, lng, generatedUrl);
        });

        leafletMapRef.current = map;
        markerRef.current = marker;

        // Force Leaflet tile recalculation inside modal viewport
        setTimeout(() => {
          map.invalidateSize();
        }, 250);
      } else {
        // Update marker position & map view if center changed externally
        leafletMapRef.current.setView([currentLat, currentLng], leafletMapRef.current.getZoom() || 13);
        markerRef.current.setLatLng([currentLat, currentLng]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentLat, currentLng, googleApiKey, onLocationSelect]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update map position programmatically
  const updateMapPosition = (lat: number, lng: number, urlToSet?: string) => {
    const cleanLat = parseFloat(lat.toFixed(6));
    const cleanLng = parseFloat(lng.toFixed(6));
    setCurrentLat(cleanLat);
    setCurrentLng(cleanLng);

    const finalUrl = urlToSet || generateGoogleMapsUrl(cleanLat, cleanLng);
    setPastedUrl(finalUrl);
    onLocationSelect(cleanLat, cleanLng, finalUrl);

    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([cleanLat, cleanLng], 14);
      markerRef.current.setLatLng([cleanLat, cleanLng]);
    }
  };

  // Search location using OpenStreetMap Nominatim API
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setGeoError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&accept-language=ar,en`
      );
      const data: SearchResult[] = await response.json();
      setSearchResults(data);

      if (data.length > 0) {
        const first = data[0];
        updateMapPosition(parseFloat(first.lat), parseFloat(first.lon));
      } else {
        setGeoError("لم يتم العثور على نتائج لهذا البحث");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setGeoError("تعذر الاتصال بخدمة البحث عن المواقع");
    } finally {
      setIsSearching(false);
    }
  };

  // Browser Geolocation API ("Use My Current Location")
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("خاصية تحديد الموقع غير مدعومة في متصفحك");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        updateMapPosition(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError("تم رفض الإذن لتحديد الموقع الجغرافي");
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError("معلومات الموقع غير متوفرة حالياً");
            break;
          case error.TIMEOUT:
            setGeoError("انتهت مهلة طلب تحديد الموقع");
            break;
          default:
            setGeoError("حدث خطأ أثناء تحديد موقعك الحالي");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle URL change & auto parsing
  const handleUrlChange = (val: string) => {
    setPastedUrl(val);
    const parsed = parseGoogleMapsUrl(val);
    if (parsed) {
      setGeoError(null);
      updateMapPosition(parsed.lat, parsed.lng, val);
    } else {
      onLocationSelect(currentLat, currentLng, val);
    }
  };

  return (
    <div className="space-y-3 dir-rtl text-right">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          تحديد موقع العقار على الخريطة (الإحداثيات)
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition font-medium"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
          {isLocating ? "جاري التحديد..." : "استخدام موقعي الحالي"}
        </button>
      </div>

      {/* Location Search Bar */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ابحث باسم المدينة أو المنطقة (مثال: الرياض، دبي، الجزائر...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 shrink-0"
        >
          {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "بحث"}
        </button>
      </div>

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2 max-h-36 overflow-y-auto space-y-1">
          {searchResults.map((res) => (
            <button
              key={res.place_id}
              type="button"
              onClick={() => {
                updateMapPosition(parseFloat(res.lat), parseFloat(res.lon));
                setSearchResults([]);
                setSearchQuery(res.display_name.split(",")[0]);
              }}
              className="w-full text-right p-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition line-clamp-1 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {res.display_name}
            </button>
          ))}
        </div>
      )}

      {/* Google Maps URL Backup Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-gray-500">
            رابط خرائط جوجل (Google Maps URL) أو لتقريب الموقع تلقائياً:
          </span>
          {pastedUrl && (
            <a
              href={pastedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
            >
              فتح الخريطة <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <input
          type="text"
          placeholder="https://maps.google.com/?q=24.7136,46.6753"
          value={pastedUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </div>

      {/* Interactive Map Container */}
      <div className="relative border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-gray-50">
        {googleApiKey ? (
          <iframe
            title="Google Maps Location"
            width="100%"
            height="220"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${googleApiKey}&q=${currentLat},${currentLng}&zoom=14`}
          />
        ) : (
          <div ref={mapContainerRef} className="w-full h-56 z-0" />
        )}

        <div className="absolute bottom-2 right-2 left-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-sm flex justify-between items-center text-[11px] text-gray-700 z-[1000]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-700">خط العرض (Lat):</span>
            <span className="font-mono">{currentLat.toFixed(6)}</span>
            <span className="font-semibold text-emerald-700 mr-2">خط الطول (Lng):</span>
            <span className="font-mono">{currentLng.toFixed(6)}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">اسحب المؤشر للضبط</span>
        </div>
      </div>

      {geoError && (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
          {geoError}
        </p>
      )}
    </div>
  );
}
