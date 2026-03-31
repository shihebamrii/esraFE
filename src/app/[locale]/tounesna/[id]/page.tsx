"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ShoppingCart, Info, MapPin, Loader2, ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { PhotoService } from "@/features/photos/api";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PhotoDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const addItem = useCartStore((state) => state.addItem);

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

  const handleAddToCart = () => {
    if (!photo) return;
    addItem({
      id: photo._id,
      type: "photo",
      title: photo.title,
      price: photo.priceTND,
      thumbnail: photo.previewUrl,
    });
    toast.success("Added to cart");
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

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Back link */}
      <Link href="/tounesna" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 me-1" /> Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Media Preview */}
        <div className="relative rounded-2xl overflow-hidden bg-muted shadow-2xl group flex items-center justify-center min-h-[300px]">
          <img
            src={photo.previewUrl}
            alt={photo.title}
            className="w-full h-auto object-cover max-h-[80vh]"
          />
          {photo.mediaType === 'video' && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-black/40 backdrop-blur-md rounded-full px-6 py-4 text-white text-center shadow-2xl border border-white/20">
                     <span className="block text-3xl mb-1 ml-1 opacity-90">▶</span>
                     <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">Video Asset</span>
                 </div>
             </div>
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
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 me-1" />
              <Link href={`/tounesna?gov=${photo.governorate}`} className="hover:text-primary hover:underline transition-colors">
                {photo.governorate}
              </Link>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Standard License</span>
              <span className="text-2xl font-bold">
                {photo.priceTND === 0 ? "Free" : `${photo.priceTND} TND`}
              </span>
            </div>

            {photo.priceTND > 0 && (
              <Button className="w-full h-12 text-lg" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="me-2 h-5 w-5" />
                Add to Cart
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleDownloadPreview}>
                <Download className="me-2 h-4 w-4" />
                Preview {photo.priceTND === 0 ? "(Free)" : "(Low-Res)"}
              </Button>
              <FavoriteButton
                itemId={photo._id}
                itemType="Photo"
                size="md"
                className="border border-border"
              />
            </div>
          </div>

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
