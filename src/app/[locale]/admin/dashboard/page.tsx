"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Video, Image as ImageIcon } from "lucide-react";
import { AdminService, AdminStats } from "@/features/admin/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function AdminDashboardPage() {
  const t = useTranslations("AdminDashboard.home");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: t("totalRevenue"),
      value: stats ? `${stats.totalRevenue || 0} DT` : "0 DT",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: t("paidOrders"),
    },
    {
      title: t("activeUsers"),
      value: stats ? stats.activeUsers : 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: t("totalRegistered"),
    },
    {
      title: t("contentCount"),
      value: stats ? stats.videoCount : 0,
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: t("videoPlatform"),
    },
    {
      title: t("tounesnaPhotos"),
      value: stats ? stats.photoCount : 0,
      icon: ImageIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description: t("photoGallery"),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalRevenue || "0 TND"}</div>
                <p className="text-xs text-muted-foreground">All paid orders</p>
              </>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Total registered</p>
              </>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Count</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.videoCount || 0} Videos</div>
                <p className="text-xs text-muted-foreground">In video platform</p>
              </>
            )}
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tounesna Photos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.photoCount || 0}</div>
                <p className="text-xs text-muted-foreground">In photo gallery</p>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
