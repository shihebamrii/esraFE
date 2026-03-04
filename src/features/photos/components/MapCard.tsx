"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

// Define governorate coordinates mapping
const governorateCoordinates: Record<string, [number, number]> = {
  // Rough coordinates for Tunisian Governorates
  Tunis: [36.8065, 10.1815],
  Ariana: [36.8625, 10.1956],
  "Ben Arous": [36.7531, 10.2188],
  Manouba: [36.8080, 10.1010],
  Nabeul: [36.4561, 10.7376],
  Zaghouan: [36.4011, 10.1423],
  Bizerte: [37.2744, 9.8739],
  Beja: [36.7256, 9.1817],
  Jendouba: [36.5011, 8.7802],
  Kef: [36.1742, 8.7049],
  Siliana: [36.0849, 9.3708],
  Kairouan: [35.6781, 10.0963],
  Kasserine: [35.1676, 8.8365],
  "Sidi Bouzid": [35.0382, 9.4849],
  Sousse: [35.8256, 10.6369],
  Monastir: [35.7770, 10.8262],
  Mahdia: [35.5047, 11.0622],
  Sfax: [34.7406, 10.7603],
  Gafsa: [34.4250, 8.7842],
  Tozeur: [33.9197, 8.1335],
  Kebili: [33.7044, 8.9690],
  Gabes: [33.8815, 10.0982],
  Medenine: [33.3549, 10.5055],
  Tataouine: [32.9211, 10.4509]
};

// Next.js dynamic import for Leaflet because it relies on window object
const MapWithNoSSR = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

interface MapCardProps {
  photos: any[];
  onGovClick?: (gov: string) => void;
}

export function MapCard({ photos, onGovClick }: MapCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group photos by governorate
  const groupedPhotos: Record<string, any[]> = {};
  photos.forEach(photo => {
    let gov = photo.gov || photo.governorate;
    if (!gov) return;
    
    // Normalize string matching
    const matchKey = Object.keys(governorateCoordinates).find(
      key => key.toLowerCase() === gov.toLowerCase()
    );
    const keyToUse = matchKey || "Tunis"; // default fallback
    
    if (!groupedPhotos[keyToUse]) {
      groupedPhotos[keyToUse] = [];
    }
    groupedPhotos[keyToUse].push(photo);
  });

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-border relative">
      <MapWithNoSSR groupedPhotos={groupedPhotos} coordinates={governorateCoordinates} onGovClick={onGovClick} />
    </div>
  );
}
