"use client";

import { ContentCard } from "./ContentCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const MOCK_CONTENTS = [
  {
    id: "1",
    title: "Cinematic Journey: The Golden Dunes",
    thumbnail: "https://travel.com/wp-content/uploads/2025/09/Chebika-Oasis-with-waterfall-palm-trees-and-rocky-mountains-in-the-background.webp",
    duration: "12:45",
    type: "documentary" as const,
    isPremium: true,
    category: "Nature",
  },
  {
    id: "2",
    title: "Artisanal Legacy of the Medina",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/c/c8/%D9%85%D9%8A%D9%86%D8%A7%D8%A1_%D8%A7%D9%84%D8%B5%D9%8A%D8%AF_%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%8A_-_%D9%82%D8%A7%D8%A8%D8%B3.JPG",
    duration: "08:20",
    type: "reels" as const,
    isPremium: false,
    category: "Culture",
  },
  {
    id: "3",
    title: "Echoes of Carthage: A Visual Guide",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Ksiba%2C_Bizerte_1.jpg",
    duration: "15:00",
    type: "videoStr" as const,
    isPremium: true,
    category: "History",
  },
];

export function FeaturedGrid() {
  const t = useTranslations("FeaturedGrid");

  return (
    <div className="w-full py-24 bg-[#fff9e6]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
               <span className="text-xs font-bold text-[#1f3a5f] bg-[#ffcc1a] px-3 py-1 rounded-full tracking-widest uppercase">
                  {t("badge")}
               </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1f3a5f] tracking-tight leading-[1.1]">
              Curated Collections
            </h2>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
          >
             <Link href="/impact" className="hidden md:flex group items-center gap-2 text-[#1f3a5f]/80 font-bold hover:text-[#1f3a5f] transition-colors bg-white/50 px-6 py-3 rounded-full shadow-sm hover:shadow-md border border-[#1f3a5f]/10">
                {t("viewAll")} 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CONTENTS.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
               <ContentCard {...item} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden text-center">
          <Link href="/impact">
            <Button variant="outline" className="w-full h-14 font-semibold text-base border-[#1f3a5f] text-[#1f3a5f] hover:bg-[#1f3a5f]/5">
              {t("viewAllStories")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
