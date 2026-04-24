"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, Info, MapPin, Loader2, ArrowLeft, Heart, Sparkles, User, Briefcase, Check, Package, Zap, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { VideoPlayer } from "@/features/content/components/VideoPlayer";
import { PhotoService } from "@/features/photos/api";
import { UserService } from "@/features/user/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { resolveMediaUrl } from "@/lib/media";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

interface UserPackData {
  _id: string;
  packId: {
    _id: string;
    title: string;
    membershipFeatures: {
      photosLimit: number;
      reelsLimit: number;
      videosLimit: number;
      documentariesLimit: number;
      module: "tounesna" | "impact" | "both";
    };
  };
  module: "tounesna" | "impact";
  quotas: {
    photosRemaining: number;
    reelsRemaining: number;
    videosRemaining: number;
    documentariesRemaining: number;
  };
  quality: string;
  isActive: boolean;
}

export default function PhotoDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial'>('personal');
  const [activePack, setActivePack] = useState<UserPackData | null>(null);
  const [packLoading, setPackLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{ downloadUrl: string } | null>(null);
  const [isOwned, setIsOwned] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations("PhotoDetail");

  useEffect(() => {
    if (!id) return;
    const fetchPhoto = async () => {
      setLoading(true);
      try {
        const data = await PhotoService.getPhoto(id);
        setPhoto(data.data.photo);
      } catch (err: any) {
        console.error("Failed to fetch photo:", err);
        setError("Photo not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPhoto();
  }, [id]);

  // Fetch user's active packs if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setActivePack(null);
      return;
    }
    const fetchPacks = async () => {
      setPackLoading(true);
      try {
        const response = await UserService.getUserPacks();
        const packs: UserPackData[] = response.data?.packs || [];
        // Find an active Tounesna pack with remaining photo quota
        const tounesnaPack = packs.find(
          (p) =>
            p.isActive &&
            (p.module === "tounesna") &&
            p.quotas.photosRemaining > 0
        );
        setActivePack(tounesnaPack || null);
      } catch (err) {
        console.error("Failed to fetch user packs:", err);
        setActivePack(null);
      } finally {
        setPackLoading(false);
      }
    };
    fetchPacks();
  }, [isAuthenticated]);

  // Check if item is already owned
  useEffect(() => {
    if (!isAuthenticated || !photo) {
      setIsOwned(false);
      return;
    }
    const checkOwnership = async () => {
      try {
        const downloads = await UserService.getMyDownloads();
        const owned = downloads.some((d: any) => d.itemId === photo._id);
        setIsOwned(owned);
      } catch (err) {
        console.error("Failed to check user downloads:", err);
      }
    };
    checkOwnership();
  }, [isAuthenticated, photo]);

  // Derive prices from photo data
  const personalPrice = photo?.pricePersonalTND ?? photo?.priceTND ?? 0;
  const commercialPrice = photo?.priceCommercialTND ?? 0;
  const hasCommercialLicense = commercialPrice > 0;
  const currentPrice = selectedLicense === 'commercial' ? commercialPrice : personalPrice;
  const isFree = personalPrice === 0 && commercialPrice === 0;

  const handleAddToCart = () => {
    if (!photo) return;
    addItem({
      id: photo._id,
      type: "photo",
      title: photo.title,
      price: currentPrice,
      thumbnail: photo.previewUrl,
      licenseType: selectedLicense,
    });
    toast.success(`Added to cart (${selectedLicense === 'personal' ? 'Personal' : 'Commercial'} License)`);
  };

  const handleRedeemWithPack = async () => {
    if (!photo || !activePack) return;
    setRedeemLoading(true);
    try {
      const response = await PhotoService.redeemWithPack(photo._id, 'photo');
      setRedeemResult({
        downloadUrl: response.data?.downloadUrl || '',
      });
      // Update the remaining quota locally
      setActivePack((prev) =>
        prev
          ? {
              ...prev,
              quotas: {
                ...prev.quotas,
                photosRemaining: prev.quotas.photosRemaining - 1,
              },
            }
          : null
      );
      toast.success(t("redeemSuccess", { defaultMessage: "Downloaded successfully! Check your downloads." }));
    } catch (err: any) {
      const message = err?.response?.data?.message || t("redeemFailed", { defaultMessage: "Failed to redeem. Please try again." });
      toast.error(message);
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleDownloadPreview = () => {
    if (!photo?.previewUrl) return;
    window.open(photo.previewUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Photo Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "The photo you're looking for doesn't exist."}</p>
        <Link href="/tounesna">
          <Button>
            <ArrowLeft className="me-2 h-4 w-4" /> Back to Gallery
          </Button>
        </Link>
      </div>
    );
  }

  const photosLimit = activePack?.packId?.membershipFeatures?.photosLimit || 0;
  const photosRemaining = activePack?.quotas?.photosRemaining || 0;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Back link */}
      <Link href="/tounesna" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 me-1" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Media Preview */}
        <div className="relative rounded-2xl overflow-hidden bg-muted shadow-2xl group flex items-center justify-center min-h-[300px]">
          {photo.mediaType === 'video' ? (
             <VideoPlayer 
                src={resolveMediaUrl(photo.highResUrl) || resolveMediaUrl(photo.previewUrl) || resolveMediaUrl(`/api/media/${photo.highResFileId}`)} 
                poster={resolveMediaUrl(photo.previewUrl)} 
                maxPercentage={100} 
             />
          ) : (
            <img
              src={photo.previewUrl}
              alt={photo.title}
              className="w-full h-auto object-cover max-h-[80vh]"
            />
          )}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
        </div>

        {/* Details */}
        <div className="space-y-8 sticky top-24">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {photo.mediaType === 'video' && (
                 <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 uppercase tracking-wider text-[10px]">Video</Badge>
              )}
              <h1 className="text-3xl font-bold">{photo.title}</h1>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 me-1" />
                <Link href={`/tounesna?gov=${photo.governorate}`} className="hover:text-primary hover:underline transition-colors">
                  {photo.governorate}
                </Link>
              </div>
              
              {photo.createdBy?._id && photo.createdBy?.name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 me-1" />
                  <Link href={`/u/${photo.createdBy._id}`} className="hover:text-primary hover:underline transition-colors font-medium">
                    {photo.createdBy.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ═══ PACK REDEMPTION SECTION ═══ */}
          {isAuthenticated && !isFree && activePack && !redeemResult && !isOwned && (
            <div className="relative p-7 rounded-2xl border border-[#ffcc1a]/20 bg-gradient-to-br from-slate-900 via-[#1f3a5f] to-slate-900 text-white shadow-2xl shadow-[#1f3a5f]/20 space-y-5 overflow-hidden">
              {/* Decorative gradient blob */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#ffcc1a]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffcc1a] to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Package className="h-5 w-5 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#ffcc1a] text-lg tracking-tight">
                      {t("packMember", { defaultMessage: "Pack Member" })}
                    </h3>
                    <p className="text-sm text-slate-300 font-medium">
                      {activePack.packId.title}
                    </p>
                  </div>
                </div>
                <Badge className="bg-[#ffcc1a]/10 text-[#ffcc1a] border-[#ffcc1a]/20 font-bold text-xs px-3 py-1">
                  {t("includedInPack", { defaultMessage: "Included in Pack" })}
                </Badge>
              </div>

              {/* Quota progress */}
              <div className="space-y-2.5 relative bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-200 font-medium tracking-wide">
                    {t("quotaRemaining", { remaining: photosRemaining, limit: photosLimit, defaultMessage: `${photosRemaining} / ${photosLimit} downloads left` })}
                  </span>
                </div>
                <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#ffcc1a] via-yellow-400 to-amber-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${photosLimit > 0 ? (photosRemaining / photosLimit) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Redeem Button */}
              <Button
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#ffcc1a] to-amber-500 hover:from-[#f0c015] hover:to-amber-600 text-slate-900 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-0.5 border-none"
                size="lg"
                onClick={handleRedeemWithPack}
                disabled={redeemLoading}
              >
                {redeemLoading ? (
                  <Loader2 className="me-2 h-6 w-6 animate-spin text-slate-800" />
                ) : (
                  <Zap className="me-2 h-6 w-6 text-slate-800" />
                )}
                {redeemLoading
                  ? t("redeeming", { defaultMessage: "Downloading..." })
                  : t("downloadWithPack", { defaultMessage: "Download with Pack — Free" })
                }
              </Button>

              <p className="text-xs text-center text-slate-400 font-medium">
                {t("packRedeemInfo", { defaultMessage: "This will use 1 download from your pack quota" })}
              </p>
            </div>
          )}

          {/* ═══ ALREADY OWNED SECTION ═══ */}
          {isOwned && !redeemResult && (
            <div className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
                    {t("alreadyOwned", { defaultMessage: "Already Owned" })}
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t("alreadyOwnedDesc", { defaultMessage: "You have already purchased or redeemed this item." })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/user/downloads" className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="me-2 h-4 w-4" />
                    {t("goToDownloads", { defaultMessage: "My Downloads" })}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ═══ REDEEM SUCCESS ═══ */}
          {redeemResult && (
            <div className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300">
                    {t("redeemSuccessTitle", { defaultMessage: "Download Ready!" })}
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t("redeemSuccessDesc", { defaultMessage: "Your file is ready for download." })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {redeemResult.downloadUrl && (
                  <a href={redeemResult.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Download className="me-2 h-4 w-4" />
                      {t("downloadNow", { defaultMessage: "Download Now" })}
                    </Button>
                  </a>
                )}
                <Link href="/user/downloads" className="flex-1">
                  <Button variant="outline" className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                    <ExternalLink className="me-2 h-4 w-4" />
                    {t("goToDownloads", { defaultMessage: "My Downloads" })}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ═══ LICENSE CHOOSER (CART FLOW) ═══ */}
          {!redeemResult && !activePack && !isOwned && (
            <div className="p-6 bg-card border rounded-xl shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Choose License</h3>
                {isFree && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Free</Badge>}
              </div>

              {!isFree && (
                <div className={`grid gap-3 ${hasCommercialLicense ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Personal License Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedLicense('personal')}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedLicense === 'personal'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md shadow-blue-500/10'
                        : 'border-border hover:border-blue-300 hover:bg-muted/30'
                    }`}
                  >
                    {selectedLicense === 'personal' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-sm">Personal</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      For personal projects, blogs, and non-commercial use
                    </p>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {personalPrice === 0 ? "Free" : `${personalPrice} TND`}
                    </div>
                  </button>

                  {/* Commercial License Card */}
                  {hasCommercialLicense && (
                    <button
                      type="button"
                      onClick={() => setSelectedLicense('commercial')}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedLicense === 'commercial'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                          : 'border-border hover:border-emerald-300 hover:bg-muted/30'
                      }`}
                    >
                      {selectedLicense === 'commercial' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-semibold text-sm">Commercial</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        For business, advertising, and commercial projects
                      </p>
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {commercialPrice} TND
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Selected price summary */}
              {!isFree && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-muted-foreground text-sm">
                    {selectedLicense === 'personal' ? 'Personal' : 'Commercial'} License
                  </span>
                  <span className="text-2xl font-bold">
                    {currentPrice === 0 ? "Free" : `${currentPrice} TND`}
                  </span>
                </div>
              )}

              {currentPrice > 0 && (
                <Button className="w-full h-12 text-lg" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="me-2 h-5 w-5" />
                  Add to Cart — {currentPrice} TND
                </Button>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleDownloadPreview}>
                  <Download className="me-2 h-4 w-4" />
                  Preview {isFree ? "(Free)" : "(Low-Res)"}
                </Button>
                <FavoriteButton
                  itemId={photo._id}
                  itemType="Photo"
                  size="md"
                  className="border border-border"
                />
              </div>
            </div>
          )}

          {photo.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{photo.description}</p>
            </div>
          )}

          <div className="border-t pt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Governorate</span>
              <Link href={`/tounesna?gov=${photo.governorate}`} className="font-medium hover:text-primary hover:underline transition-colors block">
                {photo.governorate}
              </Link>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Landscape</span>
              <span className="font-medium capitalize">{photo.landscapeType}</span>
            </div>
            {photo.fileInfo?.highRes && (
              <>
                <div>
                  <span className="text-muted-foreground block mb-1">Resolution</span>
                  <span className="font-medium">
                    {photo.fileInfo.highRes.width}x{photo.fileInfo.highRes.height}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Size</span>
                  <span className="font-medium">
                    {(photo.fileInfo.highRes.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              </>
            )}
          </div>

          {photo.tags?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI-Generated Tags</span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag: string) => (
                  <Link key={tag} href={`/tounesna?search=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {photo.attributionText && (
            <div className="bg-muted p-4 rounded-lg flex gap-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0" />
              <p>
                <strong>Attribution:</strong> {photo.attributionText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
