"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  ListVideo,
  Image as ImageIcon,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Upload,
  Users
} from "lucide-react";

export function AdminSidebar() {
  const t = useTranslations("AdminDashboard.sidebar");
  const pathname = usePathname();
  const router = useRouter();

  const sidebarNavItems = [
    {
      title: t("dashboard"),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      title: t("users"),
      href: "/admin/users",
      icon: Users,
      gradient: "from-violet-600 to-purple-600",
    },
    {
      title: t("packs"),
      href: "/admin/packs",
      icon: Package,
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      title: t("playlists"),
      href: "/admin/playlists",
      icon: ListVideo,
      gradient: "from-amber-600 to-orange-600",
    },
    {
      title: t("upload"),
      href: "/admin/upload",
      icon: Upload,
      gradient: "from-rose-600 to-pink-600",
    },
    {
      title: t("contentImpact"),
      href: "/admin/content",
      icon: Video,
      gradient: "from-cyan-600 to-blue-600",
    },
    {
      title: t("photosTounesna"),
      href: "/admin/photos",
      icon: ImageIcon,
      gradient: "from-fuchsia-600 to-purple-600",
    },
    {
      title: t("orders"),
      href: "/admin/orders",
      icon: ShoppingCart,
      gradient: "from-orange-600 to-red-600",
    },
  ];

  return (
    <nav className="relative hidden h-screen border-r pt-16 lg:block w-72 bg-muted/10">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight uppercase text-muted-foreground">
              {t("overview")}
            </h2>
            <div className="grid gap-1">
               {sidebarNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                    >
                      <span className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                      )}>
                        <Icon className="me-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  )
               })}
            </div>
          </div>
        </div>
      </div>
      
    </nav>
  );
}
