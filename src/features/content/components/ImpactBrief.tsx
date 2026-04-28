"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Play, Film, Mic, Clapperboard, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

interface ContentItem {
  _id: string;
  title: string;
  type: string;
  region?: string;
  themes?: string[];
  duration?: number;
  thumbnailUrl?: string;
  contentUrl?: string;
  rights?: string;
  createdBy?: { name: string };
  authors?: string[];
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function ImpactBrief() {
  const t = useTranslations("ImpactBrief");
  const [featured, setFeatured] = useState<ContentItem | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/contents?type=video,reel,podcast,documentary&limit=5&sort=-createdAt");
        if (res.data?.status === "success") {
          const items = res.data.data.contents || [];
          setTotalCount(res.data.total || items.length);
          // Pick the first item with a thumbnail as featured, fallback to first item
          const withThumb = items.find((c: any) => c.thumbnailUrl);
          setFeatured(withThumb || items[0] || null);
        }
      } catch (err) {
        console.error("Failed to fetch impact data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredThumb = featured?.thumbnailUrl
    ? resolveMediaUrl(featured.thumbnailUrl)
    : null;

  return (
    <section className="relative py-28 md:py-36 bg-[#1f3a5f] text-white overflow-hidden">
      {/* Subtle honeycomb pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64l-30 17.32-30-17.32v-34.64zM30 103.923l30-17.32v-34.64l-30-17.32-30 17.32v34.64z' fill='none' stroke='%23ffcc1a' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 138px',
        }}
      />
      
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffcc1a]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#ffcc1a]/3 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#ffcc1a]" />
              <span className="text-[#ffcc1a] text-xs font-bold tracking-[0.25em] uppercase">
                {t("badge")}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-8">
              {t("titleLine1")}{" "}
              <span className="text-[#ffcc1a] font-light italic">{t("titleHighlight")}</span>
            </h2>
            
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
              {t("description")}
            </p>

            {/* Content type pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <Film className="w-4 h-4 text-[#ffcc1a]" />
                <span>{t("documentaries")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <Clapperboard className="w-4 h-4 text-[#ffcc1a]" />
                <span>{t("reels")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <Mic className="w-4 h-4 text-[#ffcc1a]" />
                <span>{t("podcasts")}</span>
              </div>
            </div>

            <Link 
              href="/impact" 
              className="group inline-flex items-center gap-3 bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white transition-all duration-300 rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Visual Side — Real Data */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="order-1 lg:order-2 relative"
          >
            {isLoading ? (
              <div className="aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#ffcc1a] animate-spin" />
              </div>
            ) : featured ? (
              <>
                <Link href="/impact" className="block relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
                  {featuredThumb ? (
                    <img
                      src={featuredThumb}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1f3a5f] to-[#0d1f33]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f3a5f]/90 via-[#1f3a5f]/30 to-transparent" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-20 h-20 rounded-full bg-[#ffcc1a]/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#ffcc1a] transition-all duration-300 border border-white/20">
                      <Play className="w-8 h-8 text-white group-hover:text-[#1f3a5f] ml-1 fill-current" />
                    </div>
                  </div>

                  {/* Bottom info — real data */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#ffcc1a] text-[#1f3a5f] text-xs font-bold uppercase tracking-wider rounded-md">
                        {featured.type === "reel" ? "Reel" : featured.type === "podcast" ? "Podcast" : t("featuredBadge")}
                      </span>
                      {featured.region && (
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-white/10">
                          {featured.region}
                        </span>
                      )}
                      {featured.duration ? (
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-white/10">
                          {formatDuration(featured.duration)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-2xl font-bold text-white line-clamp-2">{featured.title}</h3>
                    {(featured.createdBy?.name || featured.authors?.[0]) && (
                      <p className="text-sm text-white/50 mt-1">
                        {featured.createdBy?.name || featured.authors?.[0]}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Floating stat card — real count */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-8 -left-6 md:-left-10 bg-white rounded-2xl p-5 shadow-2xl border border-black/5 z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ffcc1a] flex items-center justify-center">
                      <Film className="w-6 h-6 text-[#1f3a5f]" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-[#1f3a5f]">{totalCount}+</p>
                      <p className="text-xs font-bold text-[#1f3a5f]/50 uppercase tracking-wider">{t("hoursContent")}</p>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Fallback when no content exists */
              <div className="aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 text-white/40">
                <Film className="w-16 h-16" />
                <p className="text-sm font-medium">{t("featuredTitle")}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
