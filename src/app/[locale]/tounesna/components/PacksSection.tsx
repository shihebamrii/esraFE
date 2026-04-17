"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Eye, Image as ImageIcon, Film } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

interface Pack {
  _id: string;
  id?: string;
  type: "collection" | "membership";
  title: string;
  priceTND: number;
  photoIds?: any[];
  contentIds?: any[];
  membershipFeatures?: {
    photosLimit?: number;
    reelsLimit?: number;
    videosLimit?: number;
    documentariesLimit?: number;
    podcastsLimit?: number;
    successStoryLimit?: number;
    quality: string;
    module: "tounesna" | "impact" | "both";
  };
  popular?: boolean;
}

interface PacksSectionProps {
  type?: "tounesna" | "impact";
}

export function PacksSection({ type = "tounesna" }: PacksSectionProps) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const isImpact = type === "impact";
  const { addItem } = useCartStore();
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchPacksAndSubscription = async () => {
      try {
        setLoading(true);

        // Fetch public packs
        const response = await api.get("/packs");
        if (response.data?.status === "success") {
          const allPacks = response.data.data.packs;
          // Filter by membership OR collection type, the correct module, and hide free "Welcome" packs
          const filtered = allPacks.filter((p: any) => 
            (p.type === "membership" || p.type === "collection") && 
            p.priceTND > 0 &&
            (p.membershipFeatures?.module === type || p.membershipFeatures?.module === "both" || p.type === "collection")
          );
          
          // Sort them to match Silver, Gold, Premium order
          const order = ["Silver", "Gold", "Premium"];
          filtered.sort((a: any, b: any) => {
             const indexA = order.findIndex(o => a.title.includes(o));
             const indexB = order.findIndex(o => b.title.includes(o));
             return indexA - indexB;
          });

          // Set "Gold" as popular by default if it exists
          filtered.forEach((p: any) => {
            if (p.title.includes("Gold")) p.popular = true;
          });

          setPacks(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch packs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacksAndSubscription();
  }, [type]);

  const handleBuy = (pack: Pack) => {
    addItem({
      id: pack._id,
      type: "pack",
      title: pack.title,
      price: pack.priceTND,
      licenseType: "standard",
    } as any);
    toast.success(`${pack.title} added to cart!`);
    router.push("/cart");
  };

  const getArabicTitle = (title: string) => {
    if (title.includes("Silver")) return "الباقة الفضية";
    if (title.includes("Gold")) return "الباقة الذهبية";
    if (title.includes("Premium")) return "الباقة الممتازة";
    return "باقة متميزة";
  };

  const getFeatures = (pack: Pack) => {
    if (pack.type === "collection") {
      return [
        "Full static collection access",
        "High-resolution files",
        "Single ZIP download",
        "Permanent license",
        "Thematic selection"
      ];
    }
    
    const f = pack.membershipFeatures;
    if (!f) return [];
    
    const features = [];
    if (f.module === "tounesna") {
      if (f.photosLimit) features.push(`${f.photosLimit} photos professionnelles`);
      if (f.reelsLimit) features.push(`${f.reelsLimit} reels`);
      if (f.videosLimit) features.push(`${f.videosLimit} vidéos professionnelles`);
      if (f.documentariesLimit) features.push(`${f.documentariesLimit} mini-reportages`);
      features.push(`Accès téléchargement ${f.quality.toUpperCase()}`);
    } else {
      if (f.reelsLimit) features.push(`${f.reelsLimit} vidéos courtes (reels)`);
      if (f.videosLimit) features.push(`${f.videosLimit} vidéos storytelling`);
      if (f.podcastsLimit) features.push(`${f.podcastsLimit} podcasts`);
      if (f.documentariesLimit) features.push(`${f.documentariesLimit} mini-documentaires`);
      if (f.successStoryLimit) features.push(`${f.successStoryLimit} success story complète`);
      
      if (pack.title.includes("Premium")) {
        features.push("Stratégie de contenu");
      }
      features.push(`Qualité ${f.quality.toUpperCase()}`);
    }
    return features;
  };

  if (loading) return null;
  if (packs.length === 0) return null;
  
  return (
    <section className={`relative py-24 px-6 overflow-hidden mt-12 ${isImpact ? 'bg-[#fff9e6]' : ''}`}>
      {/* Background Decorative Elements */}
      <div 
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isImpact ? 'via-[#1f3a5f]/20' : 'via-[#6a0d2e]/20'} to-transparent`} 
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-serif ${isImpact ? 'text-[#1f3a5f]' : 'text-[#6a0d2e]'} mb-6 drop-shadow-sm`}>
            Unlock the Full Vision
          </h2>
          <p className={`${isImpact ? 'text-[#1f3a5f]/60' : 'text-[#6a0d2e]/60'} text-lg max-w-2xl mx-auto font-light`}>
            Choose a curated pack that fits your needs. Each bundle is designed to give you the highest quality access to Tunisia's digital heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packs.map((pack, index) => {
            const isMiddle = index === 1;
            const cardBg = isMiddle 
              ? (isImpact ? 'bg-[#1f3a5f]' : 'bg-[#6a0d2e]') 
              : (isImpact ? 'bg-[#1f3a5f]/5' : 'bg-[#6a0d2e]/5');
            const cardText = isMiddle 
              ? 'text-white' 
              : (isImpact ? 'text-[#1f3a5f]' : 'text-[#6a0d2e]');
            const cardBorder = isMiddle 
              ? (isImpact ? 'border-[#1f3a5f]' : 'border-[#6a0d2e]')
              : (isImpact ? 'border-[#1f3a5f]/20' : 'border-[#6a0d2e]/20');
            
            return (
              <div 
                key={pack._id} 
                className={`group relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:translate-y-[-8px] border shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] ${cardBg} ${cardText} ${cardBorder}`}
              >
                {/* Card Geometric Pattern Overlay */}
                <div 
                  className={`absolute inset-0 ${isMiddle ? 'opacity-[0.1]' : 'opacity-[0.03]'} pointer-events-none rounded-[2.5rem]`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='${isMiddle ? '%23ffffff' : (isImpact ? '%231f3a5f' : '%236a0d2e')}' stroke-width='0.5'%3E%3Cpath d='M40 0L50 10L40 20L30 10Z'/%3E%3Cpath d='M40 60L50 70L40 80L30 70Z'/%3E%3Cpath d='M0 40L10 30L20 40L10 50Z'/%3E%3Cpath d='M60 40L70 30L80 40L70 50Z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                
                <div className="mb-8">
                  <span className={`text-[10px] tracking-[0.2em] uppercase font-bold ${isMiddle ? 'opacity-80' : 'opacity-60'} block mb-2`}>
                     {getArabicTitle(pack.title)}
                  </span>
                  <h3 className="text-2xl font-serif font-bold mb-4">{pack.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-bold">{pack.priceTND}</span>
                    <span className="text-sm opacity-60 font-bold uppercase tracking-tighter">TND</span>
                  </div>
                </div>
                
                <ul className="flex-1 space-y-5 mb-10">
                   {getFeatures(pack).map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm leading-tight">
                         <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                           isMiddle 
                           ? 'bg-white/20 text-white' 
                           : (isImpact ? 'bg-[#1f3a5f]/10 text-[#1f3a5f]' : 'bg-[#6a0d2e]/10 text-[#6a0d2e]')
                         }`}>
                           <Check className="h-3 w-3 " strokeWidth={3} />
                         </div>
                         <span className={isMiddle ? 'opacity-100' : 'opacity-90'}>{feature}</span>
                      </li>
                   ))}
                </ul>

                <Button 
                  onClick={() => handleBuy(pack)}
                  size="lg" 
                  className={`w-full h-14 rounded-2xl font-bold transition-all duration-300 ${
                    isMiddle
                    ? 'bg-[#ffcc1a] text-[#1f3a5f] hover:bg-transparent hover:text-[#ffcc1a] border border-[#ffcc1a]'
                    : (isImpact 
                      ? 'bg-[#1f3a5f] text-[#fff9e6] hover:bg-transparent hover:text-[#1f3a5f] border hover:border-[#1f3a5f]' 
                      : 'bg-[#6a0d2e] text-[#fff9e6] hover:bg-transparent hover:text-[#6a0d2e] border hover:border-[#6a0d2e]')
                  }`}
                  style={isMiddle && !isImpact ? { color: '#6a0d2e' } : {}}
                >
                   <Sparkles className="mr-2 h-4 w-4 fill-current opacity-70" />
                   Secure This Collection
                </Button>
                
                {pack.type === "collection" && (
                  <Dialog open={isPreviewOpen && selectedPack?._id === pack._id} onOpenChange={(open) => {
                    setIsPreviewOpen(open);
                    if (open) setSelectedPack(pack);
                    else setSelectedPack(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`w-full mt-3 h-10 rounded-xl font-medium transition-colors ${
                          isMiddle ? 'text-white/80 hover:text-white hover:bg-white/10' : (isImpact ? 'text-[#1f3a5f]/80 hover:text-[#1f3a5f] hover:bg-[#1f3a5f]/5' : 'text-[#6a0d2e]/80 hover:text-[#6a0d2e] hover:bg-[#6a0d2e]/5')
                        }`}
                      >
                         <Eye className="mr-2 h-4 w-4" />
                         Preview Contents
                      </Button>
                    </DialogTrigger>
                    {selectedPack?._id === pack._id && (
                      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle className={`text-2xl font-serif ${isImpact ? 'text-[#1f3a5f]' : 'text-[#6a0d2e]'}`}>
                            {pack.title} Contents
                          </DialogTitle>
                          <DialogDescription>
                            Preview the high-resolution media included in this collection.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-y-auto pr-2 mt-4">
                          {((pack.photoIds?.length || 0) === 0 && (pack.contentIds?.length || 0) === 0) ? (
                            <div className="text-center py-20 text-muted-foreground">
                              This collection seems to be empty.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                              {pack.photoIds?.map((photo: any) => (
                                <div key={photo._id} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                  {(photo.previewUrl || photo.thumbnailUrl) ? (
                                    <img src={resolveMediaUrl(photo.previewUrl || photo.thumbnailUrl)} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 left-2">
                                    <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-none shadow-sm text-[10px] px-2 py-0">Photo</Badge>
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {pack.contentIds?.map((content: any) => (
                                <div key={content._id} className="group relative aspect-[9/16] sm:aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                                  {content.thumbnailUrl ? (
                                    <img src={resolveMediaUrl(content.thumbnailUrl)} alt={content.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                      <Film className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 left-2">
                                    <Badge className="bg-fuchsia-600/90 hover:bg-fuchsia-600 text-white border-none shadow-sm text-[10px] px-2 py-0">Video</Badge>
                                  </div>
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <p className="text-white text-xs font-medium truncate">{content.title}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* Side Decorative Mashrabiya accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffcc1a]/10 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#6a0d2e]/5 rounded-full blur-3xl pointer-events-none opacity-50" />
    </section>
  );
}
