"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShoppingBag,
  ChevronDown,
  Package,
  Receipt,
  Sparkles,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserService } from "@/features/user/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function UserOrdersPage() {
  const t = useTranslations("UserDashboard.orders");
  const locale = useLocale();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await UserService.getMyOrders();
        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const filteredOrders = orders.filter(order => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const orderId = order._id?.toLowerCase().includes(q) || false;
    const itemMatch = order.items?.some((item: any) => 
      item.title?.toLowerCase().includes(q) || item.type?.toLowerCase().includes(q)
    ) || false;
    return orderId || itemMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-slide-up"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {orders.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Receipt className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {t("orderCount", { count: orders.length })}
              </span>
            </div>
          )}
          {orders.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder", { defaultValue: "Search orders..." })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))
        ) : filteredOrders.length === 0 && orders.length > 0 ? (
          <Card className="border border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-lg mb-1">{t("noSearchResults", { defaultValue: "No orders match your search" })}</h3>
              <p className="text-sm text-muted-foreground">{t("tryDifferentSearch", { defaultValue: "Try a different search term" })}</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card
            className="border border-border/50"
            style={{
              animation: "scale-in 0.4s ease-out forwards",
            }}
          >
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-blue-500/40" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1.5">{t("noOrders")}</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-5">
                {t("noOrdersSubtitle")}
              </p>
              <Button
                variant="outline"
                className="rounded-xl border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                asChild
              >
                <Link href="/tounesna">{t("browseContent", { defaultValue: "Browse Content" })}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Timeline connector */
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/30 via-violet-500/20 to-transparent hidden sm:block" />

            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const isExpanded = expandedOrder === order._id;
                const isPaid = order.paymentStatus === "paid";

                return (
                  <div
                    key={order._id}
                    className="relative animate-slide-up"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[18px] top-7 hidden sm:flex">
                      <div
                        className={`h-4 w-4 rounded-full border-2 z-10 ${
                          isPaid
                            ? "bg-emerald-500 border-emerald-500/30 shadow-lg shadow-emerald-500/30"
                            : "bg-amber-500 border-amber-500/30 shadow-lg shadow-amber-500/30"
                        }`}
                      />
                    </div>

                    <Card
                      className={`sm:ml-14 overflow-hidden border transition-all duration-300 ${
                        isExpanded
                          ? "border-violet-500/30 shadow-lg shadow-violet-500/5"
                          : "border-border/50 hover:border-violet-500/20 hover:shadow-md"
                      }`}
                    >
                      {/* Order Header — clickable to expand */}
                      <button
                        className="w-full text-left"
                        onClick={() => toggleExpand(order._id)}
                      >
                        <CardHeader className="flex flex-row items-center justify-between p-4 sm:px-6 bg-gradient-to-r from-muted/50 to-transparent">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                              <ShoppingBag className="h-5 w-5" />
                            </span>
                            <div>
                              <CardTitle className="text-sm font-semibold">
                                {t("orderId")}
                                {order._id.substring(0, 8).toUpperCase()}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString(locale === "ar" ? "ar-TN" : locale === "fr" ? "fr-FR" : "en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                                {" · "}
                                {t("itemCount", { count: order.items?.length || 0 })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <span className="font-bold text-sm block">
                                {order.total} {order.currency === "TND" ? (locale === "ar" ? "د.ت" : "DT") : order.currency}
                              </span>
                            </div>
                            <Badge
                              className={`rounded-lg border-0 text-[11px] font-semibold px-2.5 py-0.5 ${
                                isPaid
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"
                              }`}
                            >
                              {order.paymentStatus === "paid" ? t("paid") : t("pending")}
                            </Badge>
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CardHeader>
                      </button>

                      {/* Expandable Items */}
                      <div
                        className={`overflow-hidden transition-all duration-400 ease-out ${
                          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <CardContent className="px-4 sm:px-6 pb-4 pt-0">
                          <div className="border-t border-border/50 pt-4">
                            {/* Mobile total */}
                            <div className="flex items-center justify-between mb-3 sm:hidden">
                              <span className="text-xs text-muted-foreground">
                                Total
                              </span>
                              <span className="font-bold">
                                {order.total} {order.currency}
                              </span>
                            </div>
                            <ul className="space-y-2.5">
                              {order.items.map((item: any, i: number) => (
                                <li
                                  key={i}
                                  className="flex justify-between items-center p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors group/item"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 shrink-0 group-hover/item:from-violet-500/20 group-hover/item:to-purple-500/20 transition-colors">
                                      <Package className="h-4 w-4" />
                                    </span>
                                    <div>
                                      <p className="font-medium text-sm">
                                        {item.title}
                                      </p>
                                      <p className="text-[11px] text-muted-foreground">
                                        {item.type}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-sm">
                                    {item.price} {order.currency}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
