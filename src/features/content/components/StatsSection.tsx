"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Film, Users, Download, Star } from "lucide-react";

const statsConfig = [
  {
    icon: Film,
    key: "hoursFootage",
    value: "150+"
  },
  {
    icon: Users,
    key: "activeCreators",
    value: "50+"
  },
  {
    icon: Download,
    key: "downloads",
    value: "2000+"
  },
  {
    icon: Star,
    key: "satisfaction",
    value: "4.9"
  },
];

export function StatsSection() {
  const t = useTranslations("Stats");

  return (
    <section className="py-24 bg-[#6a0d2e] relative overflow-hidden border-b border-[#6a0d2e]/90">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-x-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`flex flex-col items-center text-center group ${index > 1 ? "pt-12 lg:pt-0" : index === 1 ? "pt-0 lg:pt-0" : ""}`}
            >
               <div className="mb-6 p-4 rounded-full bg-white/10 text-[#ffcc1a] shadow-sm group-hover:bg-[#ffcc1a] group-hover:text-[#6a0d2e] transition-colors duration-300">
                  <stat.icon className="w-8 h-8" />
               </div>
               <h3 className="text-4xl md:text-5xl font-black text-[#fff9e6] mb-3 tracking-tight">
                 {stat.value}
               </h3>
               <p className="text-white/70 text-sm font-semibold uppercase tracking-widest">
                 {t(stat.key)}
               </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
