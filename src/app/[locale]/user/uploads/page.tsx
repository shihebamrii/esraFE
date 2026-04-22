"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  ImageIcon,
  Loader2,
  Search,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
} from "lucide-react";
import Link from "next/link";

interface UserPhoto {
  _id: string;
  title: string;
  description?: string;
  governorate: string;
  landscapeType?: string;
  mediaType: 'photo' | 'video';
  pricePersonalTND: number;
  priceCommercialTND: number;
  previewUrl?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function UserUploadsPage() {
  const t = useTranslations("UserDashboard.uploads");
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<UserPhoto | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    governorate: "",
    pricePersonalTND: "0",
    priceCommercialTND: "0",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<UserPhoto | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;

      const response = await api.get("/photos/my-uploads", { params });
      if (response.data?.status === "success") {
        setPhotos(response.data.data.photos || []);
      }
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
      toast.error("Failed to load your uploads");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPhotos();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  const handleEdit = (photo: UserPhoto) => {
    setEditingPhoto(photo);
    setEditFormData({
      title: photo.title || "",
      description: photo.description || "",
      governorate: photo.governorate || "",
      pricePersonalTND: (photo.pricePersonalTND || 0).toString(),
      priceCommercialTND: (photo.priceCommercialTND || 0).toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    setIsSubmitting(true);
    try {
      const data = {
        title: editFormData.title,
        description: editFormData.description,
        governorate: editFormData.governorate,
        pricePersonalTND: parseFloat(editFormData.pricePersonalTND) || 0,
        priceCommercialTND: parseFloat(editFormData.priceCommercialTND) || 0,
      };

      const response = await api.put(`/photos/my-uploads/${editingPhoto._id}`, data);
      if (response.data?.status === "success") {
        toast.success("Upload updated successfully!");
        setIsEditDialogOpen(false);
        fetchPhotos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (photo: UserPhoto) => {
    setDeletingPhoto(photo);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPhoto) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/photos/my-uploads/${deletingPhoto._id}`);
      toast.success("Upload deleted successfully!");
      setIsDeleteDialogOpen(false);
      fetchPhotos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete upload");
    } finally {
      setIsSubmitting(false);
      setDeletingPhoto(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const governorates = [
    "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa",
    "Jendouba", "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia",
    "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid",
    "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Uploads
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage your uploaded photos and videos
          </p>
        </div>
        <Button asChild className="bg-fuchsia-600 hover:bg-fuchsia-700">
          <Link href="/user/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your uploads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-fuchsia-500" />
            Your Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No uploads yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start sharing your photos and videos with the community
              </p>
              <Button asChild className="bg-fuchsia-600 hover:bg-fuchsia-700">
                <Link href="/user/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Photo
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {photos.map((photo) => (
                    <TableRow key={photo._id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                          {photo.previewUrl ? (
                            <img
                              src={photo.previewUrl}
                              alt={photo.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {photo.title}
                      </TableCell>
                      <TableCell>{getStatusBadge(photo.approvalStatus)}</TableCell>
                      <TableCell className="capitalize">{photo.mediaType}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-muted-foreground">Personal: {photo.pricePersonalTND} TND</div>
                          <div className="text-muted-foreground">Commercial: {photo.priceCommercialTND} TND</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/tounesna/${photo._id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(photo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteClick(photo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Upload</DialogTitle>
            <DialogDescription>
              Update the details of your upload. You cannot change the photo/video file itself.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Governorate</label>
              <Select
                value={editFormData.governorate}
                onValueChange={(value) => setEditFormData({ ...editFormData, governorate: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((gov) => (
                    <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Personal Price (TND)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editFormData.pricePersonalTND}
                  onChange={(e) => setEditFormData({ ...editFormData, pricePersonalTND: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Commercial Price (TND)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editFormData.priceCommercialTND}
                  onChange={(e) => setEditFormData({ ...editFormData, priceCommercialTND: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Upload
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingPhoto?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
