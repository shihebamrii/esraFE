import { Hero } from "@/features/content/components/Hero";
import { FeaturedGrid } from "@/features/content/components/FeaturedGrid";
import { StatsSection } from "@/features/content/components/StatsSection";
import { TestimonialsSection } from "@/features/content/components/TestimonialsSection";
import { FaqSection } from "@/features/content/components/FaqSection";
import { NewsletterSection } from "@/features/content/components/NewsletterSection";
import { Camera, Video, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Features");
  const cta = await getTranslations("CTA");

  const features = [
    {
      icon: Video,
      title: t("cinematicTitle"),
      description: t("cinematicDescription"),
    },
    {
      icon: Camera,
      title: t("photographyTitle"),
      description: t("photographyDescription"),
    },
    {
      icon: Package,
      title: t("collectionsTitle"),
      description: t("collectionsDescription"),
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Hero />
      
      <StatsSection />

      {/* Editorial Grid / Features - Clean & Spacious */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4 tracking-tight">
              {t("sectionTitle")}
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              {t("sectionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedGrid />
      
      <TestimonialsSection />
      
      <FaqSection />
      
      <NewsletterSection />

      {/* Minimal CTA */}
      <section className="py-32 bg-background text-foreground border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">
            {cta("title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {cta("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-12 font-medium">
                {cta("getStarted")}
              </Button>
            </Link>
            <Link href="/tounesna">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12">
                {cta("browseGallery")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
