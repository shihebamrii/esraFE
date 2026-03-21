"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Play } from "lucide-react";

export function ImpactPreview() {
  const t = useTranslations("ImpactPreview");

  return (
    <section className="relative py-24 md:py-32 bg-[#1f3a5f] text-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-6 gap-8">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="max-w-2xl"
            >
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-[#ffcc1a] text-xs font-bold tracking-widest uppercase">
                    {t("sectionBadge")}
                 </span>
               </div>
               <h2 className="text-4xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight">
                 {t("titleLine1")} <span className="text-[#ffcc1a]">{t("titleHighlight")}</span>
               </h2>
               <p className="mt-4 text-white/60 text-base leading-relaxed max-w-xl">
                 {t("subtitle")}
               </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
            >
               <Link href="/impact" className="group flex items-center gap-2 text-white font-semibold hover:text-[#ffcc1a] transition-colors">
                  <span className="font-bold text-sm tracking-wide">{t("viewAll")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </motion.div>
        </div>

        {/* Feature Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px] mt-10">
            
            {/* Featured Item - Large */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="lg:col-span-8 relative rounded-2xl overflow-hidden group h-[400px] lg:h-full cursor-pointer bg-white/5 border border-white/10 shadow-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300"
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500 z-10" />
                <div 
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                   style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Kasserine2.JPG/1280px-Kasserine2.JPG")' }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#ffcc1a] transition-all duration-300">
                        <Play className="w-6 h-6 text-white group-hover:text-[#1f3a5f] ml-1 fill-current" />
                     </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                   <div className="flex items-center gap-2 mb-3">
                     <span className="inline-block px-3 py-1 bg-[#ffcc1a] text-[#1f3a5f] text-xs font-bold uppercase tracking-wider rounded-md">
                        {t("documentaryBadge")}
                     </span>
                     <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-md backdrop-blur-sm">
                        📍 Kasserine
                     </span>
                   </div>
                   <h3 className="text-3xl font-bold text-white mb-2">{t("featuredTitle")}</h3>
                   <p className="text-white/80 max-w-xl line-clamp-2">{t("featuredDesc")}</p>
                </div>
            </motion.div>

            {/* Side Grid - Smaller Items */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 h-full">
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: 0.2 }}
                   className="relative rounded-2xl overflow-hidden group h-[200px] lg:h-full cursor-pointer border border-white/10 bg-white/5 shadow-sm hover:shadow-lg hover:border-white/20 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                    <div 
                       className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                       style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Tataouine_%282%29.jpg/1280px-Tataouine_%282%29.jpg")' }}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 bg-gradient-to-t from-black/80 to-transparent">
                       <span className="text-[#ffcc1a] text-[10px] font-bold uppercase tracking-wider">📍 Tataouine</span>
                       <h3 className="text-xl font-bold text-white group-hover:text-[#ffcc1a] transition-colors mt-1">{t("sideTitle1")}</h3>
                       <div className="flex items-center gap-2 mt-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                           <Play className="w-3 h-3" /> {t("reelsBadge")}
                       </div>
                    </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: 0.4 }}
                   className="relative rounded-2xl overflow-hidden group h-[200px] lg:h-full cursor-pointer border border-white/10 bg-white/5 shadow-sm hover:shadow-lg hover:border-white/20 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                    <div 
                       className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                       style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nabeul_Pottery.jpg/1280px-Nabeul_Pottery.jpg")' }}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 bg-gradient-to-t from-black/80 to-transparent">
                       <span className="text-[#ffcc1a] text-[10px] font-bold uppercase tracking-wider">📍 Nabeul</span>
                       <h3 className="text-xl font-bold text-white group-hover:text-[#ffcc1a] transition-colors mt-1">{t("sideTitle2")}</h3>
                       <div className="flex items-center gap-2 mt-2 text-white/70 text-xs font-bold uppercase tracking-wider">
                           <Play className="w-3 h-3" /> {t("podcastBadge")}
                       </div>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </section>
  );
}
