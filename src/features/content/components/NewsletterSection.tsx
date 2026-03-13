"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const t = useTranslations("Newsletter");

  return (
    <section className="py-32 bg-[#fff9e6] relative overflow-hidden border-t border-[#1f3a5f]/10">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-3xl mx-auto bg-[#1f3a5f] rounded-3xl p-10 md:p-16 shadow-2xl border border-white/10"
        >
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffcc1a] text-[#1f3a5f] shadow-lg">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight leading-tight">
             Stay Connected<br/>
             <span className="text-[#ffcc1a] font-light text-3xl md:text-4xl">with BeeStory</span>
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
            {t("subtitle")}
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1">
               <Input 
                 type="email" 
                 placeholder={t("placeholder")} 
                 className="bg-white border-transparent text-[#1f3a5f] placeholder:text-[#1f3a5f]/40 h-14 rounded-full px-6 focus-visible:ring-[#ffcc1a] shadow-inner text-base"
               />
            </div>
            <Button className="w-full sm:w-auto bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white rounded-full px-10 h-14 font-bold text-base shadow-md hover:-translate-y-1 transition-all">
              {t("button")}
            </Button>
          </form>
          
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-white/40">
            {t("disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
