"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/features/user/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ImageIcon, 
  Video, 
  Film, 
  FileText, 
  Loader2, 
  Package, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface UserPack {
  _id: string;
  packId: {
    _id: string;
    title: string;
    membershipFeatures: {
      photosLimit: number;
      reelsLimit: number;
      videosLimit: number;
      documentariesLimit: number;
      quality: string;
      module: string;
    };
  };
  quotas: {
    photosRemaining: number;
    reelsRemaining: number;
    videosRemaining: number;
    documentariesRemaining: number;
  };
  module: "tounesna" | "impact";
  quality: string;
  isActive: boolean;
}

export function QuotaTracker() {
  const t = useTranslations("UserDashboard.quota");
  const [packs, setPacks] = useState<UserPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await UserService.getUserPacks();
        if (response.status === "success") {
          setPacks(response.data.packs);
        }
      } catch (error) {
        console.error(t("failedToFetch"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (packs.length === 0) return null;

  const calculateProgress = (remaining: number, limit: number) => {
    if (!limit || limit === 0) return 0;
    const used = limit - remaining;
    return (used / limit) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Package className="h-5 w-5 text-violet-500" />
           <h3 className="text-xl font-bold font-serif text-[#1f3a5f] dark:text-[#fff9e6]">{t("title")}</h3>
        </div>
        <Badge variant="secondary" className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-none">
          {t("activePack", { count: packs.length })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packs.map((pack) => {
          const features = pack.packId.membershipFeatures;
          const isImpact = pack.module === "impact";
          
          return (
            <Card key={pack._id} className="relative overflow-hidden border-none shadow-xl bg-white/60 dark:bg-[#1f3a5f]/40 backdrop-blur-xl group hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
              {/* Background Geometric Pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='currentColor' stroke-width='0.5'%3E%3Cpath d='M30 0L35 5L30 10L25 5Z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isImpact ? 'bg-blue-500/10 text-blue-600' : 'bg-rose-500/10 text-rose-600'}`}>
                      {isImpact ? <Video className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold font-serif">{pack.packId.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-0.5">
                         <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-tighter">
                            {pack.module}
                         </Badge>
                         <div className="flex items-center gap-1 text-[10px] opacity-60">
                            <ShieldCheck className="h-3 w-3" />
                            {pack.quality.toUpperCase()}
                         </div>
                      </div>
                    </div>
                  </div>
                  {pack.packId.title.includes("Premium") && (
                    <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-5 relative z-10">
                {/* Photo Quota */}
                {features.photosLimit > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 opacity-70">
                        <ImageIcon className="h-3.5 w-3.5" /> {t("photos")}
                      </span>
                      <span>{t("left", { remaining: pack.quotas.photosRemaining, limit: features.photosLimit })}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isImpact ? "bg-blue-500" : "bg-rose-500"}`}
                        style={{ width: `${calculateProgress(pack.quotas.photosRemaining, features.photosLimit)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Reels Quota */}
                {features.reelsLimit > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 opacity-70">
                        <Film className="h-3.5 w-3.5" /> {t("reels")}
                      </span>
                      <span>{t("left", { remaining: pack.quotas.reelsRemaining, limit: features.reelsLimit })}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${calculateProgress(pack.quotas.reelsRemaining, features.reelsLimit)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Storytelling Videos Quota */}
                {features.videosLimit > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 opacity-70">
                        <Video className="h-3.5 w-3.5" /> {isImpact ? t("storytelling") : t("videos")}
                      </span>
                      <span>{t("left", { remaining: pack.quotas.videosRemaining, limit: features.videosLimit })}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${calculateProgress(pack.quotas.videosRemaining, features.videosLimit)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Mini-Docs Quota */}
                {features.documentariesLimit > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 opacity-70">
                        <FileText className="h-3.5 w-3.5" /> {t("miniDocs")}
                      </span>
                      <span>{t("left", { remaining: pack.quotas.documentariesRemaining, limit: features.documentariesLimit })}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${calculateProgress(pack.quotas.documentariesRemaining, features.documentariesLimit)}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
