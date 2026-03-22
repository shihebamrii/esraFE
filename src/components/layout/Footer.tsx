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
  const mainColor = isTounesna ? "#6a0d2e" : (isImpact ? "#1f3a5f" : "#1f3a5f"); 
  
  // Shared styles
  const footerStyle = isTounesna 
    ? {
        background: `linear-gradient(to bottom, ${bgColor}, #6a0d2e67)`, 
        color: `${mainColor}`,
      }
    : { 
        backgroundColor: bgColor, 
        color: `${mainColor}`,
      };
  
  return (
    <footer 
      className="w-full pt-20 pb-8 text-sm transition-colors duration-500 relative z-10 border-t"
      style={{ ...footerStyle, borderColor: `${mainColor}20` }}
    >

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Grid: 5 Columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-16 mb-20">
          
          {/* Brand Area */}
          <div className="col-span-2 pr-8 flex flex-col justify-start">
             {/* Changed mb-6 to mb-1 and tweaked height to tighten the gap */}
             <Link href="/" className="inline-block mb-1 group">
               <img 
                 src="/logo-beestory.png" 
                 alt="Bee Story" 
                 width={620}
                 height={173}
                 className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
               />
             </Link>
             <p className="leading-relaxed text-base ">
               {f("description")}
             </p>
          </div>
          
          {/* Explore */}
          <div className="col-span-1">
            <h4 className="font-semibold text-base mb-6 tracking-wide">
              {f("explore")}
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/impact" className="relative opacity-70 hover:opacity-100 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                  {t("impact")}
                </Link>
              </li>
              <li>
                <Link href="/tounesna" className="relative opacity-70 hover:opacity-100 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                  {t("tounesna")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
             <h4 className="font-semibold text-base mb-6 tracking-wide">
               {f("company")}
             </h4>
             <ul className="flex flex-col gap-4">
               <li>
                 <Link href="#" className="relative opacity-70 hover:opacity-100 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                   {f("aboutUs")}
                 </Link>
               </li>
               <li>
                 <Link href="#" className="relative opacity-70 hover:opacity-100 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                   {f("careers")}
                 </Link>
               </li>
               <li>
                 <Link href="#" className="relative opacity-70 hover:opacity-100 transition-opacity after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                   {f("contact")}
                 </Link>
               </li>
             </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
             <h4 className="font-semibold text-base mb-6 tracking-wide">
               {f("connect")}
             </h4>
             <div className="flex gap-5">
                <a href="#" className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
             </div>
          </div>
        </div>

        {/* Sub-footer Layout */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-80" style={{ borderColor: `${mainColor}20` }}>
          <p>&copy; {new Date().getFullYear()} {f("copyright")}</p>
          <div className="flex gap-8">
             <Link href="#" className="hover:opacity-100 transition-opacity">{f("privacy")}</Link>
             <Link href="#" className="hover:opacity-100 transition-opacity">{f("terms")}</Link>
             <Link href="#" className="hover:opacity-100 transition-opacity">{f("cookies")}</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}