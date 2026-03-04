"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface MapComponentProps {
  groupedPhotos: Record<string, any[]>;
  coordinates: Record<string, [number, number]>;
  onGovClick?: (gov: string) => void;
}

export default function MapComponent({ groupedPhotos, coordinates, onGovClick }: MapComponentProps) {
  // Center roughly on Tunisia
  const center: [number, number] = [34.0, 9.5];

  return (
    <MapContainer center={center} zoom={6} className="w-full h-full z-0 font-sans">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {Object.entries(groupedPhotos).map(([gov, photos]) => {
        const coords = coordinates[gov];
        if (!coords) return null;

        return (
          <Marker key={gov} position={coords}>
            <Popup className="custom-popup">
              <div className="flex flex-col gap-2 min-w-[150px] p-1">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onGovClick) onGovClick(gov);
                  }}
                >
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{gov}</h3>
                  <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                    Filter <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {photos.slice(0, 4).map(p => (
                    <Link href={`/tounesna/${p.id}`} key={p.id} className="relative aspect-square rounded-md overflow-hidden bg-muted group cursor-pointer block">
                      <Image 
                        src={p.url} 
                        alt={p.title || p.id} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
