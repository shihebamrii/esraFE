"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { PlayCircle, ArrowUpRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="relative h-screen min-h-[700px] w-full flex flex-col justify-end bg-[#1f3a5f] text-white pb-16 md:pb-24">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/long-hero.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay: Clear at top, solid Navy at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f3a5f] via-[#1f3a5f]/60 to-transparent" />
      </div>

      {/* Main Content - Bottom Anchored */}
      <div className="container relative z-10 px-6 mx-auto">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <span className="mb-6 flex items-center gap-3 text-sm font-medium text-[#ffcc1a] uppercase tracking-widest drop-shadow-md">
              <span className="h-[2px] w-8 bg-[#ffcc1a]"></span>
              {t("badge")}
            </span>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6 drop-shadow-lg">
              {t("title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc1a] to-[#fff3c7]">
                {t("titleHighlight")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-white/80 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
              {t("subtitle")}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link href="/impact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-16 text-lg font-bold bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-10px_#ffcc1a]">
                  <PlayCircle className="mr-3 w-6 h-6" />
                  {t("startWatching")}
                </Button>
              </Link>
              <Link href="/tounesna" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-16 text-lg font-medium border-2 border-white/20 bg-white/5 backdrop-blur-md hover:bg-white hover:text-[#1f3a5f] transition-all duration-300 group">
                  {t("exploreTounesna")}
                  <ArrowUpRight className="ml-3 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}