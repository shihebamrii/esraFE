import { Hero } from "@/features/content/components/Hero";
import { AboutUsSection } from "@/features/content/components/AboutUsSection";
import { ContactForm } from "@/features/content/components/ContactForm";
import { ImpactBrief } from "@/features/content/components/ImpactBrief";
import { TounesnaBrief } from "@/features/content/components/TounesnaBrief";

export default async function Home() {
  return (
    <div className="bg-[#fff9e6] min-h-screen font-sans selection:bg-[#ffcc1a] selection:text-[#1f3a5f] flex flex-col">
      
      {/* ── Background Video/Hero Section ── */}
      <div className="relative z-10 w-full">
        <Hero />
      </div>

      {/* ── Brief: What is Impact ── */}
      <div className="relative z-10 w-full">
        <ImpactBrief />
      </div>

      {/* ── Brief: What is Tounesna ── */}
      <div className="relative z-10 w-full">
        <TounesnaBrief />
      </div>

      {/* ── About Us ── */}
      <div className="relative z-10 w-full">
        <AboutUsSection />
      </div>

      {/* ── Contact Section ── */}
      <div className="relative z-10 w-full" id="contact">
        <ContactForm />
      </div>

    </div>
  );
}
