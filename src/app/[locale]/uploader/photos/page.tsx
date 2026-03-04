"use client";

import { useState, useEffect } from "react";
import { UploaderService } from "@/features/uploader/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Search, Download, MapPin, MoreVertical, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const TUNISIAN_GOVERNORATES = [
  "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

export default function UploaderPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadGovernorate, setUploadGovernorate] = useState("");
  const [uploadLandscapeType, setUploadLandscapeType] = useState("sea");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadPrice, setUploadPrice] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await UploaderService.getMyPhotos();
      setPhotos(data.data.photos);
    } catch (error) {
      console.error("Failed to fetch photos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const resetForm = () => {
    setUploadTitle("");
    setUploadGovernorate("");
    setUploadLandscapeType("sea");
    setUploadDescription("");
    setUploadPrice("");
    setUploadFile(null);
    setUploadError("");
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    // Validation
    if (!uploadTitle.trim()) {
      setUploadError("Title is required");
      return;
    }
    if (!uploadFile) {
      setUploadError("Please select a photo file");
      return;
    }
    if (!uploadGovernorate.trim()) {
      setUploadError("Governorate is required");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("governorate", uploadGovernorate);
      formData.append("landscapeType", uploadLandscapeType);
      formData.append("description", uploadDescription);
      formData.append("highRes", uploadFile);

      if (uploadPrice) {
        formData.append("priceTND", uploadPrice);
      }

      await UploaderService.uploadPhoto(formData);
      setUploadSuccess(true);

      // Refresh the photos list
      await fetchPhotos();

      // Close dialog after brief success message
      setTimeout(() => {
        setIsDialogOpen(false);
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadError(
        error?.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const filteredPhotos = photos.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.governorate && p.governorate.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-4">
      {/* Header with Glass Effect */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg shadow-xl">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 to-teal-500 bg-clip-text text-transparent">
            My Photos
          </h2>
          <p className="text-muted-foreground mt-1">Manage your Tounesna gallery.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 text-white border-0 transition-all hover:scale-105">
              <Plus className="me-2 h-4 w-4" /> Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Upload New Photo</DialogTitle>
              <DialogDescription>
                Add a new photo to the Tounesna collection.
              </DialogDescription>
            </DialogHeader>

            {uploadSuccess ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="font-semibold text-emerald-600">Photo Uploaded!</p>
                <p className="text-sm text-muted-foreground">Your photo has been added to the gallery.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Photo title"
                      className="bg-secondary/50"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="location">Governorate *</Label>
                      <Select 
                        value={uploadGovernorate} 
                        onValueChange={setUploadGovernorate}
                        disabled={uploading}
                      >
                        <SelectTrigger className="w-full bg-secondary/50">
                          <SelectValue placeholder="Where was this taken?" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {TUNISIAN_GOVERNORATES.map((gov) => (
                            <SelectItem key={gov} value={gov}>
                              {gov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (TND)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0 for free"
                        className="bg-secondary/50"
                        value={uploadPrice}
                        onChange={(e) => setUploadPrice(e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="photo">High-Resolution Photo *</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-sm file:font-semibold hover:file:bg-primary/90"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      disabled={uploading}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 2000px width recommended</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="landscape">Landscape Type</Label>
                    <select
                      id="landscape"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={uploadLandscapeType}
                      onChange={(e) => setUploadLandscapeType(e.target.value)}
                      disabled={uploading}
                    >
                      <option value="sea">Sea</option>
                      <option value="desert">Desert</option>
                      <option value="mountain">Mountain</option>
                      <option value="city">City</option>
                      <option value="historical">Historical</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                      id="desc"
                      placeholder="Describe the photo..."
                      rows={2}
                      className="bg-secondary/50"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Error message */}
                {uploadError && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {uploadError}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

       {/* Search Bar */}
      <div className="relative max-w-md w-full">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
         <Input 
            placeholder="Search by title or location..."
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-emerald-500 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
      </div>

      {/* Photos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
            {loading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="space-y-3">
                         <Skeleton className="h-[300px] w-full rounded-xl" />
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-4 w-[40%]" />
                         </div>
                    </div>
                ))
            ) : filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo) => (
                <motion.div 
                    key={photo._id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-card shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                    {/* Photo Visual */}
                    <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                        {/* Placeholder gradient if no image loaded yet or as fallback */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 flex items-center justify-center">
                             {photo.previewUrl ? (
                                <img src={photo.previewUrl} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             ) : (
                                <span className="text-4xl opacity-30">🖼️</span>
                             )}
                        </div>
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Top Badge */}
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/60">{photo.priceTND === 0 ? 'Free' : `${photo.priceTND} TND`}</Badge>
                        </div>

                         {/* Actions Menu */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 text-white">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive"><Search className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    
                    {/* Content Info */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                        <h3 className="font-bold text-lg line-clamp-1 mb-1">{photo.title}</h3>
                        <div className="flex items-center justify-between text-white/70 text-sm">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {photo.governorate}
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <Download className="h-3 w-3" /> {photo.previewDownloads}
                            </span>
                        </div>
                    </div>
                </motion.div>
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                    No photos found matching your search.
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
