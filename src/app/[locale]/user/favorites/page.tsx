"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  Trash2,
  MapPin,
  Sparkles,
  Search,
  X,
  Filter,
  Image as ImageIcon,
  Video,
  Package,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserService, FavoriteItem } from "@/features/user/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

const typeConfig: Record<
  string,
  {
    icon: typeof ImageIcon;
    gradient: string;
    bg: string;
    label: string;
    emoji: string;
    link: string;
  }
> = {
  Photo: {
    icon: ImageIcon,
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-500/10 to-orange-500/5",
    label: "Photos",
    emoji: "🖼️",
    link: "/tounesna",
  },
  Content: {
    icon: Video,
    gradient: "from-blue-500 to-cyan-500",
    bg: "from-blue-500/10 to-cyan-500/5",
    label: "Videos",
    emoji: "🎬",
    link: "/impact",
  },
  Pack: {
    icon: Package,
    gradient: "from-purple-500 to-fuchsia-500",
    bg: "from-purple-500/10 to-fuchsia-500/5",
    label: "Packs",
    emoji: "📦",
    link: "/packs",
  },
};

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await UserService.getFavorites();
      setFavorites(data || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemType: string, itemId: string) => {
    setRemovingId(itemId);
    try {
      await UserService.toggleFavorite(itemType, itemId);
      setFavorites(favorites.filter((f) => f.itemId._id !== itemId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (fav: FavoriteItem) => {
    const item = fav.itemId;
    if (!item) return;
    addItem({
      id: item._id,
      type: fav.itemType.toLowerCase() as "photo" | "pack" | "content",
      title: item.title,
      price: item.priceTND || item.price || 0,
      thumbnail: item.thumbnailUrl || item.watermarkedUrl,
    });
    toast.success(`${item.title} added to cart`);
  };

  // Filter and search
  const filteredFavorites = favorites.filter((fav) => {
    const item = fav.itemId;
    if (!item) return false;
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      filterType === "all" || fav.itemType === filterType;
    return matchesSearch && matchesType;
  });

  // Type counts
  const typeCounts = {
    all: favorites.length,
    Photo: favorites.filter((f) => f.itemType === "Photo").length,
    Content: favorites.filter((f) => f.itemType === "Content").length,
    Pack: favorites.filter((f) => f.itemType === "Pack").length,
  };

  const getItemLink = (fav: FavoriteItem) => {
    if (fav.itemType === "Photo") return `/tounesna/${fav.itemId._id}`;
    if (fav.itemType === "Content") return `/impact/${fav.itemId._id}`;
    return `/packs`;
  };

  const getItemThumbnail = (item: FavoriteItem["itemId"]) => {
    const imgUrl = item.previewUrl || item.imageUrl || item.thumbnailUrl || item.watermarkedUrl;
    if (!imgUrl) return null;
    const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return imgUrl.startsWith("/api") ? imgUrl.replace("/api", backendBase) : imgUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-slide-up">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Favorites
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {favorites.length > 0
              ? `${favorites.length} item${favorites.length > 1 ? "s" : ""} saved`
              : "Items you've saved for later"}
          </p>
        </div>
        {favorites.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {favorites.length}
            </span>
          </div>
        )}
      </div>

      {/* Filter Chips + Search */}
      {!loading && favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Type filter chips */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "All", icon: Heart },
                ...Object.entries(typeConfig).map(([key, cfg]) => ({
                  key,
                  label: cfg.label,
                  icon: cfg.icon,
                })),
              ] as { key: string; label: string; icon: typeof Heart }[]
            ).map((chip) => {
              const count =
                typeCounts[chip.key as keyof typeof typeCounts] || 0;
              if (chip.key !== "all" && count === 0) return null;
              const isActive = filterType === chip.key;
              const Icon = chip.icon;
              return (
                <button
                  key={chip.key}
                  onClick={() => setFilterType(chip.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-foreground text-background shadow-md"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {chip.label}
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-background/20 text-background"
                        : "bg-border/50 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              className="pl-9 pr-9 h-10 rounded-xl border-border/50 bg-muted/30 focus:bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            ))}
        </div>
      ) : favorites.length === 0 ? (
        <Card className="border border-border/50 animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center">
                <Heart className="h-10 w-10 text-rose-500/40" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1.5">No favorites yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-5">
              Browse our collection and tap the heart icon to save items you
              love.
            </p>
            <Button
              variant="outline"
              className="rounded-xl border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              asChild
            >
              <Link href="/tounesna">Explore Content</Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredFavorites.length === 0 ? (
        <Card className="border border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-base mb-1">No matches found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Try a different search term or filter
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFavorites.map((fav) => {
            const item = fav.itemId;
            if (!item) return null;
            const config = typeConfig[fav.itemType] || typeConfig.Photo;
            const Icon = config.icon;
            const price = item.priceTND || item.price || 0;

            return (
              <Card
                key={fav._id}
                className={`group overflow-hidden border border-border/50 hover:border-rose-500/20 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 hover:-translate-y-1 flex flex-col animate-slide-up ${
                  removingId === item._id
                    ? "opacity-50 scale-95 pointer-events-none"
                    : ""
                }`}
              >
                {/* Image */}
                <Link href={getItemLink(fav)} className="block">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {getItemThumbnail(item) ? (
                      <img
                        src={getItemThumbnail(item)!}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Icon className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 h-8 w-8 rounded-xl bg-white dark:bg-white  backdrop-blur-sm hover:bg-red-500 hover:text-white text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(fav.itemType, item._id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    {/* Type Badge */}
                    <Badge
                      className={`absolute top-3 left-3 rounded-lg border-0 text-[11px] font-semibold shadow-sm bg-gradient-to-r ${config.gradient} text-white`}
                    >
                      <Icon className="h-3 w-3 me-1" />
                      {fav.itemType === "Content" ? "Video" : fav.itemType}
                    </Badge>

                    {/* View + Cart action buttons on hover */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <Button
                        size="sm"
                        className="flex-1 bg-white/95 dark:bg-white backdrop-blur-sm text-foreground hover:bg-white dark:hover:bg-white border-0 rounded-xl shadow-lg text-xs font-semibold"
                        asChild
                      >
                        <Link href={getItemLink(fav)}>
                          <Eye className="me-1.5 h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                      {price > 0 && (
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg text-xs font-semibold"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(fav);
                          }}
                        >
                          <ShoppingCart className="me-1.5 h-3.5 w-3.5" />
                          Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="font-bold text-base bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {price === 0 ? "Free" : `${price} TND`}
                    </span>
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
