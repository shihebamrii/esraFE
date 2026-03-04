"use client";

import { ContentCard } from "./ContentCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Mock data
const MOCK_CONTENTS = [
  {
    id: "1",
    title: "Discovering the Sahara: A Journey Through Time",
    thumbnail: "/images/placeholders/sahara-thumb.png",
    duration: "12:45",
    type: "video" as const,
    isPremium: true,
    category: "Documentary"
  },
  {
    id: "2",
    title: "Traditional Crafts of Tunis Medina",
    thumbnail: "/images/placeholders/tunis-thumb.png",
    duration: "08:20",
    type: "video" as const,
    isPremium: false,
    category: "Culture"
  },
  {
    id: "3",
    title: "The Blue City: Sidi Bou Said Guide",
    thumbnail: "/images/placeholders/sidi-bou-said-thumb.png",
    duration: "15:00",
    type: "video" as const,
    isPremium: true,
    category: "Travel"
  },
];

export function FeaturedGrid() {
  const t = useTranslations("FeaturedGrid");

  return (
    <section className="py-24 container mx-auto px-4">
      {/* Header - Simple & Clean */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6 border-b border-border/40 pb-6">
        <div>
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight">
            {t("title")}
          </h2>
        </div>
        <Link href="/impact" className="hidden md:block">
          <Button variant="ghost" className="group text-muted-foreground hover:text-foreground">
            {t("viewAll")} 
            <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {MOCK_CONTENTS.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ContentCard {...item} />
          </motion.div>
        ))}
      </div>
      
      {/* Mobile CTA */}
      <div className="mt-12 md:hidden text-center">
        <Link href="/impact">
          <Button variant="outline" className="w-full">
            {t("viewAllStories")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
