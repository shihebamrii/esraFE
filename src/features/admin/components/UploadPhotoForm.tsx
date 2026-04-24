"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminService } from "@/features/admin/api";
import { PhotoService } from "@/features/photos/api";
import { toast } from "sonner";
import { Loader2, UploadCloud, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface UploadPhotoFormProps {
  initialData?: any;
  photoId?: string;
  onSuccess?: () => void;
}

export function UploadPhotoForm({ initialData, photoId, onSuccess }: UploadPhotoFormProps) {
  const t = useTranslations("AdminDashboard.upload.form.photo");
  const tDashboard = useTranslations("AdminDashboard");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    governorate: initialData?.governorate || "",
    city: initialData?.city || "",
    landscapeType: initialData?.landscapeType || "sea",
    contentType: initialData?.contentType || "",
    pricePersonalTND: initialData?.pricePersonalTND?.toString() || initialData?.priceTND?.toString() || "0",
    priceCommercialTND: initialData?.priceCommercialTND?.toString() || "0",
    watermark: initialData?.watermark !== undefined ? initialData.watermark.toString() : "true",
    attributionText: initialData?.attributionText || t("attributionDefault"),
    tags: initialData?.tags ? JSON.stringify(initialData.tags) : "[]",
  });

  const [files, setFiles] = useState<{
    highRes: File | null;
    lowRes: File | null;
  }>({
    highRes: null,
    lowRes: null,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'highRes' | 'lowRes') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles({ ...files, [type]: file });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as any).checked ? "true" : "false" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!photoId;
    
    if (!isEditing && !files.highRes) {
      toast.error(t("messages.selectFile", { type: t(mediaType) }));
      return;
    }
    
    if (!isEditing && mediaType === 'video' && !files.lowRes) {
      toast.error(t("messages.selectThumbnail"));
      return;
    }

    try {
      setLoading(true);
      setUploadStep(isEditing ? t("messages.updating") : t("messages.preparing"));
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (files.highRes) {
        data.append("highRes", files.highRes);
      }
      if (files.lowRes) {
        data.append("lowRes", files.lowRes);
      }

      setUploadStep(isEditing ? t("messages.saving") : t("messages.uploading"));
      if (isEditing) {
        await AdminService.updatePhoto(photoId, data);
        toast.success(tDashboard("photos.messages.saveSuccess"));
      } else {
        await AdminService.uploadPhoto(data);
        toast.success(tDashboard("photos.messages.saveSuccess"));
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/photos");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || tDashboard("photos.messages.saveFailed"));
      console.error(error);
    } finally {
      setLoading(false);
      setUploadStep("");
    }
  };

  return (
    <>
      {/* ═══ Full-screen Upload Overlay ═══ */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-card border border-border/50 rounded-3xl p-10 shadow-2xl max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-500">
               {/* Uploading State */}
               <>
                 <div className="relative mx-auto mb-6 h-20 w-20">
                   <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                   <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
                   <div className="absolute inset-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                     <Upload className="h-7 w-7 text-amber-500" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-2">{photoId ? t("overlay.updating") : t("overlay.uploading")}</h3>
                 <p className="text-sm text-muted-foreground mb-4">{t("messages.waitMessage")}</p>
                 <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-medium">
                   <Loader2 className="h-4 w-4 animate-spin" />
                   <span>{uploadStep}</span>
                 </div>
               </>
          </div>
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-6">
      
      {!photoId && (
        <div className="space-y-4">
          <Label className="text-base font-semibold">{t("assetType")}</Label>
          <div className="flex gap-4">
            <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl flex-1 transition-colors ${mediaType === 'photo' ? 'border-amber-500 bg-amber-500/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="mediaType" className="w-4 h-4 text-amber-600 focus:ring-amber-500" checked={mediaType === 'photo'} onChange={() => setMediaType('photo')} />
              <span className="font-medium">{t("photo")}</span>
            </label>
            <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl flex-1 transition-colors ${mediaType === 'video' ? 'border-amber-500 bg-amber-500/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="mediaType" className="w-4 h-4 text-amber-600 focus:ring-amber-500" checked={mediaType === 'video'} onChange={() => setMediaType('video')} />
              <span className="font-medium">{t("video")}</span>
            </label>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-title">{t("title")} *</Label>
          <Input id="photo-title" name="title" required value={formData.title} onChange={handleChange} placeholder={t("title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photo-gov">{t("governorate")} *</Label>
          <select
            id="photo-gov"
            name="governorate"
            required
            value={formData.governorate}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">{t("selectGovernorate")}</option>
            {[
              "ariana", "beja", "benArous", "bizerte", "gabes", "gafsa", 
              "jendouba", "kairouan", "kasserine", "kebili", "kef", "mahdia", 
              "manouba", "medenine", "monastir", "nabeul", "sfax", "sidiBouzid", 
              "siliana", "sousse", "tataouine", "tozeur", "tunis", "zaghouan"
            ].map(govKey => (
              <option key={govKey} value={tDashboard(`governorates.${govKey}`)}>
                {tDashboard(`governorates.${govKey}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-city">{t("city")}</Label>
          <Input id="photo-city" name="city" value={formData.city} onChange={handleChange} placeholder={t("cityPlaceholder")} />
        </div>
        {mediaType === 'video' && (
          <div className="space-y-2">
            <Label htmlFor="photo-content-type">{t("contentType")}</Label>
            <Input
              id="photo-content-type"
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              placeholder={t("contentTypePlaceholder")}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo-desc">{t("description")} *</Label>
        <Textarea id="photo-desc" name="description" required value={formData.description} onChange={handleChange} placeholder={t("description")} rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-type">{t("landscape")} *</Label>
          <select 
            id="photo-type" 
            name="landscapeType" 
            value={formData.landscapeType} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="sea">{t("landscapes.sea")}</option>
            <option value="desert">{t("landscapes.desert")}</option>
            <option value="mountain">{t("landscapes.mountain")}</option>
            <option value="village">{t("landscapes.village")}</option>
            <option value="oasis">{t("landscapes.oasis")}</option>
            <option value="forest">{t("landscapes.forest")}</option>
            <option value="city">{t("landscapes.city")}</option>
            <option value="historical">{t("landscapes.historical")}</option>
            <option value="other">{t("landscapes.other")}</option>
          </select>
      </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-attr">{t("attribution")}</Label>
          <Input id="photo-attr" name="attributionText" value={formData.attributionText} onChange={handleChange} placeholder={t("attributionPlaceholder")} />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <input 
            type="checkbox" 
            id="photo-watermark" 
            name="watermark" 
            checked={formData.watermark === "true"} 
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
          />
          <Label htmlFor="photo-watermark">{t("autoWatermark")}</Label>
        </div>
      </div>

      <div className="space-y-3 p-4 border border-amber-200/50 bg-amber-50/30 rounded-xl dark:bg-amber-900/10 dark:border-amber-800/50">
        <Label className="text-base font-semibold flex items-center gap-2">💰 {t("pricingTitle")}</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="photo-price-personal" className="text-sm flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              {t("personalLicense")}
            </Label>
            <Input id="photo-price-personal" name="pricePersonalTND" type="number" min="0" step="0.1" value={formData.pricePersonalTND} onChange={handleChange} placeholder="0" />
            <p className="text-xs text-muted-foreground">{t("personalDescription")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo-price-commercial" className="text-sm flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              {t("commercialLicense")}
            </Label>
            <Input id="photo-price-commercial" name="priceCommercialTND" type="number" min="0" step="0.1" value={formData.priceCommercialTND} onChange={handleChange} placeholder="0" />
            <p className="text-xs text-muted-foreground">{t("commercialDescription")}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">{t("pricingNote")}</p>
      </div>


    <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{mediaType === 'photo' ? t("highResLabel") : t("videoFileLabel")} {photoId ? t("optionalToChange") : "*"}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept={mediaType === 'photo' ? "image/*" : "video/*"} required={!photoId} onChange={(e) => handleFileChange(e, 'highRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.highRes ? files.highRes.name : photoId ? t("clickToReplace", { type: t(mediaType) }) : t("clickToUpload", { type: t(mediaType) })}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("fullQuality")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{mediaType === 'video' ? t("videoThumbnail") : t("lowResPreview")} {mediaType === 'video' && !photoId ? "*" : ""}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" required={mediaType === 'video' && !photoId} onChange={(e) => handleFileChange(e, 'lowRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.lowRes ? files.lowRes.name : t("clickToUploadPreview")}</p>
            <p className="text-xs text-muted-foreground mt-1">{mediaType === 'video' ? t("requiredForVideo") : t("autoGenerated")}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20"
        >
          {loading ? (
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {photoId ? t("updating") : t("uploading")}</>
          ) : (
            photoId ? t("update") : t("submit")
          )}
        </Button>
      </div>
    </form>
    </>
  );
}
