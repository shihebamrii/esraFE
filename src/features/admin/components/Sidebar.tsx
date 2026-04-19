"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Video,
  ListVideo,
  Image as ImageIcon,
  Package,
  ShoppingCart,
  LogOut,
  Users,
  MessageSquare,
  Zap,
} from "lucide-react";

export function AdminSidebar() {
  const t = useTranslations("AdminDashboard.sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const sidebarNavItems = [
    {
      title: t("dashboard"),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-indigo-600",
      color: "text-blue-400",
    },
    {
      title: t("users"),
      href: "/admin/users",
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      color: "text-violet-400",
    },
    {
      title: t("packs"),
      href: "/admin/packs",
      icon: Package,
      gradient: "from-emerald-500 to-teal-600",
      color: "text-emerald-400",
    },
    {
      title: t("playlists"),
      href: "/admin/playlists",
      icon: ListVideo,
      gradient: "from-amber-500 to-orange-600",
      color: "text-amber-400",
    },
    {
      title: t("contentImpact"),
      href: "/admin/content",
      icon: Video,
      gradient: "from-cyan-500 to-blue-600",
      color: "text-cyan-400",
    },
    {
      title: t("photosTounesna"),
      href: "/admin/photos",
      icon: ImageIcon,
      gradient: "from-fuchsia-500 to-pink-600",
      color: "text-fuchsia-400",
    },
    {
      title: t("orders"),
      href: "/admin/orders",
      icon: ShoppingCart,
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-400",
    },
    {
      title: t("inquiries"),
      href: "/admin/inquiries",
      icon: MessageSquare,
      gradient: "from-indigo-500 to-blue-600",
      color: "text-indigo-400",
    },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <nav className="hidden lg:flex flex-col h-screen w-64 xl:w-72 bg-background border-r border-border/50 shrink-0">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border/50">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">BeeStory</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Admin</p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t("overview")}
        </p>
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-md`
                      : "bg-muted/60 group-hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      isActive ? "text-white" : item.color
                    )}
                  />
                </span>
                <span className="truncate">{item.title}</span>
                {isActive && (
                  <span className="ms-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-destructive/10 transition-colors">
            <LogOut className="h-3.5 w-3.5 group-hover:text-destructive transition-colors" />
          </span>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
