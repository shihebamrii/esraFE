"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";

const REGIONS = [
  { id: "1", name: "Tozeur", image: "https://travel.com/wp-content/uploads/2025/09/Chebika-Oasis-with-waterfall-palm-trees-and-rocky-mountains-in-the-background.webp" },
  { id: "2", name: "Tunis", image: "https://travel.com/wp-content/uploads/2025/09/Monastir-beach-during-spring-with-perfect-weather-few-tourists-and-clear-blue-water.webp" },
  { id: "3", name: "Kairouan", image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/%D9%85%D9%8A%D9%86%D8%A7%D8%A1_%D8%A7%D9%84%D8%B5%D9%8A%D8%AF_%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%8A_-_%D9%82%D8%A7%D8%A8%D8%B3.JPG" },
  { id: "4", name: "Kebili", image: "https://travel.com/wp-content/uploads/2025/09/Aerial-view-of-Kebili-oasis-with-palm-trees-and-desert-landscape-in-Tunisia.webp" },
];

export function RegionsPreview() {
  const t = useTranslations("RegionsPreview");

  return (
    <section className="relative py-24 md:py-32 bg-[#fff9e6] overflow-hidden border-t border-[#6a0d2e]/10">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
           >
              <div className="flex items-center justify-center gap-4 mb-6">
                 <div className="w-12 h-px bg-[#6a0d2e]/20" />
                 <span className="text-[#6a0d2e] font-bold tracking-widest uppercase text-xs">
                     {t("sectionBadge")}
                 </span>
                 <div className="w-12 h-px bg-[#6a0d2e]/20" />
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#6a0d2e] tracking-tight leading-[1.1] mb-6">
                {t("titleLine1")}{" "}
                <span className="text-[#6a0d2e]/60 font-light">{t("titleHighlight")}</span>
              </h2>

              <p className="text-lg text-[#6a0d2e]/70 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                {t("subtitle")}
              </p>

              <Link href="/tounesna" className="inline-flex items-center gap-3 bg-[#6a0d2e] text-[#fff9e6] hover:bg-[#6a0d2e]/90 transition-colors rounded-full px-8 py-4 font-bold shadow-md hover:shadow-lg hover:-translate-y-1 duration-300">
                  {t("cta")}
                  <ArrowRight className="w-4 h-4" />
              </Link>
           </motion.div>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {REGIONS.map((region, i) => (
              <motion.div
                 key={region.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer border border-[#6a0d2e]/10 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
                  
                  <img
                    src={region.image}
                    alt={region.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 z-30 transform group-hover:-translate-y-1 transition-transform duration-300">
                     <div className="flex items-center gap-2 text-[#ffcc1a] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t("explore")}</span>
                     </div>
                     <h3 className="text-2xl font-bold text-white">{region.name}</h3>
                  </div>
              </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}
