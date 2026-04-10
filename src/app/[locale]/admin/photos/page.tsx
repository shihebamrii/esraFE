"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, Clock, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { AdminService } from "@/features/admin/api";
import { UploadPhotoForm } from "@/features/admin/components/UploadPhotoForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldAlert, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function AdminPhotosPage() {
  const t = useTranslations("AdminDashboard.photos");
  const [photos, setPhotos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getPhotos({ limit: 100 });
      setPhotos(res.data?.photos || []);
    } catch (e) {
      console.error(e);
      toast.error(t("messages.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(t("table.deleteConfirm", { title }))) return;
    try {
      await AdminService.deletePhoto(id);
      toast.success(t("messages.deleteSuccess"));
      fetchPhotos();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.deleteFailed"));
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingPhoto(null);
    fetchPhotos();
  };

  const handleApprove = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await AdminService.approvePhoto(id, status);
      toast.success(t("messages.approveSuccess", { status: t(`table.${status}`) }));
      fetchPhotos();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.approveFailed", { status: t(`table.${status}`) }));
    }
  };

  const filteredPhotos = photos.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const officialPhotos = filteredPhotos.filter(p => p.createdBy?.role === 'admin');
  const communityPhotos = filteredPhotos.filter(p => p.createdBy?.role !== 'admin');

  const pendingPhotos = communityPhotos.filter(p => p.approvalStatus === 'pending');
  const approvedPhotos = communityPhotos.filter(p => (!p.approvalStatus || p.approvalStatus === 'approved'));
  const rejectedPhotos = communityPhotos.filter(p => p.approvalStatus === 'rejected');

  const PhotoTable = ({ data, showApprovalActions = false }: { data: any[], showApprovalActions?: boolean }) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.preview")}</TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.user")}</TableHead>

            <TableHead>{t("table.location")}</TableHead>
            <TableHead>{t("table.price")}</TableHead>
            <TableHead>{t("table.tags")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No photos found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={item.previewUrl || '/placeholder.png'} 
                      alt={item.title} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium truncate max-w-[150px]">{item.title}</TableCell>
                <TableCell>{item.createdBy?.name || t("table.unknown")}</TableCell>

                <TableCell>{item.governorate}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400">P: {item.pricePersonalTND ?? item.priceTND ?? 0} DT</span>
                    {(item.priceCommercialTND > 0) && (
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">C: {item.priceCommercialTND} DT</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-4">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags?.length > 3 && <span className="text-[10px] text-muted-foreground">+{item.tags.length - 3}</span>}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {showApprovalActions ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          onClick={() => handleApprove(item._id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 me-1" /> {t("table.approve")}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => handleApprove(item._id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 me-1" /> {t("table.reject")}
                        </Button>
                      </>
                    ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setEditingPhoto(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDelete(item._id, item.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <Link href="/admin/upload">
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            {t("addPhoto")}
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue="official"
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="official" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              {t("tabs.official")}
              <Badge variant="secondary" className="ml-1">{officialPhotos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("tabs.community")}
              {pendingPhotos.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingPhotos.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <TabsContent value="official" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("officialDescription")}</p>
          </div>
          {loading ? <div>{t("loading")}</div> : <PhotoTable data={officialPhotos} />}
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-lg font-semibold">{t("tabs.pending")}</h3>
                <Badge variant="destructive" className="ml-1">{pendingPhotos.length}</Badge>
              </div>
              {loading ? (
                <div>{t("loading")}</div>
              ) : (
                <PhotoTable data={pendingPhotos} showApprovalActions={true} />
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="text-lg font-semibold">{t("tabs.approved")}</h3>
                <Badge variant="secondary" className="ml-1">{approvedPhotos.length}</Badge>
              </div>
              {loading ? (
                <div>{t("loading")}</div>
              ) : (
                <PhotoTable data={approvedPhotos} />
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-lg font-semibold">{t("tabs.rejected")}</h3>
                <Badge variant="secondary" className="ml-1">{rejectedPhotos.length}</Badge>
              </div>
              {loading ? (
                <div>{t("loading")}</div>
              ) : (
                <PhotoTable data={rejectedPhotos} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <DialogDescription>
              Update the details of the selected photo.
            </DialogDescription>
          </DialogHeader>
          {editingPhoto && (
            <UploadPhotoForm 
              photoId={editingPhoto._id} 
              initialData={editingPhoto} 
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
