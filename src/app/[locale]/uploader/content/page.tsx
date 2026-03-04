"use client";

import { useState, useEffect } from "react";
import { UploaderService } from "@/features/uploader/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Search, Eye, Filter, MoreHorizontal, FileVideo, Music, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UploaderContentPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState("video");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadThumbnail, setUploadThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await UploaderService.getMyContent();
      setContents(data.data.contents);
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const resetForm = () => {
    setUploadTitle("");
    setUploadType("video");
    setUploadCategory("");
    setUploadDescription("");
    setUploadFile(null);
    setUploadThumbnail(null);
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
      setUploadError("Please select a media file");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("title", uploadTitle);
      formData.append("type", uploadType);
      formData.append("description", uploadDescription);
      formData.append("file", uploadFile);
      formData.append("visibility", "public");

      if (uploadCategory) {
        formData.append("themes", JSON.stringify([uploadCategory]));
      }
      if (uploadThumbnail) {
        formData.append("thumbnail", uploadThumbnail);
      }

      await UploaderService.uploadContent(formData);
      setUploadSuccess(true);

      // Refresh the content list
      await fetchContent();

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

  const filteredContent = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterType ? c.type === filterType : true)
  );

  return (
    <div className="space-y-8 p-4">
       {/* Header with Glass Effect */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg shadow-xl">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
            My Content
          </h2>
          <p className="text-muted-foreground mt-1">Manage and track your video & audio uploads.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20 text-white border-0 transition-all hover:scale-105">
              <Plus className="me-2 h-4 w-4" /> Upload Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Upload New Content</DialogTitle>
              <DialogDescription>
                Upload a video, audio, or documentary to the Impact platform.
              </DialogDescription>
            </DialogHeader>

            {uploadSuccess ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="font-semibold text-emerald-600">Upload Successful!</p>
                <p className="text-sm text-muted-foreground">Your content has been uploaded.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Content title"
                      className="bg-secondary/50"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        disabled={uploading}
                      >
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="documentary">Documentary</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g. Culture"
                        className="bg-secondary/50"
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file">Media File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="video/*,audio/*"
                      className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-sm file:font-semibold hover:file:bg-primary/90"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer file:bg-secondary file:text-secondary-foreground file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-4 file:text-sm file:font-semibold hover:file:bg-secondary/80"
                      onChange={(e) => setUploadThumbnail(e.target.files?.[0] || null)}
                      disabled={uploading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea
                      id="desc"
                      placeholder="Describe your content..."
                      rows={3}
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/40 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search content..."
            className="pl-10 bg-secondary/50 border-white/5 focus-visible:ring-amber-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
             <Button 
                variant={filterType === null ? "secondary" : "ghost"} 
                onClick={() => setFilterType(null)}
                className="flex-1 sm:flex-none"
             >
                All
             </Button>
             <Button 
                variant={filterType === 'video' ? "secondary" : "ghost"} 
                onClick={() => setFilterType('video')}
                className="flex-1 sm:flex-none"
             >
                <FileVideo className="mr-2 h-4 w-4" /> Video
             </Button>
             <Button 
                variant={filterType === 'audio' ? "secondary" : "ghost"} 
                onClick={() => setFilterType('audio')}
                className="flex-1 sm:flex-none"
             >
                <Music className="mr-2 h-4 w-4" /> Audio
             </Button>
        </div>
      </div>

      {/* Content Table */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden rounded-xl">
        <CardContent className="p-0">
            {loading ? (
                 <div className="p-4 space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-muted-foreground">Title</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Views</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredContent.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No content found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredContent.map((item) => (
                        <TableRow key={item._id} className="hover:bg-white/5 border-white/5 transition-colors">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                        item.type === 'video' ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-500'
                                    }`}>
                                        {item.type === 'video' ? <FileVideo className="h-5 w-5" /> : <Music className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">{item.title}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize border-white/10 bg-white/5">
                                    {item.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-1.5 text-sm font-medium">
                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" /> {item.views}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge className={
                                    item.visibility === 'public' 
                                    ? "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20" 
                                    : "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20"
                                }>
                                    {item.visibility}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Eye className="mr-2 h-4 w-4" /> Hide</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
