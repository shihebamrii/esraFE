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

export function UploadVideoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video",
    themes: "[]",
    region: "",
    tags: "[]",
    language: "ar",
    rights: "free",
    price: "0",
    visibility: "public"
  });

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
      toast.error("Please select a video file");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("file", files.file);
      if (files.thumbnail) {
        data.append("thumbnail", files.thumbnail);
      }

      await AdminService.uploadContent(data);
      toast.success("Video uploaded successfully!");
      router.push("/admin/content");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload video");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="video-title">Title *</Label>
          <Input id="video-title" name="title" required value={formData.title} onChange={handleChange} placeholder="Video title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-region">Region</Label>
          <Input id="video-region" name="region" value={formData.region} onChange={handleChange} placeholder="e.g., Tunis" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-desc">Description *</Label>
        <Textarea id="video-desc" name="description" required value={formData.description} onChange={handleChange} placeholder="Video description..." rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
         <div className="space-y-2">
          <Label htmlFor="video-price">Price (TND)</Label>
          <Input id="video-price" name="price" type="number" min="0" step="0.1" value={formData.price} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video-rights">Rights</Label>
          <select 
            id="video-rights" 
            name="rights" 
            value={formData.rights} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="license">License</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">Main File (Video/Audio) *</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="video/*,audio/*" required onChange={(e) => handleFileChange(e, 'file')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.file ? files.file.name : "Click or drag file to upload"}</p>
            <p className="text-xs text-muted-foreground mt-1">MP4, WEBM, MP3 up to 500MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold block mb-2">Thumbnail (Image)</Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">{files.thumbnail ? files.thumbnail.name : "Click or drag image to upload"}</p>
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
             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
          ) : (
            "Upload Content"
          )}
        </Button>
      </div>
    </form>
  );
}
