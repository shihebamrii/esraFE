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
import { Badge } from "@/components/ui/badge";
import { Search, Play, Volume2, VolumeX, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveMap } from "../tounesna/components/InteractiveMap";
import { GOV_PHOTOS } from "../tounesna/constants";
import { PacksSection } from "../tounesna/components/PacksSection";
import { InstagramReelsViewer } from "@/features/content/components/InstagramReelsViewer";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import { Link } from "@/i18n/navigation";

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Abstract Golden Bee Component
const GoldenBee = ({ delay, className }: { delay: number, className: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -50, y: 50 }}
    animate={{ 
      opacity: [0, 0.8, 0.8, 0],
      x: ["-10vw", "30vw", "70vw", "110vw"],
      y: ["10vh", "-15vh", "20vh", "-10vh"],
      rotate: [15, -10, 20, -5]
    }}
    transition={{
      duration: 25,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.3, 0.7, 1]
    }}
    className={`absolute z-10 pointer-events-none drop-shadow-[0_0_15px_rgba(255,204,26,0.6)] ${className}`}
  >
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-12 md:h-12">
      {/* Body */}
      <ellipse cx="32" cy="32" rx="10" ry="16" fill="url(#honey-gradient)" />
      <path d="M22 32C22 26 26 22 32 22C38 22 42 26 42 32" stroke="#1f3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 36C22 30 26 26 32 26C38 26 42 30 42 36" stroke="#1f3a5f" strokeWidth="2" strokeLinecap="round" />
      {/* Wings - Left */}
      <path d="M25 25C15 15 5 20 15 30C20 35 25 25 25 25Z" fill="white" fillOpacity="0.4" stroke="#ffcc1a" strokeWidth="1" />
      <path d="M22 30C12 25 5 35 15 42C20 45 22 30 22 30Z" fill="white" fillOpacity="0.2" stroke="#ffcc1a" strokeWidth="1" />
      {/* Wings - Right */}
      <path d="M39 25C49 15 59 20 49 30C44 35 39 25 39 25Z" fill="white" fillOpacity="0.4" stroke="#ffcc1a" strokeWidth="1" />
      <path d="M42 30C52 25 59 35 49 42C44 45 42 30 42 30Z" fill="white" fillOpacity="0.2" stroke="#ffcc1a" strokeWidth="1" />
      {/* Glow Definition */}
      <defs>
        <radialGradient id="honey-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(16 10)">
          <stop stopColor="#ffea99"/>
          <stop offset="0.6" stopColor="#ffcc1a"/>
          <stop offset="1" stopColor="#cc9900"/>
        </radialGradient>
      </defs>
    </svg>
  </motion.div>
);

