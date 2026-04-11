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
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PhotoService, Photo } from "@/features/photos/api";

import { TounesnaHero } from "./components/TounesnaHero";
import { InteractiveMap } from "./components/InteractiveMap";
import { PacksSection } from "./components/PacksSection";
import { GOV_PHOTOS } from "./constants";

export default function TounesnaPage() {
  const t = useTranslations("Tounesna");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGov, setFilterGov] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [visitedGovs, setVisitedGovs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const gov = params.get("gov");
      if (gov) {
        setFilterGov(gov);
      }
      const searchParam = params.get("search");
      if (searchParam) {
        setSearch(searchParam);
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
          const q = search.toLowerCase();
          results = results.filter((p: Photo) => 
            p.title.toLowerCase().includes(q) || 
            p.governorate.toLowerCase().includes(q) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
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
    mediaType: p.mediaType,
    type: p.landscapeType
  }));

  const govNameToId: Record<string, string> = {
    "Ariana": "TN-AR", "Beja": "TN-BE", "Ben Arous": "TN-BA", "Bizerte": "TN-BI",
    "Gabes": "TN-GB", "Gafsa": "TN-GF", "Jendouba": "TN-JN", "Kairouan": "TN-KR",
    "Kasserine": "TN-KS", "Kebili": "TN-KE", "Kef": "TN-KF", "Mahdia": "TN-MH",
    "Manouba": "TN-MN", "Medenine": "TN-MD", "Monastir": "TN-MS", "Nabeul": "TN-NA",
    "Sfax": "TN-SF", "Sidi Bouzid": "TN-SB", "Siliana": "TN-SI", "Sousse": "TN-SO",
    "Tataouine": "TN-TT", "Tozeur": "TN-TZ", "Tunis": "TN-TN", "Zaghouan": "TN-ZG",
  };

  const activeGovId = filterGov !== "all" ? govNameToId[filterGov] : null;

  useEffect(() => {
    if (activeGovId) {
      setVisitedGovs(prev => new Set(prev).add(activeGovId));
    }
  }, [activeGovId]);

  // We use GOV_PHOTOS as the primary beautiful background images for the map and section
  const photosByGov = { ...GOV_PHOTOS };

  // Optionally let actual uploaded photos override if desired, 
  // but for the premium look requested, we stick to the curated high-quality GOV_PHOTOS.
  // We can still map them if we want to override, but let's keep the best photos:
  photos.forEach((p) => {
    const govId = govNameToId[p.governorate];
    if (govId && !photosByGov[govId] && p.previewUrl) {
      photosByGov[govId] = p.previewUrl;
    }
  });

  const handleGovClick = (govId: string) => {
    const idToName: Record<string, string> = Object.fromEntries(
      Object.entries(govNameToId).map(([name, id]) => [id, name])
    );
    const selectedName = idToName[govId];
    if (selectedName) {
       // Toggle off if already selected
       if (filterGov === selectedName) {
         setFilterGov("all");
       } else {
         setFilterGov(selectedName);
       }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9e6] text-[#6a0d2e] font-sans selection:bg-[#ffcc1a] selection:text-[#fff9e6]">
      {/* ─── Global Zellige texture layer ─── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%236a0d2e' stroke-width='0.4'%3E%3Cpath d='M60 0L75 15L60 30L45 15Z'/%3E%3Cpath d='M60 90L75 105L60 120L45 105Z'/%3E%3Cpath d='M0 60L15 45L30 60L15 75Z'/%3E%3Cpath d='M90 60L105 45L120 60L105 75Z'/%3E%3Cpath d='M60 30L75 45L60 60L45 45Z'/%3E%3Cpath d='M60 60L75 75L60 90L45 75Z'/%3E%3Cpath d='M30 60L45 45L60 60L45 75Z'/%3E%3Cpath d='M60 60L75 45L90 60L75 75Z'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='0' cy='0' r='5'/%3E%3Ccircle cx='120' cy='0' r='5'/%3E%3Ccircle cx='0' cy='120' r='5'/%3E%3Ccircle cx='120' cy='120' r='5'/%3E%3Cpath d='M30 0L60 30L90 0'/%3E%3Cpath d='M30 120L60 90L90 120'/%3E%3Cpath d='M0 30L30 60L0 90'/%3E%3Cpath d='M120 30L90 60L120 90'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <TounesnaHero />
      {/* ═══════════════ MAP & GALLERY ═══════════════ */}
      {/* ─── Refined Tile Band Divider ─── */}
      <div className="relative z-20 w-full h-[80px] bg-[#fff9e6] flex items-center justify-center border-y border-[#6a0d2e]/10 shadow-sm mt-[-1px] overflow-hidden">
        {/* Provided Divider Image */}
        <div 
           className="absolute inset-0 w-full h-full"
           style={{
             backgroundImage: `url("/divider.png")`,
             backgroundSize: "contain",
             backgroundRepeat: "repeat-x",
             backgroundPosition: "center"
           }}
        />
        
        {/* Subtle Gold Accents on the edges */}
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffcc1a]/60 to-transparent" />
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffcc1a]/60 to-transparent" />
      </div>

      <div id="tounesna-content" className="w-full flex flex-col lg:flex-row relative z-10">

        {/* ── Dynamic Fading Background based on selected Governorate ── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from(visitedGovs).map(id => (
            <div 
              key={id}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out ${activeGovId === id ? 'opacity-70' : 'opacity-0'}`}
              style={{ backgroundImage: photosByGov[id] ? `url(${photosByGov[id]})` : undefined }}
            />
          ))}
          {/* Overlays to gracefully bleed it into the theme */}
          <div className="absolute inset-0 bg-[#fff9e6]/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff9e6] via-[#fff9e6]/40 to-transparent" />
        </div>

        {/* ──── Left: Sticky Map Sidebar ──── */}
        <div className="w-full lg:w-[45%] xl:w-[40%] lg:sticky lg:top-0 lg:h-screen overflow-hidden z-10">
          <div className="w-full h-[60vh] lg:h-full flex flex-col relative">

            {/* Map section header */}
            <div className="absolute top-0 inset-x-0 z-20 pointer-events-none p-8 lg:p-12 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#ffcc1a] text-sm">✦</span>
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#6a0d2e] font-bold">
                  اكتشف الولايات — Explore
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#6a0d2e] leading-tight drop-shadow-md">
                The 24 Regions
              </h2>
              <p className="text-[#6a0d2e]/50 text-sm mt-3 max-w-xs font-light leading-relaxed">
                Interactively hover to reveal. Click any province to filter the master gallery.
              </p>
            </div>

            {/* Active governorate indicator */}
            {filterGov !== "all" && (
              <div className="absolute bottom-6 inset-x-6 z-20 bg-gradient-to-r from-[#ffcc1a] to-[#e6b300] text-[#6a0d2e] rounded-2xl p-5 flex items-center justify-between shadow-[0_15px_40px_rgba(255,204,26,0.3)] animate-in slide-in-from-bottom-5">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-60">Filtering by Province</span>
                  <p className="text-xl font-bold font-serif">{filterGov}</p>
                </div>
                <button
                  onClick={() => setFilterGov("all")}
                  className="text-[#6a0d2e] hover:bg-white/20 text-xs font-bold uppercase tracking-wider border border-[#6a0d2e]/10 rounded-full px-5 py-2.5 transition-all shadow-sm"
                >
                  Clear ✕
                </button>
              </div>
            )}

            <InteractiveMap
              onGovernorateClick={handleGovClick}
              photosByGov={photosByGov}
              activeGov={activeGovId}
            />
          </div>
        </div>

        {/* ──── Right: Gallery Panel ──── */}
        <div className="w-full lg:w-[55%] xl:w-[60%] min-h-screen relative z-10" id="gallery-section">

          {/* Background Texture - Matching the Map's subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle at center, rgba(106, 13, 46, 0.15) 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }}
          />

          <div className="relative z-10 p-5 lg:p-10 xl:p-14">

            {/* Gallery Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#ffcc1a] text-sm">✦</span>
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#6a0d2e] font-bold">
                  المجموعة — Collection
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-[#6a0d2e] drop-shadow-md">
                {filterGov !== "all" ? `Visions of ${filterGov}` : "All of Tunisia"}
              </h2>
            </div>

            {/* ── Enhanced Filter Bar (Premium Glassmorphism) ── */}
            <div className="flex flex-col xl:flex-row flex-wrap gap-4 mb-12 p-6 rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(106,13,46,0.06)]">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6a0d2e]/50" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="pl-12 h-12 bg-white/50 border-white/80 text-[#6a0d2e] placeholder:text-[#6a0d2e]/40 focus:bg-white focus:border-[#6a0d2e]/30 focus:ring-[#6a0d2e]/10 transition-all rounded-2xl text-base shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 w-full xl:w-auto">
                {/* Governorate */}
                <Select value={filterGov} onValueChange={setFilterGov}>
                  <SelectTrigger className="flex-1 xl:w-[200px] h-12 bg-white/50 border-white/80 text-[#6a0d2e] rounded-2xl text-base focus:bg-white focus:border-[#6a0d2e]/30 transition-all hover:bg-white shadow-sm">
                    <SelectValue placeholder={t("governorate")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fff9e6] border-[#6a0d2e]/10 text-[#6a0d2e] rounded-xl shadow-2xl backdrop-blur-xl">
                    <SelectItem value="all">{t("allGovernorates")}</SelectItem>
                    {governorates.map(g => (
                      <SelectItem key={g._id} value={g._id} className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">{g._id} <span className="text-[#ffcc1a]/60 text-xs ml-1">({g.count})</span></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Type */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="flex-1 xl:w-[160px] h-12 bg-white/50 border-white/80 text-[#6a0d2e] rounded-2xl text-base focus:bg-white focus:border-[#6a0d2e]/30 transition-all hover:bg-white shadow-sm">
                    <SelectValue placeholder={t("type")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#fff9e6] border-[#6a0d2e]/10 text-[#6a0d2e] rounded-xl shadow-2xl backdrop-blur-xl">
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    <SelectItem value="sea" className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">🌊 {t("sea")}</SelectItem>
                    <SelectItem value="desert" className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">🏜️ {t("desert")}</SelectItem>
                    <SelectItem value="mountain" className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">⛰️ {t("mountain")}</SelectItem>
                    <SelectItem value="oasis" className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">🌴 {t("oasis")}</SelectItem>
                    <SelectItem value="village" className="cursor-pointer hover:bg-[#6a0d2e]/10 focus:bg-[#6a0d2e]/10">🏘️ {t("village")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-end gap-8 w-full xl:w-auto xl:ml-auto text-[#6a0d2e]">
                <div className="text-right xl:text-center">
                  <span className="block text-[#6a0d2e] text-2xl lg:text-3xl font-serif leading-none drop-shadow-sm">{photos.length}</span>
                  <span className="uppercase text-[9px] tracking-[0.25em] font-bold mt-2 block opacity-60">{t("photos")}</span>
                </div>
                <div className="w-px h-10 bg-[#6a0d2e]/20" />
                <div className="text-left xl:text-center">
                  <span className="block text-[#6a0d2e] text-2xl lg:text-3xl font-serif leading-none drop-shadow-sm">
                    {filterGov !== "all" ? 1 : governorates.length}
                  </span>
                  <span className="uppercase text-[9px] tracking-[0.25em] font-bold mt-2 block opacity-60">Regions</span>
                </div>
              </div>
            </div>

            {/* ── Grid Area ── */}
            {loading && photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 text-[#6a0d2e]/50">
                <Loader2 className="h-12 w-12 animate-spin mb-6 text-[#ffcc1a]" />
                <p className="tracking-[0.25em] uppercase text-[11px] font-bold">Unveiling the collection…</p>
              </div>
            ) : adaptedPhotos.length > 0 ? (
              <div className="pb-20">
                <MasonryGrid photos={adaptedPhotos} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-40 text-[#6a0d2e]/60 border border-dashed border-white/60 bg-white/40 rounded-3xl backdrop-blur-md shadow-sm">
                <span className="block text-6xl mb-6 drop-shadow-md">🏜️</span>
                <p className="text-base tracking-widest uppercase font-bold text-[#6a0d2e]">The dunes are empty</p>
                <p className="text-sm mt-3 opacity-70">Try adjusting your filters or clearing the search to find what you seek.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Refined Tile Band Divider ─── */}
      <div className="relative z-20 w-full h-[80px] bg-[#fff9e6] flex items-center justify-center border-y border-[#6a0d2e]/10 shadow-sm mt-[-1px] overflow-hidden">
        {/* Provided Divider Image */}
        <div 
           className="absolute inset-0 w-full h-full"
           style={{
             backgroundImage: `url("/divider.png")`,
             backgroundSize: "contain",
             backgroundRepeat: "repeat-x",
             backgroundPosition: "center"
           }}
        />
        
        {/* Subtle Gold Accents on the edges */}
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffcc1a]/60 to-transparent" />
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffcc1a]/60 to-transparent" />
      </div>

      <PacksSection />
    </div>
  );
}
