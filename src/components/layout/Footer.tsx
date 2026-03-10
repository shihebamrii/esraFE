"use client";

import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Footer() {
  const t = useTranslations("Navigation");
  const f = useTranslations("Footer");

  const pathname = usePathname();
  const isTounesna = pathname?.includes("/tounesna");
  const isImpact = pathname?.includes("/impact");

  // Shared color values
  const bgColor = "#fff9e6";
  const mainColor = isTounesna ? "#6a0d2e" : (isImpact ? "#1f3a5f" : "#1f3a5f"); // Default to navy if not Tounesna
  
  // Shared styles
  const footerStyle = isTounesna 
    ? {
        background: `linear-gradient(to bottom, ${bgColor}, #6a0d2e67)`, // Extremely subtle burgundy-hinted cream
        color: `${mainColor}cc`,
        borderColor: `${mainColor}1a`
      }
    : { 
        backgroundColor: bgColor, 
        color: `${mainColor}cc`,
        borderColor: `${mainColor}1a`
      };
  
  return (
    <footer 
      className="w-full pt-20 pb-12 text-sm transition-colors duration-300 relative z-10 border-t"
      style={footerStyle}
    >
      <div className="container mx-auto px-4">
        {/* Top Section: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="font-bold text-2xl tracking-tight block mb-1">
               <img src="/logo-beestory.png" alt="Bee Story" className="h-40" />
             </Link>
             <p className="leading-relaxed max-w-xs opacity-70">
               {f("description")}
             </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" style={{ color: mainColor }}>
              {f("explore")}
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/impact" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                {t("impact")}
              </Link>
              <Link href="/tounesna" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                {t("tounesna")}
              </Link>
              <Link href="/packs" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                {t("packs")}
              </Link>
            </div>
          </div>

          <div>
             <h4 className="font-semibold mb-4" style={{ color: mainColor }}>
               {f("company")}
             </h4>
             <div className="flex flex-col gap-3">
                <Link href="#" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                  {f("aboutUs")}
                </Link>
                <Link href="#" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                  {f("careers")}
                </Link>
                <Link href="#" className="transition-all hover:opacity-100 opacity-70" style={{ color: mainColor }}>
                  {f("contact")}
                </Link>
             </div>
          </div>

           <div>
             <h4 className="font-semibold mb-4" style={{ color: mainColor }}>
               {f("connect")}
             </h4>
             <div className="flex gap-4">
                <a href="#" className="transition-all hover:scale-110 opacity-70 hover:opacity-100" style={{ color: mainColor }}>
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="transition-all hover:scale-110 opacity-70 hover:opacity-100" style={{ color: mainColor }}>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="transition-all hover:scale-110 opacity-70 hover:opacity-100" style={{ color: mainColor }}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="transition-all hover:scale-110 opacity-70 hover:opacity-100" style={{ color: mainColor }}>
                  <Youtube className="w-5 h-5" />
                </a>
             </div>
           </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-8 opacity-10" style={{ backgroundColor: mainColor }} />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} {f("copyright")}</p>
          <div className="flex gap-6">
             <Link href="#" className="transition-colors hover:opacity-100">{f("privacy")}</Link>
             <Link href="#" className="transition-colors hover:opacity-100">{f("terms")}</Link>
             <Link href="#" className="transition-colors hover:opacity-100">{f("cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
