"use client";

import { Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { UserService } from "@/features/user/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Simple in-memory cache for favorites to avoid N API calls
let cachedFavoriteIds: Set<string> | null = null;
let cachePromise: Promise<Set<string>> | null = null;

async function getFavoriteIds(): Promise<Set<string>> {
  if (cachedFavoriteIds) return cachedFavoriteIds;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const favorites = await UserService.getFavorites();
      const ids = new Set<string>(
        (favorites || []).map((f: any) => `${f.itemType}:${f.itemId?._id}`)
      );
      cachedFavoriteIds = ids;
      return ids;
    } catch {
      return new Set<string>();
    } finally {
      cachePromise = null;
    }
  })();

  return cachePromise;
}

function invalidateCache() {
  cachedFavoriteIds = null;
  cachePromise = null;
}

interface FavoriteButtonProps {
  itemId: string;
  itemType: "Photo" | "Pack" | "Content";
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({
  itemId,
  itemType,
  className,
  size = "sm",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFavoriteIds().then((ids) => {
      if (!cancelled) {
        setIsFavorited(ids.has(`${itemType}:${itemId}`));
      }
    });
    return () => { cancelled = true; };
  }, [itemId, itemType]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await UserService.toggleFavorite(itemType, itemId);
      const wasAdded = res.action === "added";
      setIsFavorited(wasAdded);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);

      // Update the cache
      invalidateCache();

      toast.success(wasAdded ? "Added to favorites" : "Removed from favorites");
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to save favorites");
      } else {
        toast.error("Failed to update favorite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        btnSize,
        "flex items-center justify-center rounded-full transition-all duration-300",
        "bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm",
        "hover:scale-110 active:scale-95",
        isFavorited
          ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20"
          : "text-muted-foreground hover:text-rose-500 hover:bg-white dark:hover:bg-black/80",
        animating && "scale-125",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-all duration-300",
          isFavorited && "fill-rose-500 text-rose-500",
          animating && "scale-110"
        )}
      />
    </button>
  );
}
