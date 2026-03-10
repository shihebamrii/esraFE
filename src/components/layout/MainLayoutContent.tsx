"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isImpact = pathname?.includes("/impact");
  const isTounesna = pathname?.includes("/tounesna");
  const isHeroPage = isImpact || isTounesna;

  return (
    <main className={cn(
      "flex-1",
      !isHeroPage && "pt-20" // Only add padding if NOT a hero page
    )}>
      {children}
    </main>
  );
}
