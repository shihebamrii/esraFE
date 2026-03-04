"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Download,
  DollarSign,
  Package,
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { UploaderService, UserStats } from "@/features/uploader/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const statCards = [
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: ShoppingBag,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    shadow: "shadow-blue-500/10",
    subtitle: "Successfully placed",
  },
  {
    key: "totalSpent",
    title: "Total Spent",
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/5",
    shadow: "shadow-emerald-500/10",
    subtitle: "Lifetime purchases",
  },
  {
    key: "downloadCount",
    title: "Downloads",
    icon: Download,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/5",
    shadow: "shadow-violet-500/10",
    subtitle: "Photos & videos",
  },
  {
    key: "packsOwned",
    title: "Packs Owned",
    icon: Package,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/5",
    shadow: "shadow-amber-500/10",
    subtitle: "Premium collections",
  },
];

export default function UserDashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await UploaderService.getUserStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getStatValue = (key: string) => {
    if (!stats) return 0;
    switch (key) {
      case "totalOrders": return stats.totalOrders || 0;
      case "totalSpent": return stats.totalSpent || "0.00 TND";
      case "downloadCount": return stats.downloadCount || 0;
      case "packsOwned": return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border border-violet-500/20 p-6 sm:p-8"
        style={{ animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {getGreeting()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
              Here&apos;s an overview of your account activity and recent purchases.
            </p>
          </div>
          <Link href="/tounesna">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 px-5">
              <Sparkles className="me-2 h-4 w-4" />
              Browse Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.key}
              className={`relative overflow-hidden border-0 bg-gradient-to-br ${card.bgGradient} hover:shadow-xl ${card.shadow} transition-all duration-500 hover:-translate-y-1 group`}
              style={{
                animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                animationDelay: `${(index + 1) * 100}ms`,
                opacity: 0,
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                  <div className="text-2xl font-bold tracking-tight">
                    {getStatValue(card.key)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {card.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card
        className="border border-border/50 shadow-sm overflow-hidden"
        style={{
          animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          animationDelay: "500ms",
          opacity: 0,
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/30 px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md">
              <Clock className="h-4 w-4" />
            </span>
            <CardTitle className="text-base">Recent Orders</CardTitle>
          </div>
          <Link href="/user/orders">
            <Button
              variant="ghost"
              size="sm"
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-500/10 gap-1 rounded-lg"
            >
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-border/50">
              {stats.recentOrders.map((order, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-muted/30 transition-colors group/row"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 group-hover/row:from-blue-500/20 group-hover/row:to-cyan-500/20 transition-colors">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-sm">
                        ORD-{order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items} items •{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-semibold text-sm hidden sm:block">
                      {order.total}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                        order.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted/80 flex items-center justify-center mb-3">
                <ShoppingBag className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No orders found
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your recent orders will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions — Bento Grid */}
      <div
        className="grid gap-4 sm:grid-cols-2"
        style={{
          animation: "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          animationDelay: "600ms",
          opacity: 0,
        }}
      >
        <Link href="/user/downloads" className="group">
          <Card className="relative overflow-hidden border border-border/50 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="relative flex items-center gap-4 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all duration-300">
                <Download className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">My Downloads</h3>
                <p className="text-sm text-muted-foreground">
                  Access your purchased content
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/tounesna" className="group">
          <Card className="relative overflow-hidden border border-border/50 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="relative flex items-center gap-4 p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-110 transition-all duration-300">
                <Package className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">Browse Tounesna</h3>
                <p className="text-sm text-muted-foreground">
                  Discover amazing Tunisian photos
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
