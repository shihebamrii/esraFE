"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminService } from "@/features/admin/api";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";

export function UploadVideoForm() {
  const t = useTranslations("AdminDashboard.upload.form.video");
  const tDashboard = useTranslations("AdminDashboard");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    themes: "[]",
    region: "",
    city: "",
    tags: "[]",
    language: "ar",
    rights: "free",
    pricePersonal: "0",
    priceCommercial: "0",
    visibility: "public",
    instagramUsername: ""
  });

  const governorates = [
    "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", 
    "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", 
    "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", 
    "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];
  const themesList = [
    { label: t("youth", { defaultValue: "Youth" }), value: "youth" },
    { label: t("womenArtisans", { defaultValue: "Women Artisans" }), value: "womenArtisans" },
    { label: t("environment", { defaultValue: "Environment" }), value: "environment" }
  ];

  const [files, setFiles] = useState<{
    file: File | null;
    thumbnail: File | null;
  }>({
    file: null,
    thumbnail: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.file) {
      toast.error(t("selectFile"));
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "instagramUsername") {
          data.append(key, value);
        }
      });
      if (formData.instagramUsername) {
        data.append("metadata", JSON.stringify({ instagramUsername: formData.instagramUsername }));
      }
      data.append("file", files.file);
      if (files.thumbnail) {
        data.append("thumbnail", files.thumbnail);
      }

      await AdminService.uploadContent(data);
      toast.success(t("success"));
      router.push("/admin/content");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("failed"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="video-title">{t("title")}</Label>
          <Input id="video-title" name="title" required value={formData.title} onChange={handleChange} placeholder={t("title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-region">{t("region")}</Label>
          <select 
            id="video-region" 
            name="region" 
            value={formData.region} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">{t("selectRegion")}</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="video-city">{t("city")}</Label>
          <Input id="video-city" name="city" value={formData.city} onChange={handleChange} placeholder={t("cityPlaceholder")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-desc">{t("description")} *</Label>
        <Textarea id="video-desc" name="description" required value={formData.description} onChange={handleChange} placeholder={t("description")} rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="video-type">{t("type")} *</Label>
          <Input 
            id="video-type" 
            name="type" 
            required
            value={formData.type} 
            onChange={handleChange}
            placeholder={t("typePlaceholder", { defaultValue: "e.g. video, reel, podcast, documentary..." })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-theme">{t("themes")} *</Label>
          <select 
            id="video-theme" 
            name="themes" 
            required
            value={formData.themes !== "[]" ? JSON.parse(formData.themes)[0] : ""} 
            onChange={(e) => {
              const selectedValue = e.target.value;
              setFormData(prev => ({
                ...prev,
                themes: selectedValue ? JSON.stringify([selectedValue]) : "[]"
              }));
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">{t("selectTheme", { defaultValue: "Select Theme" })}</option>
            {themesList.map((theme) => (
              <option key={theme.value} value={theme.value}>{theme.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 p-4 border border-violet-200/50 bg-violet-50/30 rounded-xl dark:bg-violet-900/10 dark:border-violet-800/50">
        <Label className="text-base font-semibold flex items-center gap-2">💰 License Pricing</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="video-price-personal" className="text-sm flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              Personal License (TND)
            </Label>
            <Input id="video-price-personal" name="pricePersonal" type="number" min="0" step="0.1" value={formData.pricePersonal} onChange={handleChange} placeholder="0" />
            <p className="text-xs text-muted-foreground">For personal projects, blogs, non-commercial use</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-price-commercial" className="text-sm flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              Commercial License (TND)
            </Label>
            <Input id="video-price-commercial" name="priceCommercial" type="number" min="0" step="0.1" value={formData.priceCommercial} onChange={handleChange} placeholder="0" />
            <p className="text-xs text-muted-foreground">For business, advertising, commercial projects</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">Set both to 0 for free content. Leave Commercial at 0 to offer only Personal license.</p>
      </div>

      {formData.type === "reel" && (
        <div className="space-y-2 border border-violet-200/50 bg-violet-50/50 p-4 rounded-xl dark:bg-violet-900/10 dark:border-violet-800/50">
          <Label htmlFor="instagram-username" className="flex items-center gap-2">
            {t("instagram")}
            <span className="text-xs text-muted-foreground font-normal">({t("requiredForReels", { defaultValue: "Required for Reels" })})</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <Input 
              id="instagram-username" 
              name="instagramUsername" 
              required={formData.type === "reel"} 
              value={formData.instagramUsername} 
              onChange={handleChange} 
              placeholder="username" 
              className="pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("instagramInfo", { defaultValue: "This will allow viewers to follow the creator directly on Instagram." })}
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{t("file")}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="video/*,audio/*" required onChange={(e) => handleFileChange(e, 'file')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.file ? files.file.name : tDashboard("upload.form.photo.clickToUpload", { type: "file" })}</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, WEBM, MP3 up to 500MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{t("thumbnail")}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.thumbnail ? files.thumbnail.name : tDashboard("upload.form.photo.clickToUpload", { type: "image" })}</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-violet-500/20"
        >
          {loading ? (
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("uploading")}</>
          ) : (
            t("submit")
          )}
        </Button>
      </div>
    </form>
  );
}
