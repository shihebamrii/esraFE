"use client";

import { useState } from "react";
import { ContentCard } from "@/features/content/components/ContentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

// Mock Data
const ALL_CONTENTS = [
  {
    id: "1",
    title: "Discovering the Sahara: A Journey Through Time",
    thumbnail: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=800&auto=format&fit=crop",
    duration: "12:45",
    type: "video" as const,
    isPremium: true,
    category: "Documentary"
  },
  {
    id: "2",
    title: "Traditional Crafts of Tunis Medina",
    thumbnail: "https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?q=80&w=800&auto=format&fit=crop",
    duration: "08:20",
    type: "video" as const,
    isPremium: false,
    category: "Culture"
  },
  {
    id: "3",
    title: "The Blue City: Sidi Bou Said Guide",
    thumbnail: "https://i1.pickpik.com/photos/176/752/965/59687782937d9-preview.jpg",
    duration: "15:00",
    type: "video" as const,
    isPremium: true,
    category: "Travel"
  },
  {
    id: "4",
    title: "Tunisian Gastronomy: Couscous Secrets",
    thumbnail: "https://images.unsplash.com/photo-1621319796030-g3c2d1b9b1e9?q=80&w=800&auto=format&fit=crop",
    duration: "10:30",
    type: "video" as const,
    isPremium: false,
    category: "Gastronomy"
  },
    {
    id: "5",
    title: "Carthage: Ruins of an Empire",
    thumbnail: "https://images.unsplash.com/photo-1532420958197-e81c7e96b301?q=80&w=800&auto=format&fit=crop",
    duration: "22:15",
    type: "video" as const,
    isPremium: true,
    category: "History"
  },
];

export default function ImpactPage() {
  const t = useTranslations("Impact");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");

  const filteredContent = ALL_CONTENTS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || item.category.toLowerCase() === filterType.toLowerCase();
    const matchesAccess = filterAccess === "all" || 
      (filterAccess === "free" && !item.isPremium) || 
      (filterAccess === "premium" && item.isPremium);
    
    return matchesSearch && matchesType && matchesAccess;
  });

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      {/* Header - Left Aligned, Clean */}
      <div className="container mx-auto px-4 mb-16 pt-12">
         <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">{t("badge")}</span>
         <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
           {t("title")}
         </h1>
         <p className="text-lg text-muted-foreground max-w-2xl font-light">
           {t("subtitle")}
         </p>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters - Minimal Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end border-b border-border pb-8">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t("searchPlaceholder")} 
              className="pl-9 h-11 bg-secondary/50 border-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px] h-11">
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                <SelectItem value="documentary">{t("documentary")}</SelectItem>
                <SelectItem value="culture">{t("culture")}</SelectItem>
                <SelectItem value="travel">{t("travel")}</SelectItem>
                <SelectItem value="history">{t("history")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAccess} onValueChange={setFilterAccess}>
              <SelectTrigger className="w-full sm:w-[180px] h-11">
                <SelectValue placeholder={t("access")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allAccess")}</SelectItem>
                <SelectItem value="free">{t("free")}</SelectItem>
                <SelectItem value="premium">{t("premium")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredContent.map((item) => (
               <ContentCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p>{t("noContent")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
