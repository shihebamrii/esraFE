"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function MissionSection() {
  const t = useTranslations("MissionSection");

  return (
    <section className="py-24 md:py-32 bg-[#fff9e6] overflow-hidden relative border-b border-[#1f3a5f]/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Images Layout - Clean and Modern */}
          <div className="relative order-2 lg:order-1 h-[500px] md:h-[600px] w-full flex gap-4 md:gap-6">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="relative w-[60%] h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-[#1f3a5f]/20"
             >
                <Image
                  src="https://travel.com/wp-content/uploads/2025/09/Aerial-view-of-Sousse-Tunisia-showing-the-UNESCO-World-Heritage-medina-and-Mediterranean.webp"
                  alt="Tunisian landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
             </motion.div>

             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative w-[40%] h-[80%] my-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-[#1f3a5f]/20"
             >
                <Image
                  src="https://travel.com/wp-content/uploads/2025/09/Monastir-beach-during-spring-with-perfect-weather-few-tourists-and-clear-blue-water.webp"
                  alt="Tunisian crafts"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
             </motion.div>
          </div>

          {/* Text/Content Side */}
          <motion.div 
            className="order-1 lg:order-2 flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
                <span className="bg-[#ffcc1a] text-[#1f3a5f] px-4 py-1.5 rounded-full font-bold tracking-widest uppercase text-xs">
                    {t("subtitle")}
                </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#1f3a5f] leading-[1.1] mb-8">
              {t("titleLine1")}{" "}
              <span className="text-[#1f3a5f]/60 font-light">{t("titleHighlight")}</span>
            </h2>
            
            <div className="space-y-6 text-[#1f3a5f]/80 text-lg leading-relaxed font-medium">
                <p>
                  {t("paragraph1")}
                </p>
                <p>
                  {t("paragraph2")}
                </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-[#1f3a5f]/10">
                <div>
                   <span className="block text-4xl font-extrabold text-[#1f3a5f] mb-2">24</span>
                   <span className="text-sm font-bold uppercase tracking-wider text-[#1f3a5f]/60">{t("statRegions")}</span>
                </div>
                <div>
                   <span className="block text-4xl font-extrabold text-[#1f3a5f] mb-2">100+</span>
                   <span className="text-sm font-bold uppercase tracking-wider text-[#1f3a5f]/60">{t("statStories")}</span>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
