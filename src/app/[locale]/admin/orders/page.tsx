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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShoppingBag, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AdminOrdersPage() {
  const t = useTranslations("AdminDashboard.orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
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
              <TableHead className="text-right pr-6">{t("table.actions")}</TableHead>
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
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
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
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
