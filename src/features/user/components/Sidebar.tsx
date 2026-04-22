"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Download,
  User,
  Heart,
  LogOut,
  Menu,
  X,
  Sparkles,
  Camera,
  ImageIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function UserSidebar() {
  const t = useTranslations("UserDashboard.sidebar");
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarNavItems = [
    {
      title: t("dashboard"),
      href: "/user/dashboard",
      icon: LayoutDashboard,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: t("orders"),
      href: "/user/orders",
      icon: ShoppingBag,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: t("downloads"),
      href: "/user/downloads",
      icon: Download,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: t("favorites"),
      href: "/user/favorites",
      icon: Heart,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      title: t("profile"),
      href: "/profile",
      icon: User,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: t("upload"),
      href: "/user/upload",
      icon: Camera,
      gradient: "from-fuchsia-500 to-pink-600",
    },
    {
      title: t("myUploads", { defaultValue: "My Uploads" }),
      href: "/user/uploads",
      icon: ImageIcon,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Avatar Section */}
      <div className="p-5 mb-2">
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20">
          <div className="relative">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/25">
              {userInitials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-violet-500" />
              <p className="text-[11px] text-muted-foreground font-medium">{t("member")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3">
        <p className="px-4 mb-3 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/70">
          {t("navigation")}
        </p>
        <div className="space-y-1">
          {sidebarNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-violet-500/15 to-purple-500/10 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
                  )}
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                        : "bg-muted/80 text-muted-foreground group-hover:bg-accent group-hover:text-foreground group-hover:scale-110"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 py-2.5"
          onClick={handleLogout}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/80">
            <LogOut className="h-4 w-4" />
          </span>
          {t("logout")}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg hover:scale-105 transition-transform"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <nav
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-background/95 backdrop-blur-2xl border-r border-border/50 shadow-2xl transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-end p-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block sticky top-0 h-screen w-[280px] border-r border-border/50 bg-background/60 backdrop-blur-2xl shrink-0">
        <div className="h-full pt-6 overflow-y-auto">
          <SidebarContent />
        </div>
      </nav>
    </>
  );
}
