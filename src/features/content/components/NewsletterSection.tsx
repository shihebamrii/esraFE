"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  const t = useTranslations("Newsletter");

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm mx-auto">
            <Mail className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 font-light leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
            <Input 
              type="email" 
              placeholder={t("placeholder")} 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-full px-6 focus-visible:ring-offset-0 focus-visible:ring-white/30 backdrop-blur-sm"
            />
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-12 font-medium">
              {t("button")}
            </Button>
          </div>
          
          <p className="mt-6 text-xs text-white/50">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
