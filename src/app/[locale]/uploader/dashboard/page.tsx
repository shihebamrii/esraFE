"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { UploaderService, DashboardStats, RecentActivityItem } from "@/features/uploader/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  TrendingUp, 
  Music, 
  Download, 
  DollarSign, 
  Play,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function UploaderDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, recentData] = await Promise.all([
          UploaderService.getStats(),
          UploaderService.getRecentActivity()
        ]);
        setStats(statsData);
        setRecent(recentData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 p-4">
      {/* Header Section with Glass Effect */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg shadow-xl">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your content.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/uploader/content">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/20 text-white border-0">
              <Upload className="me-2 h-4 w-4" /> New Content
            </Button>
          </Link>
          <Link href="/uploader/photos">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 text-white border-0">
              <ImageIcon className="me-2 h-4 w-4" /> New Photo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Views Card */}
        <motion.div variants={item}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md border-t border-white/10 shadow-xl relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-24 h-24 text-indigo-500" />
                </div>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-muted-foreground">Total Views</p>
                    </div>
                    {loading ? (
                        <Skeleton className="h-10 w-24" />
                    ) : (
                        <div>
                            <div className="text-4xl font-bold tracking-tight text-foreground">
                                {stats?.totalViews.toLocaleString()}
                            </div>
                            <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-semibold">
                                <ArrowUpRight className="h-3 w-3" /> +12% this week
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>

        {/* Content Stats Card */}
        <motion.div variants={item}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-md border-t border-white/10 shadow-xl relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Video className="w-24 h-24 text-amber-500" />
                </div>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                         <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 text-white">
                            <Video className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-muted-foreground">Media Content</p>
                    </div>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ) : (
                        <div>
                            <div className="text-4xl font-bold tracking-tight text-foreground">
                                {stats?.content.total}
                            </div>
                            <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1"><Video className="h-3 w-3" /> {stats?.content.videoCount} Videos</span>
                                <span className="flex items-center gap-1"><Music className="h-3 w-3" /> {stats?.content.audioCount} Audio</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>

        {/* Photos Card */}
        <motion.div variants={item}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-md border-t border-white/10 shadow-xl relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ImageIcon className="w-24 h-24 text-emerald-500" />
                </div>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 text-white">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-muted-foreground">Photos</p>
                    </div>
                    {loading ? (
                        <div className="space-y-2">
                             <Skeleton className="h-8 w-20" />
                             <Skeleton className="h-4 w-32" />
                        </div>
                    ) : (
                        <div>
                            <div className="text-4xl font-bold tracking-tight text-foreground">
                                {stats?.photos.total}
                            </div>
                             <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {stats?.photos.downloads} Downloads</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>

        {/* Earnings Card */}
        <motion.div variants={item}>
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-md border-t border-white/10 shadow-xl relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-24 h-24 text-rose-500" />
                </div>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 text-white">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <p className="font-medium text-muted-foreground">Earnings</p>
                    </div>
                    {loading ? (
                         <div className="space-y-2">
                             <Skeleton className="h-8 w-20" />
                             <Skeleton className="h-4 w-32" />
                        </div>
                    ) : (
                        <div>
                            <div className="text-4xl font-bold tracking-tight text-foreground">
                                {stats?.photos.earnings.toFixed(2)} <span className="text-xl align-top opacity-70">TND</span>
                            </div>
                             <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1">{stats?.photos.sales} Sales this month</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Uploads</h3>
                <Link href="/uploader/content" className="text-xs font-medium text-primary hover:underline">View All</Link>
             </div>
             
             <div className="space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))
                ) : recent.length > 0 ? (
                    recent.map((item, i) => (
                        <div key={i} className="group flex items-center justify-between p-4 bg-card/50 hover:bg-card border border-border/50 hover:border-border rounded-xl transition-all duration-300 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                                    item.category === 'photo' 
                                        ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' 
                                        : 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10'
                                }`}>
                                    {item.category === 'photo' ? <ImageIcon className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5">{item.type}</Badge>
                                        <span>• {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-foreground">{item.metric.toLocaleString()}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.metricLabel}</p>
                                </div>
                                <Badge className={`capitalize ${
                                    item.status === 'published' ? 'bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20' : 'bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20'
                                }`}>
                                    {item.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed rounded-xl bg-muted/20">
                        <p className="text-muted-foreground">No recent activity found.</p>
                        <Button variant="link" className="mt-2 text-primary">Upload your first content</Button>
                    </div>
                )}
             </div>
        </div>
        
        {/* Quick Tips or Announcements Panel - Adds to the 'Premium' Dashboard feel */}
        <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6">Pro Tips</h3>
            <Card className="bg-gradient-to-b from-primary/5 to-transparent border-primary/10 overflow-hidden">
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary">1</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Optimize for Search</h4>
                                <p className="text-xs text-muted-foreground mt-1">Add at least 5 relevant tags to your photos to increase discoverability by 40%.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary">2</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">High Quality Thumbnails</h4>
                                <p className="text-xs text-muted-foreground mt-1">Custom thumbnails for videos improve click-through rates significantly.</p>
                            </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline" size="sm">Read Creator Guide</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
