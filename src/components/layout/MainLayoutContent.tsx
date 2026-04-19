"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isImpact = pathname?.includes("/impact");
  const isTounesna = pathname?.includes("/tounesna");
  const isHeroPage = isImpact || isTounesna;
  const isAdminPage = pathname?.includes("/admin");

  return (
    <main className={cn(
      "flex-1",
      !isHeroPage && !isAdminPage && "pt-20" // No padding for hero pages or admin
    )}>
      {children}
    </main>
  );
}
