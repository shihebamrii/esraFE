"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

interface ContentCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  type: "video" | "audio" | "article";
  isPremium: boolean;
  category: string;
}

export function ContentCard({
  id,
  title,
  thumbnail,
  duration,
  type,
  isPremium,
  category,
}: ContentCardProps) {
  return (
    <Link href={`/impact/${id}`} className="group block h-full">
      <div className="flex flex-col h-full gap-3">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Duration Pill - Minimal */}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
             {duration}
          </div>

          {/* Premium Marker - Minimal Dot */}
          {isPremium && (
            <div className="absolute top-2 left-2 bg-white text-primary text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">
              Premium
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton itemId={id} itemType="Content" />
          </div>
          
          {/* Play Icon - Centered, appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
               <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content Info - Clean Typography */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-medium">
             <span className="text-primary">{category}</span>
             <span>•</span>
             <span>{type}</span>
          </div>
          <h3 className="font-semibold text-lg leading-snug group-hover:text-primary/80 transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
