"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: 'url("/images/placeholders/hero-bg.png")' }} 
        />
        {/* Sophisticated Overlay - Dark Navy tint for richness */}
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium text-white tracking-widest uppercase mb-8 backdrop-blur-sm">
            {t("badge")}
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 tracking-tight leading-[1.1]">
            {t("title")} <br/>
            <span className="italic font-light">{t("titleHighlight")}</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/impact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-14 text-base font-medium border-0 shadow-xl transition-transform hover:scale-105">
                {t("startWatching")}
              </Button>
            </Link>
            <Link href="/tounesna">
              <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10 hover:text-white rounded-full px-8 h-14 text-base font-medium backdrop-blur-sm transition-transform hover:scale-105">
                {t("exploreTounesna")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
}
