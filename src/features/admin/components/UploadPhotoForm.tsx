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
import { Loader2, UploadCloud, Sparkles, Upload } from "lucide-react";

interface UploadPhotoFormProps {
  initialData?: any;
  photoId?: string;
  onSuccess?: () => void;
}

export function UploadPhotoForm({ initialData, photoId, onSuccess }: UploadPhotoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    governorate: initialData?.governorate || "",
    landscapeType: initialData?.landscapeType || "sea",
    priceTND: initialData?.priceTND?.toString() || "0",
    watermark: initialData?.watermark !== undefined ? initialData.watermark.toString() : "true",
    attributionText: initialData?.attributionText || "Tounesna Official Content",
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
      
      // Trigger AI tags if we selected a highRes photo and aren't editing
      if (type === 'highRes' && mediaType === 'photo' && !photoId) {
        setIsAnalyzingAI(true);
        try {
          const form = new FormData();
          form.append('photo', file);
          const result = await PhotoService.analyzePhoto(form);
          
          setFormData(prev => {
            let nextState = { ...prev };
            
            // Handle Tags
            if (result.data?.tags && result.data.tags.length > 0) {
              const currentTags = prev.tags === "[]" ? [] : JSON.parse(prev.tags);
              const newTags = [...new Set([...currentTags, ...result.data.tags])];
              nextState.tags = JSON.stringify(newTags);
            }
            
            // Handle Description (only if empty to avoid overwriting user text)
            if (result.data?.description && !prev.description) {
               nextState.description = result.data.description;
            }
            
            return nextState;
          });
          
          if (result.data?.tags?.length || result.data?.description) {
            toast.success("AI generated tags and description successfully!");
          }
        } catch (error) {
          console.error("AI Analysis failed", error);
          toast.error("Failed to auto-analyze image.");
        } finally {
          setIsAnalyzingAI(false);
        }
      }
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
      toast.error(`Please select a ${mediaType} file`);
      return;
    }
    
    if (!isEditing && mediaType === 'video' && !files.lowRes) {
      toast.error("Please select a thumbnail image for the video");
      return;
    }

    try {
      setLoading(true);
      setUploadStep(isEditing ? "Updating photo..." : "Preparing upload...");
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

      setUploadStep(isEditing ? "Saving changes..." : "Uploading to server...");
      if (isEditing) {
        await AdminService.updatePhoto(photoId, data);
        toast.success("Photo updated successfully!");
      } else {
        await AdminService.uploadPhoto(data);
        toast.success("Photo uploaded successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/photos");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'upload'} photo`);
      console.error(error);
    } finally {
      setLoading(false);
      setUploadStep("");
    }
  };

  return (
    <>
      {/* ═══ Full-screen Upload Overlay ═══ */}
      {(loading || isAnalyzingAI) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-card border border-border/50 rounded-3xl p-10 shadow-2xl max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-500">
            {isAnalyzingAI ? (
               // AI Processing State
               <>
                 <div className="relative mx-auto mb-6 h-20 w-20">
                   <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                   <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
                   <div className="absolute inset-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                     <Sparkles className="h-7 w-7 text-amber-500" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400 mb-2">
                   AI is processing...
                 </h3>
                 <p className="text-sm text-muted-foreground mb-4">Generating tags for your photo</p>
                 <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-medium">
                   <Loader2 className="h-4 w-4 animate-spin" />
                   <span>Analyzing image content</span>
                 </div>
               </>
            ) : (
               // Uploading State
               <>
                 <div className="relative mx-auto mb-6 h-20 w-20">
                   <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
                   <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
                   <div className="absolute inset-3 rounded-full bg-amber-500/10 flex items-center justify-center">
                     <Upload className="h-7 w-7 text-amber-500" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-foreground mb-2">{photoId ? 'Updating Photo...' : 'Uploading Photo...'}</h3>
                 <p className="text-sm text-muted-foreground mb-4">Please don't close this page</p>
                 <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-medium">
                   <Loader2 className="h-4 w-4 animate-spin" />
                   <span>{uploadStep}</span>
                 </div>
               </>
            )}
          </div>
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-6">
      
      {!photoId && (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Asset Type</Label>
          <div className="flex gap-4">
            <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl flex-1 transition-colors ${mediaType === 'photo' ? 'border-amber-500 bg-amber-500/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="mediaType" className="w-4 h-4 text-amber-600 focus:ring-amber-500" checked={mediaType === 'photo'} onChange={() => setMediaType('photo')} />
              <span className="font-medium">Photo / Image</span>
            </label>
            <label className={`flex items-center gap-3 cursor-pointer border p-4 rounded-xl flex-1 transition-colors ${mediaType === 'video' ? 'border-amber-500 bg-amber-500/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="mediaType" className="w-4 h-4 text-amber-600 focus:ring-amber-500" checked={mediaType === 'video'} onChange={() => setMediaType('video')} />
              <span className="font-medium">Video</span>
            </label>
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-title">Title *</Label>
          <Input id="photo-title" name="title" required value={formData.title} onChange={handleChange} placeholder="Photo title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photo-gov">Governorate *</Label>
          <Input id="photo-gov" name="governorate" required value={formData.governorate} onChange={handleChange} placeholder="e.g., Nabeul" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo-desc">Description *</Label>
        <Textarea id="photo-desc" name="description" required value={formData.description} onChange={handleChange} placeholder="Photo description..." rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-type">Landscape Type *</Label>
          <select 
            id="photo-type" 
            name="landscapeType" 
            value={formData.landscapeType} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="sea">Sea / Beach</option>
            <option value="desert">Desert</option>
            <option value="mountain">Mountain</option>
            <option value="village">Village</option>
            <option value="oasis">Oasis</option>
            <option value="forest">Forest</option>
            <option value="city">City</option>
            <option value="historical">Historical</option>
            <option value="other">Other</option>
          </select>
        </div>
         <div className="space-y-2">
          <Label htmlFor="photo-price">Price (TND)</Label>
          <Input id="photo-price" name="priceTND" type="number" min="0" step="0.1" value={formData.priceTND} onChange={handleChange} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photo-attr">Attribution Text</Label>
          <Input id="photo-attr" name="attributionText" value={formData.attributionText} onChange={handleChange} placeholder="Watermark text" />
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
          <Label htmlFor="photo-watermark">Auto-generate Watermark</Label>
        </div>
      </div>

      {!photoId && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            <span className="font-semibold">AI Auto-Tagging:</span> Tags are automatically generated when you select a photo above. You can edit them freely before submitting.
          </p>
        </div>
      )}

    <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{mediaType === 'photo' ? 'High-Res Image' : 'Video File'} {photoId ? "(Optional to change)" : "*"}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept={mediaType === 'photo' ? "image/*" : "video/*"} required={!photoId} onChange={(e) => handleFileChange(e, 'highRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.highRes ? files.highRes.name : photoId ? `Click to replace ${mediaType}` : `Click or drag ${mediaType} file`}</p>
            <p className="text-xs text-muted-foreground mt-1">Full quality for buyers</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">{mediaType === 'video' ? 'Video Thumbnail (Image)' : 'Low-Res Preview (Optional)'} {mediaType === 'video' && !photoId ? "*" : ""}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" required={mediaType === 'video' && !photoId} onChange={(e) => handleFileChange(e, 'lowRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.lowRes ? files.lowRes.name : "Click or drag preview image"}</p>
            <p className="text-xs text-muted-foreground mt-1">{mediaType === 'video' ? 'Required for video' : 'Auto-generated if left empty'}</p>
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
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {photoId ? "Updating..." : "Uploading..."}</>
          ) : (
            photoId ? "Update Photo" : "Upload Photo"
          )}
        </Button>
      </div>
    </form>
    </>
  );
}
