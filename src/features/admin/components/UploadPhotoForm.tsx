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

interface UploadPhotoFormProps {
  initialData?: any;
  photoId?: string;
  onSuccess?: () => void;
}

export function UploadPhotoForm({ initialData, photoId, onSuccess }: UploadPhotoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'highRes' | 'lowRes') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
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
      toast.error("Please select a high resolution image file");
      return;
    }

    try {
      setLoading(true);
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

    <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">High-Res Image {photoId ? "(Optional to change)" : "*"}</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" required={!photoId} onChange={(e) => handleFileChange(e, 'highRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.highRes ? files.highRes.name : photoId ? "Click to replace high-res image" : "Click or drag high-res image"}</p>
            <p className="text-xs text-muted-foreground mt-1">Full quality for buyers</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">Low-Res Preview (Optional)</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'lowRes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.lowRes ? files.lowRes.name : "Click or drag preview image"}</p>
            <p className="text-xs text-muted-foreground mt-1">Auto-generated if left empty</p>
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
  );
}
