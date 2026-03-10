"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

const PACKS = [
  {
    id: "1",
    title: "Starter Creator Pack",
    price: 49,
    features: ["5 High-Res Photos", "1 HD Video", "Commercial License"],
    popular: false,
    arabicTitle: "باقة المبدع المبتدئ"
  },
  {
    id: "2",
    title: "Pro Media Bundle",
    price: 199,
    features: ["50 High-Res Photos", "10 4K Videos", "2 Audio Tracks", "Extended License", "Priority Support"],
    popular: true,
    arabicTitle: "حزمة الميديا الاحترافية"
  },
  {
    id: "3",
    title: "Enterprise Collection",
    price: 499,
    features: ["Unlimited Access", "ALL Tounesna Photos", "ALL Impact Videos", "Global License", "Custom Edits"],
    popular: false,
    arabicTitle: "مجموعة المؤسسات"
  }
];

export function PacksSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden mt-12 mb-20">
      {/* Background Decorative Elements */}
      <div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6a0d2e]/20 to-transparent" 
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="text-[#ffcc1a] text-lg">✦</span>
             <span className="text-[11px] tracking-[0.4em] uppercase text-[#6a0d2e]/60 font-bold">
               اكتشف الباقات — Exclusive Bundles
             </span>
             <span className="text-[#ffcc1a] text-lg">✦</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif text-[#6a0d2e] mb-6 drop-shadow-sm">
            Unlock the Full Vision
          </h2>
          <p className="text-[#6a0d2e]/60 text-lg max-w-2xl mx-auto font-light">
            Choose a curated pack that fits your needs. Each bundle is designed to give you the highest quality access to Tunisia's digital heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKS.map((pack) => (
            <div 
              key={pack.id} 
              className={`group relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:translate-y-[-8px] ${
                pack.popular 
                ? 'bg-[#6a0d2e] text-[#fff9e6] shadow-[0_25px_60px_rgba(106,13,46,0.25)] border-[#6a0d2e] scale-105 z-10' 
                : 'bg-white/60 backdrop-blur-xl border border-white/80 text-[#6a0d2e] shadow-[0_15px_40px_rgba(106,13,46,0.04)] hover:shadow-[0_20px_50px_rgba(106,13,46,0.08)]'
              }`}
            >
              {/* Card Geometric Pattern Overlay */}
              <div 
                className={`absolute inset-0 opacity-[0.03] pointer-events-none rounded-[2.5rem] ${pack.popular ? 'mix-blend-overlay' : ''}`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='${pack.popular ? '%23fff9e6' : '%236a0d2e'}' stroke-width='0.5'%3E%3Cpath d='M40 0L50 10L40 20L30 10Z'/%3E%3Cpath d='M40 60L50 70L40 80L30 70Z'/%3E%3Cpath d='M0 40L10 30L20 40L10 50Z'/%3E%3Cpath d='M60 40L70 30L80 40L70 50Z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              {pack.popular && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ffcc1a] text-[#6a0d2e] hover:bg-[#ffcc1a] border-none px-6 py-1.5 text-[10px] tracking-widest uppercase font-bold shadow-lg">
                  Most Preferred
                </Badge>
              )}
              
              <div className="mb-8">
                <span className={`text-[10px] tracking-[0.2em] uppercase font-bold opacity-60 block mb-2`}>
                   {pack.arabicTitle}
                </span>
                <h3 className="text-2xl font-serif font-bold mb-4">{pack.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold">{pack.price}</span>
                  <span className="text-sm opacity-60 font-bold uppercase tracking-tighter">TND</span>
                </div>
              </div>
              
              <ul className="flex-1 space-y-5 mb-10">
                 {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm leading-tight">
                       <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${pack.popular ? 'bg-[#ffcc1a] text-[#6a0d2e]' : 'bg-[#6a0d2e]/10 text-[#6a0d2e]'}`}>
                         <Check className="h-3 w-3 " strokeWidth={3} />
                       </div>
                       <span className="opacity-90">{feature}</span>
                    </li>
                 ))}
              </ul>

              <Button 
                size="lg" 
                className={`w-full h-14 rounded-2xl font-bold transition-all duration-300 ${
                  pack.popular 
                  ? 'bg-[#ffcc1a] text-[#6a0d2e] hover:bg-white hover:scale-[1.02] shadow-[0_10px_25px_rgba(255,204,26,0.3)]' 
                  : 'bg-[#6a0d2e] text-[#fff9e6] hover:bg-[#8d113d] hover:shadow-[0_10px_25px_rgba(106,13,46,0.15)]'
                }`}
              >
                 {pack.popular && <Sparkles className="mr-2 h-4 w-4 fill-current" />}
                 Secure This Collection
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Side Decorative Mashrabiya accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffcc1a]/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#6a0d2e]/5 rounded-full blur-3xl pointer-events-none opacity-50" />
    </section>
  );
}
