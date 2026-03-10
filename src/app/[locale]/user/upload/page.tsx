"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image as ImageIcon, Upload, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { PhotoService } from "@/features/photos/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UserUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [landscapeType, setLandscapeType] = useState("other");
  const [priceTND, setPriceTND] = useState("0");
  const [tags, setTags] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [attributionText, setAttributionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        console.error("Failed to load dropdowns");
        setLandscapeTypes(['sea', 'desert', 'mountain', 'village', 'oasis', 'forest', 'city', 'historical', 'other']);
      }
    };
    fetchDropdowns();
  }, []);

  const tGovs = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Medenine",
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
    "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGovernorate("");
    setLandscapeType("other");
    setPriceTND("0");
    setTags("");
    setWatermark(true);
    setAttributionText("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = async () => {
    setUploadError("");
    
    if (!title) {
       return setUploadError("Title is required");
    }
    if (!selectedFile) {
       return setUploadError("Please select a photo file");
    }
    if (!governorate) {
       return setUploadError("Governorate is required");
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("highRes", selectedFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("governorate", governorate);
      formData.append("landscapeType", landscapeType);
      formData.append("priceTND", priceTND);
      formData.append("watermark", String(watermark));
      if (attributionText) {
        formData.append("attributionText", attributionText);
      }
      
      if (tags) {
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
        formData.append("tags", JSON.stringify(tagsArray));
      }

      await PhotoService.uploadPhoto(formData);
      setUploadSuccess(true);
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000);
      
    } catch (err: any) {
      setUploadError(
        err.response?.data?.message || "Failed to upload photo. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600">
            Upload to Tounesna
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your beautiful photos of Tunisia. Submissions require Admin approval.
          </p>
        </div>
      </div>

      {uploadSuccess ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="h-20 w-20 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Upload Successful!</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Your photo has been uploaded successfully and is now pending admin approval. You will be notified once it's reviewed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => router.push("/user/dashboard")} variant="outline" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
            <Button onClick={resetForm} className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-700">
              <RefreshCcw className="mr-2 h-4 w-4" /> Upload Another
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-fuchsia-500" /> Photo Details
              </h2>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Photo Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="E.g., Sunset in Sidi Bou Said" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Tell us about this photo... where was it taken? What's the story?"
                    className="min-h-[100px] resize-y"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="governorate">Governorate <span className="text-red-500">*</span></Label>
                    <Select value={governorate} onValueChange={setGovernorate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {tGovs.map(gov => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landscape">Landscape Type</Label>
                    <Select value={landscapeType} onValueChange={setLandscapeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {landscapeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    placeholder="e.g. nature, sunset, architecture" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Pricing & Licensing</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (TND)</Label>
                  <div className="relative">
                    <Input 
                      id="price" 
                      type="number" 
                      min="0"
                      step="0.5"
                      value={priceTND}
                      onChange={(e) => setPriceTND(e.target.value)}
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">DT</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Set to 0 to make it free</p>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-accent/30">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Add Watermark to Preview</Label>
                    <p className="text-xs text-muted-foreground">Protect your high-res image with a tiled watermark on the preview</p>
                  </div>
                  <Switch checked={watermark} onCheckedChange={setWatermark} />
                </div>
                
                {watermark && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="attribution">Custom Watermark Text (Optional)</Label>
                    <Input 
                      id="attribution" 
                      placeholder="e.g. Photo by Jane Doe" 
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
              <h2 className="text-xl font-semibold mb-4">Upload File <span className="text-red-500">*</span></h2>
              
              <div 
                onClick={handleFileClick}
                className={`
                  border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all aspect-[4/3]
                  ${previewUrl ? 'border-fuchsia-500/50 bg-fuchsia-500/5 p-2' : 'border-border/60 hover:border-fuchsia-500/50 hover:bg-muted p-6'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />
                
                {previewUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Camera className="h-5 w-5" /> Change Photo
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Click to upload photo</p>
                    <p className="text-xs text-muted-foreground max-w-[180px] mx-auto mb-4">
                      High resolution JPEG, PNG or WEBP (Max 10MB)
                    </p>
                    <Button variant="outline" size="sm" type="button" className="pointer-events-none">
                      Browse Files
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

              {uploadError && (
                <div className="mt-4 flex items-start gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{uploadError}</p>
                </div>
              )}

              <Button 
                className="w-full mt-6 bg-fuchsia-600 hover:bg-fuchsia-700 h-12 text-base font-semibold" 
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
