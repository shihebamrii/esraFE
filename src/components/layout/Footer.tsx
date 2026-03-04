"use client";

import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Navigation");
  const f = useTranslations("Footer");

  return (
    <footer className="w-full bg-secondary pt-20 pb-12 text-sm text-secondary-foreground">
      <div className="container mx-auto px-4">
        {/* Top Section: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="font-bold text-2xl tracking-tight block mb-4">
               CnBees
             </Link>
             <p className="text-muted-foreground leading-relaxed max-w-xs">
               {f("description")}
             </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{f("explore")}</h4>
            <div className="flex flex-col gap-3">
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">{t("impact")}</Link>
              <Link href="/tounesna" className="text-muted-foreground hover:text-primary transition-colors">{t("tounesna")}</Link>
              <Link href="/packs" className="text-muted-foreground hover:text-primary transition-colors">{t("packs")}</Link>
            </div>
          </div>

          <div>
             <h4 className="font-semibold mb-4 text-foreground">{f("company")}</h4>
             <div className="flex flex-col gap-3">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{f("aboutUs")}</Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{f("careers")}</Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{f("contact")}</Link>
             </div>
          </div>

           <div>
             <h4 className="font-semibold mb-4 text-foreground">{f("connect")}</h4>
             <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
             </div>
           </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>&copy; {new Date().getFullYear()} {f("copyright")}</p>
          <div className="flex gap-6">
             <Link href="#" className="hover:text-primary transition-colors">{f("privacy")}</Link>
             <Link href="#" className="hover:text-primary transition-colors">{f("terms")}</Link>
             <Link href="#" className="hover:text-primary transition-colors">{f("cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
