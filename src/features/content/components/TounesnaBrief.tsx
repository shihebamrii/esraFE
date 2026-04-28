"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

interface PhotoItem {
  _id: string;
  title: string;
  governorate: string;
  landscapeType?: string;
  previewUrl?: string;
  imageUrl?: string;
}

export function TounesnaBrief() {
  const t = useTranslations("TounesnaBrief");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [govCount, setGovCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, govsRes] = await Promise.all([
          api.get("/photos?limit=3&sort=-createdAt"),
          api.get("/photos/governorates"),
        ]);

        if (photosRes.data?.status === "success") {
          setPhotos(photosRes.data.data.photos || []);
          setTotalPhotos(photosRes.data.total || 0);
        }

        if (govsRes.data?.status === "success") {
          const govs = govsRes.data.data.governorates || [];
          setGovCount(govs.length);
        }
      } catch (err) {
        console.error("Failed to fetch tounesna data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPhotoUrl = (photo: PhotoItem) => {
    if (photo.imageUrl) return photo.imageUrl;
    if (photo.previewUrl) return resolveMediaUrl(photo.previewUrl);
    return resolveMediaUrl(`/api/photos/${photo._id}/preview`);
  };

  return (
    <section className="relative py-28 md:py-36 bg-[#fff9e6] overflow-hidden">
      {/* Zellige texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%236a0d2e' stroke-width='0.4'%3E%3Cpath d='M60 0L75 15L60 30L45 15Z'/%3E%3Cpath d='M60 90L75 105L60 120L45 105Z'/%3E%3Cpath d='M0 60L15 45L30 60L15 75Z'/%3E%3Cpath d='M90 60L105 45L120 60L105 75Z'/%3E%3Cpath d='M60 30L75 45L60 60L45 45Z'/%3E%3Cpath d='M60 60L75 75L60 90L45 75Z'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#6a0d2e]/20" />
              <span className="text-[#6a0d2e] font-bold tracking-[0.25em] uppercase text-xs">
                {t("badge")}
              </span>
              <div className="w-12 h-px bg-[#6a0d2e]/20" />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#6a0d2e] tracking-tight leading-[1.08] mb-6">
              {t("titleLine1")}{" "}
              <span className="text-[#6a0d2e]/50 font-light italic">{t("titleHighlight")}</span>
            </h2>

            <p className="text-lg text-[#6a0d2e]/65 leading-relaxed max-w-2xl mx-auto mb-10">
              {t("description")}
            </p>

            {/* Feature pills — with real counts */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 bg-white/60 border border-[#6a0d2e]/10 rounded-full px-5 py-2.5 text-sm text-[#6a0d2e]/80 backdrop-blur-sm shadow-sm">
                <MapPin className="w-4 h-4 text-[#ffcc1a]" />
                <span>{govCount > 0 ? `${govCount} ${t("regions24").replace(/\d+/, '')}`.trim() : t("regions24")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 border border-[#6a0d2e]/10 rounded-full px-5 py-2.5 text-sm text-[#6a0d2e]/80 backdrop-blur-sm shadow-sm">
                <Camera className="w-4 h-4 text-[#ffcc1a]" />
                <span>{totalPhotos > 0 ? `${totalPhotos}+ ${t("photoGallery")}` : t("photoGallery")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 border border-[#6a0d2e]/10 rounded-full px-5 py-2.5 text-sm text-[#6a0d2e]/80 backdrop-blur-sm shadow-sm">
                <ImageIcon className="w-4 h-4 text-[#ffcc1a]" />
                <span>{t("interactiveMap")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Region Cards Grid — Real Photos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#6a0d2e]/40 animate-spin" />
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 max-w-5xl mx-auto">
            {photos.map((photo, i) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <Link
                  href="/tounesna"
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer border border-[#6a0d2e]/10 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 block"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6a0d2e]/90 via-black/20 to-transparent z-20" />

                  <img
                    src={getPhotoUrl(photo)}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute bottom-0 left-0 w-full p-6 z-30 transform group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 text-[#ffcc1a] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{t("explore")}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white line-clamp-2">{photo.title}</h3>
                    <p className="text-sm text-white/60 mt-1">{photo.governorate}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[#6a0d2e]/40 gap-4">
            <Camera className="w-16 h-16" />
            <p className="text-sm font-medium">{t("photoGallery")}</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link
            href="/tounesna"
            className="group inline-flex items-center gap-3 bg-[#6a0d2e] text-[#fff9e6] hover:bg-[#6a0d2e]/90 transition-all duration-300 rounded-full px-8 py-4 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
