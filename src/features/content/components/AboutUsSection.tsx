"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, Target, Users } from "lucide-react";

export function AboutUsSection() {
  const t = useTranslations("AboutUs");

  const values = [
    { icon: <Shield className="w-6 h-6" />, title: t("authenticity") },
    { icon: <Target className="w-6 h-6" />, title: t("quality") },
    { icon: <Users className="w-6 h-6" />, title: t("community") },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-[#ffcc1a]/20 text-[#1f3a5f] px-4 py-1.5 rounded-full font-bold tracking-widest uppercase text-xs mb-6 inline-block">
                {t("badge")}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1f3a5f] leading-tight mb-8">
                {t("titleLine1")}{" "}
                <span className="text-[#ffcc1a]">{t("titleHighlight")}</span>
              </h2>
              
              <div className="space-y-6 text-lg text-[#1f3a5f]/70 leading-relaxed mb-10">
                <p>{t("paragraph1")}</p>
                <p>{t("paragraph2")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-3 bg-[#fff9e6] p-4 rounded-2xl border border-[#ffcc1a]/10">
                    <div className="text-[#ffcc1a]">{value.icon}</div>
                    <span className="font-bold text-[#1f3a5f]">{value.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 1 }}
               className="relative rounded-3xl overflow-hidden shadow-2xl"
             >
                <img
                  src="/collab.png"
                  alt="About BeeStory"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f3a5f]/60 to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                   <h3 className="text-white font-bold text-xl mb-2">{t("vision")}</h3>
                   <p className="text-white/80 text-sm leading-relaxed">{t("visionText")}</p>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
