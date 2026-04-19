"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Video,
  Image as ImageIcon,
  Download,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  Film,
  Mic,
  Play,
} from "lucide-react";
import { AdminService } from "@/features/admin/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

const TYPE_ICONS: Record<string, any> = {
  video: Video,
  reel: Play,
  podcast: Mic,
  documentary: Film,
  photo: ImageIcon,
};

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading,
  accent,
}: {
  title: string;
  value: any;
  icon: any;
  description: string;
  loading: boolean;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300">
      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-sm`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              {description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border/50 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const t = useTranslations("AdminDashboard.home");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: t("totalRevenue", { defaultValue: "Total Revenue" }),
      value: stats?.totalRevenue || "0 TND",
      icon: DollarSign,
      description: t("paidOrders", { defaultValue: "All paid orders" }),
      accent: "from-violet-500 to-purple-600",
    },
    {
      title: t("activeUsers", { defaultValue: "Active Users" }),
      value: stats?.activeUsers ?? 0,
      icon: Users,
      description: t("totalRegistered", { defaultValue: "Total registered" }),
      accent: "from-cyan-500 to-blue-600",
    },
    {
      title: t("contentCount", { defaultValue: "Content Count" }),
      value: stats?.videoCount ?? 0,
      icon: Video,
      description: t("videoPlatform", { defaultValue: "In video platform" }),
      accent: "from-amber-500 to-orange-600",
    },
    {
      title: t("tounesnaPhotos", { defaultValue: "Tounesna Photos" }),
      value: stats?.photoCount ?? 0,
      icon: ImageIcon,
      description: t("photoGallery", { defaultValue: "In photo gallery" }),
      accent: "from-emerald-500 to-green-600",
    },
    {
      title: t("downloads", { defaultValue: "Downloads" }),
      value: stats?.totalDownloads ?? 0,
      icon: Download,
      description: t("totalDownloads", { defaultValue: "Total content downloads" }),
      accent: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Aperçu complet de la plateforme</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card, i) => (
          <StatCard key={i} loading={loading} {...card} />
        ))}
      </div>

      {/* Charts Row 1: Revenue + Downloads */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue Area Chart */}
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenus Mensuels</CardTitle>
                <CardDescription>6 derniers mois (TND)</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-violet-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-52 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={stats?.revenueChart || []}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenu (TND)"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Downloads Bar Chart */}
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Téléchargements Mensuels</CardTitle>
                <CardDescription>6 derniers mois</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Download className="h-4 w-4 text-cyan-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-52 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={stats?.downloadsChart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="downloads"
                    name="Téléchargements"
                    fill="#06b6d4"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Users + Content Types */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Users Line Chart */}
        <Card className="lg:col-span-2 border border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Nouveaux Utilisateurs</CardTitle>
                <CardDescription>Inscriptions par mois</CardDescription>
              </div>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-52 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={stats?.usersChart || []}>
                  <defs>
                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Nouveaux utilisateurs"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Content Type Pie */}
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Répartition Contenus</CardTitle>
            <CardDescription>Par type de média</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-52 w-full rounded-xl" />
            ) : !stats?.contentTypes?.length ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                Aucune donnée
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={stats.contentTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.contentTypes.map((_: any, index: number) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2">
                  {stats.contentTypes.map((item: any, i: number) => (
                    <span key={i} className="flex items-center gap-1.5 text-[11px] font-medium">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      {item.name} ({item.value})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Recent Orders + Top Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Commandes Récentes</CardTitle>
                <CardDescription>5 dernières commandes payées</CardDescription>
              </div>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : !stats?.recentOrders?.length ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucune commande</p>
            ) : (
              <div className="space-y-2">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(order.customer || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{order.customer}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {order.items} article{order.items > 1 ? "s" : ""} ·{" "}
                          {new Date(order.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-500">{order.total} TND</p>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                        payé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Content */}
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Top Contenus</CardTitle>
                <CardDescription>Les plus téléchargés</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full rounded-lg" />
                ))}
              </div>
            ) : !stats?.topContent?.length && !stats?.topPhotos?.length ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucun contenu</p>
            ) : (
              <div className="space-y-2">
                {[
                  ...(stats?.topContent || []).map((c: any) => ({ ...c, kind: "content" })),
                  ...(stats?.topPhotos || []).map((p: any) => ({ ...p, kind: "photo", type: "photo" })),
                ]
                  .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
                  .slice(0, 6)
                  .map((item: any, i: number) => {
                    const Icon = TYPE_ICONS[item.type] || Video;
                    return (
                      <div
                        key={item._id || i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: COLORS[i % COLORS.length] + "22" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: COLORS[i % COLORS.length] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground capitalize">{item.type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">{item.downloads || 0}</p>
                          <p className="text-[10px] text-muted-foreground">téléch.</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
