"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = ["q1", "q2", "q3"];

export function FaqSection() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 border border-primary/20 rounded-full text-xs font-semibold text-primary uppercase mb-4 bg-primary/5 tracking-wider">
            {t("title").split(" ")[0]}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-foreground tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((key, i) => (
            <div 
              key={key} 
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                openIndex === i ? "bg-card shadow-md border border-primary/10" : "bg-secondary/30 hover:bg-secondary/60 border border-transparent"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-medium pr-8 transition-colors ${openIndex === i ? "text-primary" : "text-foreground"}`}>
                  {t(`${key}`)}
                </span>
                <span className={`flex-shrink-0 ml-4 p-2 rounded-full transition-all duration-300 ${openIndex === i ? "bg-primary text-white rotate-180" : "bg-card text-muted-foreground"}`}>
                  {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed border-t border-border/40 mt-2">
                       <div className="pt-4">
                        {t(`a${i + 1}`)}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
