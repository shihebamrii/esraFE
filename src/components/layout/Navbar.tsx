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
import { SearchBar } from "@/components/layout/SearchBar";
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
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const t = useTranslations("Navigation");
  const { user, logout, isAuthenticated, _hasHydrated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
  ];

  const isImpact = pathname?.includes("/impact");
  const isTounesna = pathname?.includes("/tounesna");
  const isHeroPage = isImpact || isTounesna;

  const isDashboard =
    pathname?.includes("/user/") ||
    pathname?.includes("/admin/");

  const isAdminPage = pathname?.includes("/admin/");

  const textColorClass = isHeroPage && !isScrolled ? "text-white" : "text-foreground";

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin": return "/admin/dashboard";
      case "user": return "/user/dashboard";
      default: return "/user/dashboard";
    }
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    switch (user.role) {
      case "admin": return t("adminDashboard");
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

  // Resolve profile picture URL
  const profilePictureUrl = user?.profilePictureFileId 
    ? `/api/media/${user.profilePictureFileId}` 
    : undefined;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out font-sans",
        isScrolled || isAdminPage
          ? "bg-background/70 backdrop-blur-3xl border-b border-border/40 py-2 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-b border-transparent py-4"
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffcc1a] origin-left z-50"
        style={{ scaleX }}
      />
      <div className="container mx-auto px-4 flex items-center justify-between gap-6 h-14">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "transition-all duration-500 hover:scale-105 flex items-center",
            textColorClass
          )}
        >
          <Image 
            src="/logo-beestory.png" 
            alt="Bee Story Logo" 
            width={115}
            height={32}
            priority
            loading="eager"
            style={{ width: 'auto', height: 'auto' }}
            className={cn(
              "h-8 transition-all duration-500",
              (isHeroPage && !isScrolled) ? "brightness-0 invert" : "" // Make logo white if on hero and not scrolled
            )} 
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 relative" onMouseLeave={() => setHoveredIndex(null)}>
          {navLinks.map((link, idx) => {
            const isActive = pathname?.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap",
                  textColorClass,
                  isActive
                    ? "text-[#ffcc1a]"
                    : "opacity-80 hover:opacity-100"
                )}
              >
                {/* Hover Highlight Pill */}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="nav-highlight"
                    className={cn(
                      "absolute inset-0 rounded-lg -z-10",
                      (isHeroPage && !isScrolled) ? "bg-white/10" : "bg-violet-500/10"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {link.label}
                
                {isActive && (
                  <motion.span 
                    layoutId="nav-active-line"
                    className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#ffcc1a]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar - Hidden on Admin Pages */}
        {!isAdminPage && (
          <div className="hidden lg:flex relative">
            <SearchBar
              isHeroPage={isHeroPage}
              isScrolled={isScrolled}
              isDashboard={isDashboard}
            />
          </div>
        )}

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
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-[#ffcc1a] text-primary text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#ffcc1a]/30 animate-scale-in">
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
                    <AvatarImage src={profilePictureUrl} alt={user.name} />
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
                    ? "bg-[#ffcc1a] text-primary hover:bg-[#ffcc1a]/90 shadow-[#ffcc1a]/20"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[64px] md:hidden bg-background/98 backdrop-blur-3xl z-40"
          >
            <nav className="container mx-auto px-6 py-12 flex flex-col gap-4 h-full">
              {navLinks.map((link, index) => {
                const isActive = pathname?.includes(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-6 py-5 rounded-2xl text-2xl font-bold transition-all duration-300",
                        isActive
                          ? "bg-[#ffcc1a]/10 text-[#ffcc1a] shadow-sm"
                          : "text-foreground/80 hover:bg-accent/40"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <motion.div
                        animate={{ x: isActive ? 5 : 0 }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                      >
                        <ChevronRight className={cn(
                          "h-6 w-6",
                          isActive ? "text-[#ffcc1a]" : "text-muted-foreground/30"
                        )} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 pt-8 border-t border-border/50"
              >
                <SearchBar isMobile />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto py-12 flex justify-center gap-8"
              >
                <div className="p-4 rounded-full bg-violet-500/5 text-violet-500 hover:bg-violet-500/10 transition-colors">
                  <Sparkles className="h-6 w-6" />
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
