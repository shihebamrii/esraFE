"use client"

import * as React from "react"
import { Check, Globe } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "@/i18n/navigation" // Need to create navigation.ts

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLocale('en')}>
          <span className={locale === 'en' ? "font-bold" : ""}>English</span>
          {locale === 'en' && <Check className="ms-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('fr')}>
          <span className={locale === 'fr' ? "font-bold" : ""}>Français</span>
          {locale === 'fr' && <Check className="ms-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLocale('ar')}>
          <span className={locale === 'ar' ? "font-bold" : ""}>العربية</span>
          {locale === 'ar' && <Check className="ms-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
