"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AdminOrdersPage() {
  const t = useTranslations("AdminDashboard.orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/checkout/admin/orders");
        setOrders(response.data?.data?.orders || []);
      } catch (error) {
        toast.error(t("messages.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;
    return (
      order._id.toLowerCase().includes(searchTerm) ||
      order.userId?.name?.toLowerCase().includes(searchTerm) ||
      order.userId?.email?.toLowerCase().includes(searchTerm) ||
      order.paymentStatus.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder", { defaultValue: "Search orders..." })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">{t("table.orderId")}</TableHead>
              <TableHead>{t("table.customer")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
              <TableHead>{t("table.total")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-mono text-xs font-semibold">
                    #{order._id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.userId?.name || t("table.unknown")}</span>
                      <span className="text-xs text-muted-foreground">{order.userId?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    {order.total} {order.currency === 'TND' ? 'DT' : order.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full px-3 capitalize ${
                      order.paymentStatus === 'paid' ? 'text-green-600 border-green-200 bg-green-50' :
                      'text-amber-600 border-amber-200 bg-amber-50'
                    }`}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
