"use client";

import { useState, useEffect } from "react";
import { MasonryGrid } from "@/features/photos/components/MasonryGrid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Map, Grid } from "lucide-react";
import { useTranslations } from "next-intl";
import { PhotoService, Photo } from "@/features/photos/api";
import { MapCard } from "@/features/photos/components/MapCard";

export default function TounesnaPage() {
  const t = useTranslations("Tounesna");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGov, setFilterGov] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const gov = params.get("gov");
      if (gov) {
        setFilterGov(gov);
      }
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const govData = await PhotoService.getGovernorates();
        setGovernorates(govData.data.governorates);
      } catch (error) {
        console.error("Failed to fetch governorates", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const params: any = {
          limit: 100, // Fetch plenty for the masonry grid
        };
        if (filterGov !== "all") params.governorate = filterGov;
        if (filterType !== "all") params.landscapeType = filterType;
        
        const data = await PhotoService.getPhotos(params);
        let results = data.data.photos;

        // Manual search filtering if backend doesn't support text search in this endpoint yet
        if (search) {
          results = results.filter((p: Photo) => 
            p.title.toLowerCase().includes(search.toLowerCase()) || 
            p.governorate.toLowerCase().includes(search.toLowerCase())
          );
        }

        setPhotos(results);
      } catch (error) {
        console.error("Failed to fetch photos", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPhotos, 300);
    return () => clearTimeout(timeoutId);
  }, [search, filterGov, filterType]);

  // Adapt backend photo to MasonryGrid/PhotoCard format if needed
  const adaptedPhotos = photos.map(p => ({
    id: p._id,
    title: p.title,
    url: p.previewUrl,
    location: p.governorate,
    price: p.priceTND,
    width: 800, // Fallback width
    height: 800 + (Math.random() * 400), // Randomized height for masonry effect
    gov: p.governorate,
    type: p.landscapeType
  }));

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* Header - Centered, Editorial */}
      <div className="container mx-auto px-4 mb-16 pt-12 text-center border-b border-border pb-16">
         <span className="text-xs font-bold text-primary tracking-widest uppercase mb-4 block">{t("badge")}</span>
         <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
           {t("title")}
         </h1>
         <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
           {t("subtitle")}
         </p>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters & Stats */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t("searchPlaceholder")} 
                  className="pl-9 h-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <Select value={filterGov} onValueChange={setFilterGov}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder={t("governorate")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allGovernorates")}</SelectItem>
                    {governorates.map(g => (
                      <SelectItem key={g._id} value={g._id}>{g._id} ({g.count})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder={t("type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    <SelectItem value="sea">Sea</SelectItem>
                    <SelectItem value="desert">Desert</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="historical">Historical</SelectItem>
                    <SelectItem value="oasis">Oasis</SelectItem>
                    <SelectItem value="village">Village</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Minimal Stats & View Toggle */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
             <div className="flex items-center gap-8">
               <div>
                 <span className="font-semibold text-foreground block text-lg">{photos.length}</span>
                 {t("photos")}
               </div>
               <div className="w-px h-8 bg-border" />
               <div>
                  <span className="font-semibold text-foreground block text-lg">{governorates.length}</span>
                 {t("governorates")}
               </div>
             </div>
             
             {/* Map / Grid Toggle */}
             <div className="flex items-center bg-muted rounded-full p-1 border border-border">
               <button 
                 onClick={() => setViewMode("grid")}
                 className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <Grid className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode("map")}
                 className={`p-2 rounded-full transition-colors ${viewMode === 'map' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
               >
                 <Map className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>

        {loading && photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Loading the collection...</p>
          </div>
        ) : adaptedPhotos.length > 0 ? (
          viewMode === "grid" ? (
            <MasonryGrid photos={adaptedPhotos} />
          ) : (
            <MapCard 
              photos={adaptedPhotos} 
              onGovClick={(gov) => {
                setFilterGov(gov);
                setViewMode("grid");
              }}
            />
          )
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No photos found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

