"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Search,
  Menu,
  User as UserIcon,
  LogOut,
  ShoppingCart,
  X,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const t = useTranslations("Navigation");
  const { user, logout, isAuthenticated, _hasHydrated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/impact", label: t("impact") },
    { href: "/tounesna", label: t("tounesna") },
    { href: "/packs", label: t("packs") },
  ];

  // Check if we're inside a dashboard layout (user/admin/uploader)
  const isDashboard =
    pathname?.includes("/user/") ||
    pathname?.includes("/admin/") ||
    pathname?.includes("/uploader/");

  const textColorClass = "text-foreground";

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin/dashboard";
      case "uploader": return "/uploader/dashboard";
      case "user": return "/user/dashboard";
      default: return "/";
    }
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    switch (user.role) {
      case "admin": return t("adminDashboard");
      case "uploader": return "Uploader Dashboard";
      case "user": return "My Dashboard";
      default: return "Dashboard";
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-500 ease-out font-sans",
        isScrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-2"
          : "bg-background/95 backdrop-blur-xl border-b border-border/30 py-3"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-6 h-14">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-bold text-xl sm:text-2xl tracking-tight transition-all duration-300 hover:opacity-80",
            textColorClass
          )}
        >
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Cn
          </span>
          <span>Bees</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname?.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                  textColorClass,
                  isActive
                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    : "hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex relative w-64">
          <div className="relative w-full group">
            <Search
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300",
                isScrolled || isDashboard
                  ? "text-muted-foreground group-focus-within:text-violet-500"
                  : "text-white/60 group-focus-within:text-white"
              )}
            />
            <input
              type="text"
              placeholder={t("search")}
              className={cn(
                "w-full rounded-xl py-2 pl-10 pr-4 text-sm transition-all duration-300 outline-none",
                isScrolled || isDashboard
                  ? "bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/10 focus:shadow-lg focus:shadow-violet-500/5"
                  : "bg-white/10 border border-white/15 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-white/40 backdrop-blur-sm"
              )}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher */}
          <div className={cn("flex items-center", textColorClass)}>
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle (hidden) */}
          <div className="hidden">
            <ThemeToggle />
          </div>

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-9 w-9 rounded-xl hover:bg-accent/60 transition-all duration-300",
                textColorClass
              )}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 animate-scale-in">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {_hasHydrated && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-xl p-0 ml-1 ring-2 ring-transparent hover:ring-violet-500/20 transition-all duration-300"
                >
                  <Avatar className="h-9 w-9 rounded-xl">
                    <AvatarImage src={"/avatars/01.png"} alt={user.name} />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 mt-2 rounded-xl border-border/50 shadow-xl shadow-black/10 p-1.5"
                align="end"
                forceMount
              >
                {/* User Info Header */}
                <div className="px-3 py-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/20">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="mx-2" />

                {/* Dashboard Link */}
                <DropdownMenuItem
                  asChild
                  className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 focus:bg-violet-500/10"
                >
                  <Link href={getDashboardLink()}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">{getDashboardLabel()}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </Link>
                </DropdownMenuItem>

                {/* Profile Link */}
                <DropdownMenuItem
                  asChild
                  className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 focus:bg-violet-500/10"
                >
                  <Link href="/profile">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400">
                      <UserIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">{t("profile")}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </Link>
                </DropdownMenuItem>

                {/* Orders Link */}
                <DropdownMenuItem
                  asChild
                  className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 focus:bg-violet-500/10"
                >
                  <Link href="/orders">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400">
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1">{t("orders")}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="mx-2" />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="rounded-lg px-3 py-2.5 cursor-pointer gap-3 text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <LogOut className="h-3.5 w-3.5" />
                  </span>
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : _hasHydrated ? (
            <Link href="/login" className="ml-1.5">
              <Button
                size="sm"
                className={cn(
                  "hidden md:flex rounded-xl px-5 font-medium transition-all duration-300 shadow-lg hover:-translate-y-0.5",
                  isScrolled || isDashboard
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-violet-500/20"
                    : "bg-white text-primary hover:bg-white/90 shadow-white/20"
                )}
              >
                {t("login")}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "md:hidden h-9 w-9 rounded-xl",
                  textColorClass
                )}
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          ) : null}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden h-9 w-9 rounded-xl hover:bg-accent/60 transition-all duration-300",
              textColorClass
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border/50 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const isActive = pathname?.includes(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                      isActive
                        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "text-foreground hover:bg-accent/60"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </Link>
                );
              })}

              {/* Mobile Search */}
              <div className="relative mt-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("search")}
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/30 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300"
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
