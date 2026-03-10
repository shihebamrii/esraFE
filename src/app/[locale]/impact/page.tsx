"use client";

import { useState, useRef, useEffect } from "react";
import { ContentCard } from "@/features/content/components/ContentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Play, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveMap } from "../tounesna/components/InteractiveMap";
import { GOV_PHOTOS } from "../tounesna/constants";

// Mock Data
const ALL_CONTENTS = [
  {
    id: "1",
    title: "Discovering the Sahara: A Journey Through Time",
    thumbnail: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&auto=format&fit=crop",
    duration: "12:45",
    type: "video" as const,
    isPremium: true,
    category: "Documentary"
  },
  {
    id: "2",
    title: "Traditional Crafts of Tunis Medina",
    thumbnail: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?q=80&w=800&auto=format&fit=crop",
    duration: "08:20",
    type: "video" as const,
    isPremium: false,
    category: "Culture"
  },
  {
    id: "3",
    title: "The Blue City: Sidi Bou Said Guide",
    thumbnail: "https://i1.pickpik.com/photos/176/752/965/59687782937d9-preview.jpg",
    duration: "15:00",
    type: "video" as const,
    isPremium: true,
    category: "Travel"
  },
];

function HeroSection() {
  const t = useTranslations("ImpactHero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToContent = () => {
    document.getElementById("impact-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="/Impact.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        onCanPlay={() => setIsReady(true)}
      />

      {/* Multi-layered overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f3a5f]/70 via-[#1f3a5f]/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f3a5f]/60 via-transparent to-transparent" />
      
      {/* Seamless transition to content - Fades to the background color #fff9e6 */}
      <div className="absolute inset-x-0 bottom-0 h-34 bg-gradient-to-t from-[#fff9e6] via-[#fff9e6]/50 to-transparent" />

      {/* Animated grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 30 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="h-px w-8 bg-[#ffcc1a]" />
            <span
              className="text-[#ffcc1a] text-xs font-bold tracking-[0.25em] uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {t("badge")}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[0.95] tracking-tight mb-6"
          >
            {t("titleLine1")}
            <br />
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: "2px #ffcc1a",
                color: "transparent",
              }}
            >
              {t("titleHighlight")}
            </span>
            <motion.img
              src="/logo-beestory.png"
              alt="Bee Story Logo"
              className="inline-block h-[200px] w-auto ml-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10 font-light"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={scrollToContent}
              className="group flex items-center gap-3 bg-[#ffcc1a] text-[#1f3a5f] px-7 py-3.5 rounded-full font-bold text-sm tracking-wide hover:bg-[#ffcc1a]/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#ffcc1a]/20"
            >
              <Play className="h-4 w-4 fill-current" />
              {t("exploreContent")}
            </button>
            <button
              onClick={scrollToContent}
              className="text-white/80 text-sm font-medium hover:text-white transition-colors underline underline-offset-4 decoration-[#ffcc1a]/60"
            >
              {t("browseAll")}
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-24 left-6 md:left-16 lg:left-24 flex gap-10"
        >
          {[
            { value: "120+", label: t("statVideos") },
            { value: "4K", label: t("statQuality") },
            { value: "5", label: t("statCategories") },
          ].map((stat) => (
            <div key={stat.label} className="text-white">
              <div className="text-2xl font-bold text-[#ffcc1a]">{stat.value}</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mute Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-4 py-2.5 rounded-full hover:bg-white/20 transition-all"
      >
        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        {isMuted ? t("unmute") : t("mute")}
      </motion.button>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
}

export default function ImpactPage() {
  const t = useTranslations("Impact");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");
  const [filterGov, setFilterGov] = useState("all");
  const [visitedGovs, setVisitedGovs] = useState<Set<string>>(new Set());

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

  const handleGovClick = (govId: string) => {
    const idToName: Record<string, string> = Object.fromEntries(
      Object.entries(govNameToId).map(([name, id]) => [id, name])
    );
    const selectedName = idToName[govId];
    if (selectedName) {
       if (filterGov === selectedName) {
         setFilterGov("all");
       } else {
         setFilterGov(selectedName);
       }
    }
  };

  const filteredContent = ALL_CONTENTS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || item.category.toLowerCase() === filterType.toLowerCase();
    const matchesAccess =
      filterAccess === "all" ||
      (filterAccess === "free" && !item.isPremium) ||
      (filterAccess === "premium" && item.isPremium);
    return matchesSearch && matchesType && matchesAccess;
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}
    >
      {/* ─── Hero Section ─── */}
      <HeroSection />

      {/* ─── Main Content Layout ─── */}
      <div id="impact-content" className="w-full flex flex-col lg:flex-row relative z-10 pt-4 lg:pt-0">
        
        {/* Dynamic Fading Background based on selected Governorate */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from(visitedGovs).map(id => (
            <div 
              key={id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${activeGovId === id ? 'opacity-20' : 'opacity-0'}`}
              style={{ backgroundImage: GOV_PHOTOS[id] ? `url(${GOV_PHOTOS[id]})` : undefined }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff9e6] via-transparent to-[#fff9e6]" />
        </div>

        {/* Left: Sticky Map Sidebar - Adjusted widths for better proportions */}
        <div className="w-full lg:w-[40%] xl:w-[35%] lg:sticky lg:top-0 lg:h-screen overflow-hidden z-10 flex flex-col items-center justify-center p-8 lg:p-12">
           <div className="w-full max-w-lg aspect-square">
              <InteractiveMap 
                onGovernorateClick={handleGovClick}
                photosByGov={GOV_PHOTOS}
                activeGov={activeGovId}
                primaryColor="#1f3a5f"
                secondaryColor="#ffcc1a"
              />
              
              {filterGov !== "all" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 bg-[#1f3a5f] text-white p-6 rounded-3xl shadow-xl flex items-center justify-between w-full"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Current Focus</p>
                    <p className="text-2xl font-serif font-bold text-[#ffcc1a]">{filterGov}</p>
                  </div>
                  <button 
                    onClick={() => setFilterGov("all")}
                    className="px-4 py-2 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-colors"
                  >
                    Reset Filter ✕
                  </button>
                </motion.div>
              )}
           </div>
        </div>

        {/* Right: Content Panel - Adjusted widths and added internal padding */}
        <div className="w-full lg:w-[60%] xl:w-[65%] min-h-screen relative z-10 pb-32">
        
          {/* Architectural Overlay: Mashrabiya (Geometric Lattice) Pattern */}
          <div 
            className="absolute inset-x-0 top-0 h-full opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0l15 45 45 15-45 15-15 45-15-45-45-15 45-15z' fill='%231f3a5f' fill-opacity='1'/%3E%3Cpath d='M0 60l10-30 20-10 10 30-10 30-20-10z' fill='%23ffcc1a' fill-opacity='0.4'/%3E%3Cpath d='M120 60l-10-30-20-10-10 30 10 30 20-10z' fill='%23ffcc1a' fill-opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
              maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
            }}
          />

          <div className="container mx-auto px-4 lg:px-12 xl:px-16 py-24 relative">
            
            {/* ── Section Header: The Grand Entrance ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-16 text-center relative"
            >
              {/* Hand-crafted Jasmine Flower Motif */}
              <div className="mb-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 blur-2xl bg-[#ffcc1a]/20 rounded-full" />
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
                    <path d="M24 4C24 4 28 16 36 16C44 16 44 24 36 24C44 24 44 32 36 32C28 32 24 44 24 44C24 44 20 32 12 32C4 32 4 24 12 24C4 24 4 16 12 16C20 16 24 4 24 4Z" fill="#ffcc1a" />
                    <circle cx="24" cy="24" r="3" fill="#1f3a5f" />
                  </svg>
                </div>
                
                <div className="flex items-center gap-8 px-4">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#1f3a5f20]" />
                  <span className="text-[#1f3a5f50] text-[10px] font-black uppercase tracking-[0.5em] whitespace-nowrap">
                     {t("heritage")}
                  </span>
                  <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#1f3a5f20]" />
                </div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#1f3a5f] leading-none mb-8">
                {t("sectionTitleLine1")} <span className="italic underline underline-offset-8 decoration-[#ffcc1a]/30 font-light">{t("sectionTitleHighlight")}</span>
              </h2>
              
              <p className="text-xl max-w-2xl mx-auto font-light leading-relaxed text-[#1f3a5f]/70">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* Filters: Sticky Floating Architectural Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8 z-30 flex flex-col lg:flex-row gap-6 mb-16 p-6 md:p-8 rounded-[36px] shadow-2xl shadow-[#1f3a5f08] border border-white/60 relative group overflow-hidden bg-white/80 backdrop-blur-2xl"
            >
              {/* Subtle corner motif for filters */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[#ffcc1a]/40 rounded-tl-[36px]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#ffcc1a]/40 rounded-br-[36px]" />
              
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ffcc1a]"
                />
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="pl-12 h-14 rounded-2xl border-[#1f3a5f08] bg-white/60 text-[#1f3a5f] placeholder:text-[#1f3a5f40] focus-visible:ring-[#ffcc1a] focus-visible:bg-white transition-all duration-300 shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4 w-full lg:w-auto items-center">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger
                    className="w-full sm:w-[180px] h-14 rounded-2xl bg-white/60 border-[#1f3a5f08] text-[#1f3a5f] shadow-inner focus:ring-[#ffcc1a]"
                  >
                    <SelectValue placeholder={t("category")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#1f3a5f10] shadow-2xl">
                    <SelectItem value="all">{t("allCategories")}</SelectItem>
                    <SelectItem value="documentary">{t("documentary")}</SelectItem>
                    <SelectItem value="culture">{t("culture")}</SelectItem>
                    <SelectItem value="travel">{t("travel")}</SelectItem>
                    <SelectItem value="history">{t("history")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAccess} onValueChange={setFilterAccess}>
                  <SelectTrigger
                    className="w-full sm:w-[180px] h-14 rounded-2xl bg-white/60 border-[#1f3a5f08] text-[#1f3a5f] shadow-inner focus:ring-[#ffcc1a]"
                  >
                    <SelectValue placeholder={t("access")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-[#1f3a5f10] shadow-2xl">
                    <SelectItem value="all">{t("allAccess")}</SelectItem>
                    <SelectItem value="free">{t("free")}</SelectItem>
                    <SelectItem value="premium">{t("premium")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

          {/* Grid - Adjusted for better responsiveness */}
          <AnimatePresence mode="wait">
            {filteredContent.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12"
              >
                {filteredContent.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                  >
                    <ContentCard {...item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
                style={{ color: "#1f3a5f60" }}
              >
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-lg font-medium">{t("noContent")}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Motif Separator */}
          <div className="mt-24 flex items-center justify-center gap-6 opacity-20">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#1f3a5f]" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" fill="#1f3a5f" />
            </svg>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#1f3a5f]" />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}