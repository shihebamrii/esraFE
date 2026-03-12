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
  type: "video" | "audio" | "article" | "podcast" | "documentary" | "reels" | string;
  isPremium: boolean;
  category: string;
  onClick?: () => void;
}

export function ContentCard({
  id,
  title,
  thumbnail,
  duration,
  type,
  isPremium,
  category,
  onClick,
}: ContentCardProps) {
  const isReel = type === "reels";
  
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (onClick) {
       return (
         <div onClick={(e) => { e.preventDefault(); onClick(); }} className="group block cursor-pointer">
            {children}
         </div>
       );
    }
    return (
      <Link href={`/impact/${id}`} className="group block">
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <motion.div
        className="relative flex flex-col gap-5 p-3 rounded-[32px] transition-all duration-700 hover:bg-white hover:shadow-2xl hover:shadow-[#1f3a5f0a] border border-transparent hover:border-[#1f3a5f05] bg-white/40 backdrop-blur-sm"
        whileHover={{ y: -10 }}
      >
        {/* Architectural Frame / Corner Detail (Visible on Hover) */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-transparent group-hover:border-[#ffcc1a]/40 transition-all duration-700 rounded-tl-[32px]" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-transparent group-hover:border-[#ffcc1a]/40 transition-all duration-700 rounded-br-[32px]" />

        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] shadow-lg shadow-[#1f3a5f10]">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Favorite Button Overlay */}
          <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
            <FavoriteButton itemId={id} itemType="Content" />
          </div>

          {/* Premium Marker / Play Icon */}
          <div className="absolute top-4 right-4 z-10">
            {isPremium ? (
              <div className="bg-[#ffcc1a] text-[#1f3a5f] p-2.5 rounded-full shadow-lg shadow-black/10 transform transition-transform duration-500 group-hover:rotate-[360deg]">
                <Play className="h-3.5 w-3.5 fill-current" />
              </div>
            ) : (
               <div className="bg-white/20 backdrop-blur-md border border-white/30 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Play className="h-3.5 w-3.5 text-white" />
               </div>
            )}
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-[0.2em]">
            {duration}
          </div>

          {/* Play Icon Centered On Hover */}
          <div className="absolute inset-0 bg-[#1f3a5f40] opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
             <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-700">
                <div className="w-14 h-14 rounded-full bg-[#ffcc1a] flex items-center justify-center shadow-2xl">
                   <Play className="h-6 w-6 text-[#1f3a5f] fill-current ml-1" />
                </div>
             </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="flex flex-col gap-3 px-3 pb-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffcc1a]">
               {category}
             </span>
             <div className="w-1.5 h-1.5 rounded-full bg-[#1f3a5f10]" />
             <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1f3a5f40]">
               {type}
             </span>
          </div>
          <h3 
            className="font-serif font-bold text-2xl leading-tight text-[#1f3a5f] group-hover:text-[#1f3a5f] transition-colors line-clamp-2"
          >
            {title}
          </h3>
        </div>
      </motion.div>
    </CardWrapper>
  );
}
