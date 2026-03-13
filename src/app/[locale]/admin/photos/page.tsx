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
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
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
import { Link } from "@/i18n/navigation";

export default function AdminPhotosPage() {
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
      toast.error("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await AdminService.deletePhoto(id);
      toast.success("Photo deleted successfully");
      fetchPhotos();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete photo");
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
      toast.success(`Photo ${status} successfully`);
      fetchPhotos();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${status} photo`);
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
            <TableHead>Preview</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>

            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                <TableCell>{item.createdBy?.name || 'Unknown'}</TableCell>

                <TableCell>{item.governorate}</TableCell>
                <TableCell>{item.priceTND} DT</TableCell>
                <TableCell>{format(new Date(item.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-right space-x-2">
                  {showApprovalActions ? (
                    <>
                      <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApprove(item._id, 'approved')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleApprove(item._id, 'rejected')}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject
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
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            handleDelete(item._id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Photos Management</h2>
         <Link href="/admin/upload?tab=photo">
           <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
             <Plus className="mr-2 h-4 w-4" /> Add Photo
           </Button>
         </Link>
      </div>

       <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search photos..."
             className="pl-9"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <Tabs defaultValue="official" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="official" className="flex gap-2 text-base px-6 py-3">
            <ShieldAlert className="h-5 w-5 text-amber-500" /> Official Content
             <Badge variant="secondary" className="ml-1">{officialPhotos.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex gap-2 text-base px-6 py-3">
            <User className="h-5 w-5 text-slate-500" /> Community Submissions
            {pendingPhotos.length > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingPhotos.length} pending</Badge>
            )}
            {pendingPhotos.length === 0 && (
              <Badge variant="secondary" className="ml-1">{communityPhotos.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="official" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Photos uploaded by system administrators. Automatically approved.</p>
          </div>
          {loading ? <div>Loading...</div> : <PhotoTable data={officialPhotos} />}
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="bg-slate-50 border rounded-lg p-4 mb-6">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-4 bg-white border">
                <TabsTrigger value="pending" className="flex gap-2">
                  <Clock className="h-4 w-4" /> Pending Approvals 
                  <Badge variant="secondary" className="ml-1">{pendingPhotos.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex gap-2">
                  <CheckCircle className="h-4 w-4" /> Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex gap-2">
                  <XCircle className="h-4 w-4" /> Rejected
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {loading ? <div>Loading...</div> : <PhotoTable data={pendingPhotos} showApprovalActions={true} />}
              </TabsContent>
              <TabsContent value="approved">
                {loading ? <div>Loading...</div> : <PhotoTable data={approvedPhotos} />}
              </TabsContent>
              <TabsContent value="rejected">
                {loading ? <div>Loading...</div> : <PhotoTable data={rejectedPhotos} />}
              </TabsContent>
            </Tabs>
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
