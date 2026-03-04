"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "The quality of footage available on this platform is unmatched. It has completely transformed how we tell stories about Tunisia.",
    author: "Sarah Ben Ali",
    role: "Documentary Filmmaker",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    initials: "SB"
  },
  {
    quote: "Finally, a centralized hub for high-quality Tunisian digital assets. The licensing is straightforward and the collection is vast.",
    author: "Mohamed Khelil",
    role: "Creative Director",
    avatar: "https://i.pravatar.cc/150?u=mohamed",
    initials: "MK"
  },
  {
    quote: "I've been able to monetize my photography work through Tounesna. The active community and support are amazing.",
    author: "Yasmine Dridi",
    role: "Freelance Photographer",
    avatar: "https://i.pravatar.cc/150?u=yasmine",
    initials: "YD"
  }
];

export function TestimonialsSection() {
  const t = useTranslations("Testimonials");

  return (
    <section className="py-24 bg-secondary/30 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-foreground tracking-tight">
            {t("title")}
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-background p-8 rounded-2xl border border-border/60 shadow-sm relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <Quote className="w-12 h-12 text-primary/5 absolute top-6 right-6" />
              <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed relative z-10 italic">
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                  <AvatarImage src={item.avatar} alt={item.author} />
                  <AvatarFallback>{item.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground">{item.author}</h4>
                  <p className="text-sm text-primary font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
