"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingCart, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

interface PhotoCardProps {
  id: string;
  title: string;
  url: string;
  location: string;
  price: number;
  width: number;
  height: number;
  mediaType?: 'photo' | 'video';
}

export function PhotoCard({ id, title, url, location, price, width, height, mediaType }: PhotoCardProps) {
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      type: 'photo',
      title,
      price,
      thumbnail: url
    });
    toast.success("Added to cart");
  };

  return (
    <Link href={`/tounesna/${id}`} className="block mb-6 break-inside-avoid">
      <motion.div
        className="group relative"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="relative w-full rounded-lg overflow-hidden bg-secondary mb-3">
          {url?.startsWith('http') || url?.startsWith('/api') ? (
            <img
              src={url}
              alt={title}
              className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          ) : (
            <img
              src={url}
              alt={title}
              className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          )}
          
          {/* Video Indicator */}
          {mediaType === 'video' && (
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1.5 text-white shadow-sm">
              <PlayCircle className="h-3.5 w-3.5 fill-white" />
              <span className="text-[10px] font-bold tracking-wider">VIDEO</span>
            </div>
          )}
          
          {/* Favorite Button — Top Right */}
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton itemId={id} itemType="Photo" />
          </div>

          {/* Minimal Hover Overlay with Add to Cart */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <Button 
                variant="secondary" 
                size="sm"
                className="bg-white text-primary hover:bg-white/90 shadow-lg px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                onClick={handleAddToCart}
             >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {price} TND
             </Button>
          </div>
        </div>

        {/* Clean Caption */}
        <div>
           <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
           </div>
           <div className="flex items-center text-muted-foreground text-xs mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{location}</span>
           </div>
        </div>
      </motion.div>
    </Link>
  );
}
