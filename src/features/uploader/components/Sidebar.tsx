"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  Image as ImageIcon,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/uploader/dashboard",
    icon: LayoutDashboard,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "My Content",
    href: "/uploader/content",
    icon: Video,
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
  },
  {
    title: "My Photos",
    href: "/uploader/photos",
    icon: ImageIcon,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
];

export function UploaderSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="p-4 pt-20 lg:pt-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20 shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-muted-foreground">Uploader</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-3">
          Content Management
        </p>
        <div className="space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/profile"
                ? pathname?.endsWith("/profile")
                : pathname?.includes(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative",
                    isActive
                      ? `bg-gradient-to-r ${item.bgGradient} text-foreground`
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b ${item.gradient}`} />
                  )}

                  {/* Icon container */}
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 shrink-0",
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                        : `bg-gradient-to-br ${item.bgGradient} group-hover:shadow-md`
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="flex-1">{item.title}</span>

                  {/* Active dot */}
                  {isActive && (
                    <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${item.gradient} animate-pulse`} />
                  )}

                  {/* Hover arrow */}
                  {!isActive && (
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
            <LogOut className="h-4 w-4" />
          </span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-[4.5rem] left-4 z-30 h-10 w-10 rounded-xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <nav
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-background/95 backdrop-blur-2xl border-r border-border/50 shadow-2xl z-50 transition-transform duration-300 ease-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden lg:block h-screen sticky top-0 w-72 border-r border-border/50 bg-background/50 backdrop-blur-xl pt-14 shrink-0">
        <SidebarContent />
      </nav>
    </>
  );
}
