"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Film, Users, Download, Star } from "lucide-react";

// Helper to define stats configuration outside component to keep it clean
// We use keys that match the translation file
const statsConfig = [
  {
    icon: Film,
    key: "hoursFootage",
    color: "text-blue-500",
    value: "150+"
  },
  {
    icon: Users,
    key: "activeCreators",
    color: "text-purple-500",
    value: "50+"
  },
  {
    icon: Download,
    key: "downloads",
    color: "text-green-500",
    value: "2000+"
  },
  {
    icon: Star,
    key: "satisfaction",
    color: "text-yellow-500",
    value: "4.9"
  },
];

export function StatsSection() {
  const t = useTranslations("Stats");

  return (
    <section className="py-20 bg-background border-y border-border/40 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
        
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`mb-5 p-4 rounded-2xl bg-secondary/50 backdrop-blur-sm group-hover:bg-secondary transition-colors duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold font-serif mb-2 text-foreground tracking-tight">
                {stat.value}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base font-medium uppercase tracking-wider">
                {t(stat.key)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
