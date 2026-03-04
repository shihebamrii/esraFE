"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Video,
  Image as ImageIcon,
  Package,
  Calendar,
  Search,
  X,
  FileDown,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { UserService, DownloadItem } from "@/features/user/api";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig: Record<
  string,
  { icon: typeof Video; gradient: string; bg: string; label: string }
> = {
  Video: {
    icon: Video,
    gradient: "from-blue-500 to-cyan-500",
    bg: "from-blue-500/10 to-cyan-500/5",
    label: "Videos",
  },
  Pack: {
    icon: Package,
    gradient: "from-purple-500 to-fuchsia-500",
    bg: "from-purple-500/10 to-fuchsia-500/5",
    label: "Packs",
  },
  Photo: {
    icon: ImageIcon,
    gradient: "from-amber-500 to-orange-500",
    bg: "from-amber-500/10 to-orange-500/5",
    label: "Photos",
  },
};

export default function UserDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const data = await UserService.getMyDownloads();
        setDownloads(data || []);
      } catch (error) {
        console.error("Failed to fetch downloads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const filteredDownloads = downloads.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const getBackendUrl = (url?: string) => {
    if (!url) return "#";
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return url.startsWith("/api") ? url.replace("/api", backendUrl) : url;
  };

  const resolveThumbnail = (thumb?: string | null) => {
    if (!thumb) return null;
    const backendBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return thumb.startsWith("/api")
      ? thumb.replace("/api", backendBase)
      : thumb;
  };

  const getType = (type: string) => typeConfig[type] || typeConfig.Photo;

  const typeCounts = {
    Photo: downloads.filter((d) => d.type === "Photo").length,
    Video: downloads.filter((d) => d.type === "Video").length,
    Pack: downloads.filter((d) => d.type === "Pack").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Downloads
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Access and download your purchased content
        </p>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap gap-3 animate-slide-up">
        {Object.entries(typeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = typeCounts[key as keyof typeof typeCounts] || 0;
          return (
            <div
              key={key}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r ${config.bg} border border-border/50`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-sm`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-lg font-bold leading-none">{count}</p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {config.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      {!loading && downloads.length > 0 && (
        <div className="relative max-w-md animate-slide-up">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search downloads..."
            className="pl-10 pr-10 rounded-xl border-border/50 bg-muted/30 focus:bg-background h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Downloads List */}
      <div className="space-y-3">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            ))
        ) : filteredDownloads.length === 0 ? (
          <Card className="border border-border/50 animate-scale-in">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
                  <FileDown className="h-8 w-8 text-violet-500/50" />
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-base mb-1.5">
                {search ? "No matches found" : "No downloads yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {search
                  ? "Try a different search term"
                  : "Your purchased content will appear here for easy access."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDownloads.map((item) => {
            const config = getType(item.type);
            const Icon = config.icon;
            const thumbUrl = resolveThumbnail(item.thumbnail);
            return (
              <Card
                key={item.id}
                className="group overflow-hidden border border-border/50 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 animate-slide-up"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 gap-4">
                    <div className="flex items-center gap-4">
                      {thumbUrl ? (
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 ring-1 ring-border/50 group-hover:ring-violet-500/30 transition-all">
                          <img
                            src={thumbUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div
                          className={`h-14 w-14 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center shrink-0 ring-1 ring-border/50`}
                        >
                          <Icon className="h-6 w-6 text-muted-foreground/70" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gradient-to-r ${config.bg}`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.format}
                          </span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(item.purchaseDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 sm:shrink-0">
                      {!item.downloadToken && (
                        <span className="text-[11px] font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg ring-1 ring-red-500/20">
                          Expired
                        </span>
                      )}
                      <a
                        href={
                          item.downloadToken
                            ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/checkout/orders/${item.orderId}/download/${item.downloadToken}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          !item.downloadToken ? "pointer-events-none" : ""
                        }
                      >
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
                          disabled={!item.downloadToken}
                        >
                          <Download className="me-2 h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