function HeroSection() {
  const t = useTranslations("ImpactHero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Trigger animation independently of video load so text appears immediately
    setIsReady(true);
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
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        ref={videoRef}
        src="/long-hero.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
      />

      {/* Multi-layered overlay for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f3a5f]/80 via-[#1f3a5f]/40 to-[#1f3a5f]/80" />

      {/* Premium Honeycomb Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64l-30 17.32-30-17.32v-34.64zM30 103.923l30-17.32v-34.64l-30-17.32-30 17.32v34.64z' fill='none' stroke='%23ffcc1a' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: '90px 155.88px',
        }}
      />
      
      {/* Floating Golden Bees */}
      <GoldenBee delay={0} className="top-1/4 left-0 scale-75 blur-[1px] opacity-60" />
      <GoldenBee delay={8} className="top-1/3 left-0 scale-125 z-20" />
      <GoldenBee delay={15} className="top-2/3 left-0 scale-100 z-10" />
      <GoldenBee delay={22} className="top-1/2 left-0 scale-90 blur-[2px] opacity-40" />

      {/* Seamless transition to content - Fades to the background color #fff9e6 */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fff9e6] to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 w-full px-6 flex flex-col justify-center items-start lg:items-center text-left lg:text-center mt-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: isReady ? 1 : 0, scale: isReady ? 1 : 0.95, y: isReady ? 0 : 40 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-start lg:items-center w-full relative"
        >
          {/* Subtle Accent Line Instead of Box */}
          <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent to-[#ffcc1a]/40" />
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-transparent to-[#ffcc1a]/40" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffcc1a] shadow-[0_0_12px_#ffcc1a] animate-pulse" />
            <span
              className="text-[#ffcc1a] text-xs font-black tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
            className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-white leading-[1.05] tracking-tight mb-8 drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)] max-w-4xl"
          >
            {t("titleLine1")}{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-br from-[#ffcc1a] via-[#ffe066] to-[#cc9900] italic drop-shadow-[0_0_30px_rgba(255,204,26,0.3)] bg-[length:200%_auto] animate-gradient"
            >
              {t("titleHighlight")}
            </span>
          </motion.h1>



          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-4 relative"
          >
            <button
               onClick={scrollToContent}
               className="relative flex items-center gap-3 bg-gradient-to-r from-[#ffcc1a] to-[#ffda66] text-[#1f3a5f] border border-[#ffcc1a] px-10 py-4 font-bold text-sm tracking-wide rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_4px_24px_rgba(255,204,26,0.3)] hover:shadow-[0_8px_32px_rgba(255,204,26,0.5)] group"
            >
               <span className="absolute inset-0 bg-white/30 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out z-0" />
               <Play className="h-5 w-5 fill-current text-[#1f3a5f] relative z-10" />
               <span className="relative z-10 text-[#1f3a5f]">
                  {t("exploreContent")}
               </span>
            </button>
            <button
               onClick={scrollToContent}
               className="text-white/90 text-sm font-bold hover:text-[#ffcc1a] transition-colors flex items-center gap-2 group px-8 py-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {t("browseAll")}
              <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side controls */}
      <div className="absolute bottom-12 right-12 z-20 flex flex-col items-center gap-4">
        {/* Mute Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={toggleMute}
          className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-[#ffcc1a]/50 transition-all hover:scale-110 shadow-lg"
          style={{
             clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </motion.button>
      </div>
    </section>
  );
}

export default function ImpactPage() {
  const t = useTranslations("Impact");
  const [contents, setContents] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");
  const [filterGov, setFilterGov] = useState("all");
  const [visitedGovs, setVisitedGovs] = useState<Set<string>>(new Set());

  const [reelsModalOpen, setReelsModalOpen] = useState(false);
  const [activeReel, setActiveReel] = useState<any>(null);

  const handleReelClick = (item: any) => {
    setActiveReel(item);
    setReelsModalOpen(true);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [contentRes, playlistRes] = await Promise.all([
          api.get("/contents?type=video,reel,podcast,documentary"),
          api.get("/playlists")
        ]);

        if (contentRes.data?.status === "success") {
          setContents(contentRes.data.data.contents.map((c: any) => ({
            id: c._id,
            title: c.title,
            thumbnail: resolveMediaUrl(c.thumbnailUrl) || "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&auto=format&fit=crop",
            duration: formatDuration(c.duration),
            type: c.type,
            isPremium: c.rights !== 'free',
            category: c.type === 'reel' ? 'Reel' : (c.type === 'podcast' ? 'Podcast' : 'Documentary'),
            contentUrl: resolveMediaUrl(c.contentUrl),
            theme: c.themes?.[0] || "Impact",
            region: c.region,
            instagramUsername: c.metadata?.instagramUsername,
            author: c.createdBy?.name || c.authors?.[0],
            metadata: c.metadata
          })));
        }

        if (playlistRes.data?.status === "success") {
          setPlaylists(playlistRes.data.data.playlists);
        }
      } catch (error) {
        console.error("Failed to fetch impact data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const filteredContent = contents.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || item.type.toLowerCase() === filterType.toLowerCase() || item.category.toLowerCase() === filterType.toLowerCase();
    const matchesTheme = filterTheme === "all" || item.theme?.toLowerCase() === filterTheme.toLowerCase();
    const matchesGov = filterGov === "all" || item.region?.toLowerCase() === filterGov.toLowerCase();
    const matchesAccess =
      filterAccess === "all" ||
      (filterAccess === "free" && !item.isPremium) ||
      (filterAccess === "premium" && item.isPremium);
    return matchesSearch && matchesType && matchesAccess && matchesTheme && matchesGov;
  });

  const allReels = filteredContent.filter(item => item.type === "reel");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}
    >
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
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t("currentFocus", { defaultValue: "Current Focus" })}</p>
                    <p className="text-2xl font-serif font-bold text-[#ffcc1a]">{filterGov}</p>
                  </div>
                  <button 
                    onClick={() => setFilterGov("all")}
                    className="px-4 py-2 border border-white/20 rounded-full text-xs hover:bg-white/10 transition-colors"
                  >
                    {t("resetFilter", { defaultValue: "Reset Filter ✕" })}
                  </button>
                </motion.div>
              )}
           </div>
        </div>

        {/* Right: Content Panel - Adjusted widths and added internal padding */}
        <div className="w-full lg:w-[60%] xl:w-[65%] min-h-screen relative z-10 pb-32">
        
          {/* Subtle elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-white/10 pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-12 xl:px-16 py-16 lg:py-24 relative">
            
            {/* ── Section Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 text-left relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-[#ffcc1a]" />
                <span className="text-[#1f3a5f] text-sm font-semibold uppercase tracking-[0.2em]">
                   {t("heritage")}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1f3a5f] leading-tight mb-6">
                {t("sectionTitleLine1")} <span className="italic font-light text-[#1f3a5f]/60">{t("sectionTitleHighlight")}</span>
              </h2>
              
              {/* Playlists / Series Section */}
              {playlists.length > 0 && (
                <div className="mt-12 mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-[#ffcc1a] flex items-center justify-center">
                      <Play className="h-5 w-5 text-[#1f3a5f] fill-current" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold">{t("storySeriesCollections", { defaultValue: "Story Series & Collections" })}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {playlists.map((pl) => (
                      <Link key={pl._id} href={`/impact/playlist/${pl._id}`}>
                        <div className="group relative h-64 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                          <img 
                          src={resolveMediaUrl(pl.items[0]?.contentId?.thumbnailUrl) || "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&auto=format&fit=crop"} 
                            alt={pl.title}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1f3a5f] via-[#1f3a5f]/40 to-transparent" />
                          <div className="absolute bottom-6 left-8 right-6">
                            <Badge className="bg-[#ffcc1a] text-[#1f3a5f] mb-3 border-none uppercase tracking-tighter text-[10px]">
                              {pl.type.replace('_', ' ')} • {pl.items.length} {t("episodes", { defaultValue: "Episodes" })}
                            </Badge>
                            <h4 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-[#ffcc1a] transition-colors">{pl.title}</h4>
                            <p className="text-sm text-white/70 line-clamp-1">{pl.description}</p>
                          </div>
                          <div className="absolute top-6 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <ChevronRight className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              

            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24 z-30 mb-12 flex flex-col lg:flex-row items-center gap-2 p-2 lg:rounded-full rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(31,58,95,0.06)] w-full transition-all"
            >
              <div className="relative flex-1 w-full min-w-[200px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1f3a5f]/50" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="pl-14 h-12 w-full rounded-full border-none bg-transparent hover:bg-white/50 focus:bg-white/90 text-[#1f3a5f] placeholder:text-[#1f3a5f]/50 focus-visible:ring-0 shadow-none text-base transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="hidden lg:block w-px h-8 bg-[#1f3a5f]/10 mx-2" />

              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full lg:w-auto px-2 pb-2 lg:p-0">
                <Select value={filterGov} onValueChange={setFilterGov}>
                  <SelectTrigger className="h-12 border-none bg-transparent hover:bg-white/60 rounded-full px-5 text-[#1f3a5f] focus:ring-0 shadow-none transition-colors data-[state=open]:bg-white font-medium">
                    <SelectValue placeholder={t("governorate", { defaultValue: "Governorate" })} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl min-w-[180px] bg-white/95 backdrop-blur-lg">
                    <SelectItem value="all" className="rounded-xl my-1">{t("allGovernorates", { defaultValue: "All Governorates" })}</SelectItem>
                    {["Ariana","Beja","Ben Arous","Bizerte","Gabes","Gafsa","Jendouba","Kairouan","Kasserine","Kebili","Kef","Mahdia","Manouba","Medenine","Monastir","Nabeul","Sfax","Sidi Bouzid","Siliana","Sousse","Tataouine","Tozeur","Tunis","Zaghouan"].map(gov => (
                      <SelectItem key={gov} value={gov} className="rounded-xl my-1">{gov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterTheme} onValueChange={setFilterTheme}>
                  <SelectTrigger className="h-12 border-none bg-transparent hover:bg-white/60 rounded-full px-5 text-[#1f3a5f] focus:ring-0 shadow-none transition-colors data-[state=open]:bg-white font-medium">
                    <SelectValue placeholder={t("theme")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl min-w-[160px] bg-white/95 backdrop-blur-lg">
                    <SelectItem value="all" className="rounded-xl my-1">{t("allThemes")}</SelectItem>
                    <SelectItem value="youth" className="rounded-xl my-1">{t("youth")}</SelectItem>
                    <SelectItem value="womenArtisans" className="rounded-xl my-1">{t("womenArtisans")}</SelectItem>
                    <SelectItem value="environment" className="rounded-xl my-1">{t("environment")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-12 border-none bg-transparent hover:bg-white/60 rounded-full px-5 text-[#1f3a5f] focus:ring-0 shadow-none transition-colors data-[state=open]:bg-white font-medium">
                    <SelectValue placeholder={t("type")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl min-w-[160px] bg-white/95 backdrop-blur-lg">
                    <SelectItem value="all" className="rounded-xl my-1">{t("allTypes")}</SelectItem>
                    <SelectItem value="podcast" className="rounded-xl my-1">{t("podcast")}</SelectItem>
                    <SelectItem value="video" className="rounded-xl my-1">{t("videoStr")}</SelectItem>
                    <SelectItem value="reel" className="rounded-xl my-1">{t("reels")}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAccess} onValueChange={setFilterAccess}>
                  <SelectTrigger className="h-12 border-none bg-transparent hover:bg-white/60 rounded-full px-5 text-[#1f3a5f] focus:ring-0 shadow-none transition-colors data-[state=open]:bg-white font-medium">
                    <SelectValue placeholder={t("access")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl min-w-[160px] bg-white/95 backdrop-blur-lg">
                    <SelectItem value="all" className="rounded-xl my-1">{t("allAccess")}</SelectItem>
                    <SelectItem value="free" className="rounded-xl my-1">{t("free")}</SelectItem>
                    <SelectItem value="premium" className="rounded-xl my-1">{t("premium")}</SelectItem>
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
                    <ContentCard 
                        {...item} 
                        onClick={item.type === "reel" ? () => handleReelClick(item) : undefined} 
                    />
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

      <InstagramReelsViewer
        isOpen={reelsModalOpen}
        onClose={() => setReelsModalOpen(false)}
        reels={allReels}
        initialId={activeReel?.id}
      />
      <PacksSection type="impact" />
    </div>
  );
}