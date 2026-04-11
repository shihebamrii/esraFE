import { Hero } from "@/features/content/components/Hero";
import { FeaturedGrid } from "@/features/content/components/FeaturedGrid";
import { MissionSection } from "@/features/content/components/MissionSection";
import { RegionsPreview } from "@/features/content/components/RegionsPreview";
import { ImpactPreview } from "@/features/content/components/ImpactPreview";
import { StatsSection } from "@/features/content/components/StatsSection";
import { NewsletterSection } from "@/features/content/components/NewsletterSection";
import { AboutUsSection } from "@/features/content/components/AboutUsSection";
import { ContactForm } from "@/features/content/components/ContactForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const cta = await getTranslations("CTA");

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary selection:text-primary-foreground flex flex-col">
      
      {/* ── Background Video/Hero Section ── */}
      <div className="relative z-10 w-full">
        <Hero />
      </div>

      {/* ── Mission/About Section ── */}
      <div className="relative z-10 w-full">
        <MissionSection />
      </div>

      {/* ── Interactive Regions (Tounesna) Preview ── */}
      <div className="relative z-10 w-full">
        <RegionsPreview />
      </div>

      {/* ── About Us Detailed Section ── */}
      <div className="relative z-10 w-full">
        <AboutUsSection />
      </div>

      {/* ── Impact (Videos/Documentary) Preview ── */}
      <div className="relative z-10 w-full">
        <ImpactPreview />
      </div>

      {/* ── Stat Counters ── */}
      <div className="relative z-10 w-full bg-background">
        <StatsSection />
      </div>

      {/* ── Featured Grid / Collections ── */}
      <div className="relative z-10 w-full">
         <FeaturedGrid />
      </div>

      {/* ── Contact Form Section ── */}
      <div className="relative z-10 w-full" id="contact">
        <ContactForm />
      </div>
      
      {/* ── Premium CTA ── */}
      <section className="relative z-10 w-full py-32 bg-[#fff9e6] text-[#6a0d2e] border-t border-[#6a0d2e]/10 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-3xl relative">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight text-[#6a0d2e]">
            {cta("title")} <span className="text-[#ffcc1a] font-light">Tounesna</span>
          </h2>
          <p className="text-xl text-[#6a0d2e]/70 mb-12 leading-relaxed">
            {cta("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-10 h-14 font-bold text-base bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                {cta("getStarted")}
              </Button>
            </Link>
            <Link href="/tounesna">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold text-base border-2 border-[#6a0d2e] text-[#6a0d2e] hover:bg-[#6a0d2e] hover:text-[#fff9e6] transition-all hover:-translate-y-1">
                {cta("browseGallery")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <div className="relative z-10 w-full">
        <NewsletterSection />
      </div>

    </div>
  );
}
