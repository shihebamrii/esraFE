"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image as ImageIcon, Upload, Loader2, AlertCircle, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { PhotoService } from "@/features/photos/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function UserUploadPage() {
  const t = useTranslations("UserDashboard.upload");
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadStep, setUploadStep] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [landscapeType, setLandscapeType] = useState("other");
  const [pricePersonalTND, setPricePersonalTND] = useState("0");
  const [priceCommercialTND, setPriceCommercialTND] = useState("0");
  const [tags, setTags] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [attributionText, setAttributionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [governorates, setGovernorates] = useState<string[]>([]);
  const [landscapeTypes, setLandscapeTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const govRes = await PhotoService.getGovernorates();
        setGovernorates(govRes.data?.governorates?.map((g: any) => g._id) || []);
        
        const landRes = await PhotoService.getLandscapeTypes();
        const types = landRes.data?.landscapeTypes?.map((l: any) => l._id) || [];
        setLandscapeTypes(types.length ? types : ['sea', 'desert', 'mountain', 'village', 'oasis', 'forest', 'city', 'historical', 'other']);
      } catch (e) {
        console.error(t("errors.failedToLoad"));
        setLandscapeTypes(['sea', 'desert', 'mountain', 'village', 'oasis', 'forest', 'city', 'historical', 'other']);
      }
    };
    fetchDropdowns();
  }, [t]);

  const tGovs = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Medenine",
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleThumbnailClick = () => {
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGovernorate("");
    setLandscapeType("other");
    setPricePersonalTND("0");
    setPriceCommercialTND("0");
    setTags("");
    setWatermark(true);
    setAttributionText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType('photo');
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setUploadSuccess(false);
    setUploadError("");
    setUploadStep("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const handleUploadClick = async () => {
    setUploadError("");
    
    if (!title) {
       return setUploadError(t("errors.titleRequired"));
    }
    if (!selectedFile) {
       return setUploadError(t("errors.fileRequired", { type: t(mediaType) }));
    }
    if (mediaType === 'video' && !thumbnailFile) {
       return setUploadError(t("errors.thumbnailRequired"));
    }
    if (!governorate) {
       return setUploadError(t("errors.governorateRequired"));
    }

    setIsUploading(true);
    setUploadStep(t("steps.preparing"));

    try {
      const formData = new FormData();
      formData.append("highRes", selectedFile);
      if (thumbnailFile) {
        formData.append("lowRes", thumbnailFile);
      }
      formData.append("title", title);
      formData.append("description", description);
      formData.append("governorate", governorate);
      formData.append("landscapeType", landscapeType);
      formData.append("pricePersonalTND", pricePersonalTND);
      formData.append("priceCommercialTND", priceCommercialTND);
      formData.append("watermark", String(watermark));
      if (attributionText) {
        formData.append("attributionText", attributionText);
      }
      
      // Parse tags to array
      if (tags) {
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        formData.append("tags", JSON.stringify(tagsArray));
      }

      setUploadStep(t("steps.uploading"));
      await PhotoService.uploadPhoto(formData);
      
      setUploadStep(t("steps.complete"));
      setUploadSuccess(true);
      
      // Navigate to dashboard after 5 seconds so user can see success
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 5000);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message 
        || err.message 
        || t("errors.failedToUpload");
      setUploadError(errorMsg);
      // Scroll error into view
      setTimeout(() => {
        document.getElementById('upload-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } finally {
      setIsUploading(false);
      setUploadStep("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">

      {/* ═══ Full-screen Upload Overlay ═══ */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-card border border-border/50 rounded-3xl p-10 shadow-2xl max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-500">
              {/* Uploading State */}
              <>
                <div className="relative mx-auto mb-6 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-fuchsia-500/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                    <Upload className="h-7 w-7 text-fuchsia-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t("uploading", { type: t(mediaType) })}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("dontClose")}</p>
                <div className="flex items-center justify-center gap-2 text-fuchsia-500 text-sm font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{uploadStep}</span>
                </div>
              </>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {uploadSuccess ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{t("success")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-2">
            {t("pendingApproval", { type: t(mediaType === 'photo' ? 'photo' : 'video').toLowerCase() })}
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
            {t("notification")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => router.push("/user/dashboard")} variant="outline" className="w-full sm:w-auto">
              {t("goDashboard")}
            </Button>
            <Button onClick={resetForm} className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-700">
              <RefreshCcw className="mr-2 h-4 w-4" /> {t("uploadAnother")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-fuchsia-500" /> {t("details")}
              </h2>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("formTitle")} <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder={t("titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea 
                    id="description" 
                    placeholder={t("descriptionPlaceholder")}
                    className="min-h-[100px] resize-y"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="governorate">{t("governorate")} <span className="text-red-500">*</span></Label>
                    <Select value={governorate} onValueChange={setGovernorate}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectGovernorate")} />
                      </SelectTrigger>
                      <SelectContent>
                        {tGovs.map(gov => (
                          <SelectItem key={gov} value={gov}>
                            {t(`governorates.${gov}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landscape">{t("landscapeType")}</Label>
                    <Select value={landscapeType} onValueChange={setLandscapeType}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {landscapeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`landscapeTypes.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">{t("tags")}</Label>
                  <Input 
                    id="tags" 
                    placeholder={t("tagsPlaceholder")}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">{t("pricing")}</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePersonal" className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                      Personal License
                    </Label>
                    <div className="relative">
                      <Input 
                        id="pricePersonal" 
                        type="number" 
                        min="0"
                        step="0.5"
                        value={pricePersonalTND}
                        onChange={(e) => setPricePersonalTND(e.target.value)}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">DT</span>
                    </div>
                    <p className="text-xs text-muted-foreground">For personal projects, blogs, non-commercial use</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceCommercial" className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                      Commercial License
                    </Label>
                    <div className="relative">
                      <Input 
                        id="priceCommercial" 
                        type="number" 
                        min="0"
                        step="0.5"
                        value={priceCommercialTND}
                        onChange={(e) => setPriceCommercialTND(e.target.value)}
                        className="pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">DT</span>
                    </div>
                    <p className="text-xs text-muted-foreground">For business, advertising, commercial projects</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">Set both to 0 for free content. Leave Commercial at 0 to offer only Personal license.</p>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-accent/30">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">{t("watermark")}</Label>
                    <p className="text-xs text-muted-foreground">{t("watermarkInfo")}</p>
                  </div>
                  <Switch checked={watermark} onCheckedChange={setWatermark} />
                </div>
                
                {watermark && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="attribution">{t("customWatermark")}</Label>
                    <Input 
                      id="attribution" 
                      placeholder={t("customWatermarkPlaceholder")}
                      value={attributionText}
                      onChange={(e) => setAttributionText(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-4">{t("mediaType")}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <label className={`flex items-center gap-3 cursor-pointer border p-3 rounded-xl flex-1 transition-colors ${mediaType === 'photo' ? 'border-fuchsia-500 bg-fuchsia-500/5' : 'hover:bg-muted/50'}`}>
                    <input type="radio" name="mediaType" className="w-4 h-4 text-fuchsia-600" checked={mediaType === 'photo'} onChange={() => { setMediaType('photo'); setSelectedFile(null); setPreviewUrl(null); }} />
                    <span className="font-medium text-sm">{t("photo")}</span>
                  </label>
                  <label className={`flex items-center gap-3 cursor-pointer border p-3 rounded-xl flex-1 transition-colors ${mediaType === 'video' ? 'border-fuchsia-500 bg-fuchsia-500/5' : 'hover:bg-muted/50'}`}>
                    <input type="radio" name="mediaType" className="w-4 h-4 text-fuchsia-600" checked={mediaType === 'video'} onChange={() => { setMediaType('video'); setSelectedFile(null); setPreviewUrl(null); setThumbnailFile(null); setThumbnailPreviewUrl(null); }} />
                    <span className="font-medium text-sm">{t("video")}</span>
                  </label>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">{t("uploadLabel", { type: t(mediaType) })} <span className="text-red-500">*</span></h2>
              
              <div 
                onClick={handleFileClick}
                className={`
                  border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all aspect-[4/3]
                  ${previewUrl && mediaType === 'photo' ? 'border-fuchsia-500/50 bg-fuchsia-500/5 p-2' : 'border-border/60 hover:border-fuchsia-500/50 hover:bg-muted p-6'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept={mediaType === 'photo' ? "image/jpeg,image/png,image/webp" : "video/*"} 
                  className="hidden" 
                />
                
                {previewUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group bg-black/10 flex items-center justify-center">
                    {mediaType === 'photo' ? (
                        <img src={previewUrl} alt={t("photo")} className="w-full h-full object-cover" />
                    ) : (
                        <video src={previewUrl} className="w-full h-full object-contain" controls />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Camera className="h-5 w-5" /> {t("changeMedia", { type: t(mediaType) })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">{t("clickToUpload", { type: t(mediaType).toLowerCase() })}</p>
                    <p className="text-xs text-muted-foreground max-w-[180px] mx-auto mb-4">
                      {t("fileInfo", { type: mediaType === 'photo' ? 'JPEG, PNG, WEBP' : 'MP4, WEBM', size: mediaType === 'photo' ? '10' : '500' })}
                    </p>
                    <Button variant="outline" size="sm" type="button" className="pointer-events-none">
                      {t("browseFiles")}
                    </Button>
                  </div>
                )}
              </div>
              
              {selectedFile && (
                <div className="mt-4 text-sm flex items-center justify-between p-3 bg-muted rounded-lg border border-border/50">
                  <span className="truncate max-w-[150px] font-medium" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}

              {mediaType === 'video' && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">{t("videoThumbnail")} <span className="text-red-500">*</span></h2>
                  <div 
                    onClick={handleThumbnailClick}
                    className={`
                      border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all aspect-video
                      ${thumbnailPreviewUrl ? 'border-fuchsia-500/50 bg-fuchsia-500/5 p-2' : 'border-border/60 hover:border-fuchsia-500/50 hover:bg-muted p-6'}
                    `}
                  >
                    <input 
                      type="file" 
                      ref={thumbnailInputRef} 
                      onChange={handleThumbnailChange} 
                      accept="image/jpeg,image/png,image/webp" 
                      className="hidden" 
                    />
                    
                    {thumbnailPreviewUrl ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden group">
                        <img src={thumbnailPreviewUrl} alt={t("videoThumbnail")} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium flex items-center gap-2">
                            <Camera className="h-5 w-5" /> {t("changeThumbnail")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">{t("uploadThumbnail")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("requiredForVideos")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {uploadError && (
                <div id="upload-error" className="mt-4 p-4 rounded-xl border-2 border-red-500/30 bg-red-500/10 animate-in shake-x duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <span className="font-semibold text-red-600 text-sm">{t("uploadFailed")}</span>
                  </div>
                  <p className="text-red-500 text-sm ml-7">{uploadError}</p>
                  <button 
                    onClick={() => setUploadError('')} 
                    className="mt-3 ml-7 text-xs text-red-400 hover:text-red-600 underline transition-colors"
                  >
                    {t("dismiss")}
                  </button>
                </div>
              )}

              <Button 
                className="w-full mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 h-12 text-base font-semibold disabled:opacity-50" 
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-5 w-5" />
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
