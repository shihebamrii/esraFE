"use client";

import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AdminService } from "@/features/admin/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ShieldAlert, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminContentPage() {
  const t = useTranslations("AdminDashboard.content");
  const [contents, setContents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("official");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingContent, setDeletingContent] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    type: "video",
  });

  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getContent({ limit: 100 });
      setContents(res.data?.contents || []);
    } catch (e) {
      console.error(e);
      toast.error(t("messages.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleApprove = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await AdminService.approveContent(id, status);
      toast.success(t("messages.approveSuccess", { status: t(`table.${status}`) }));
      fetchContents();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.approveFailed", { status: t(`table.${status}`) }));
    }
  };

  const handleEdit = (item: any, isCommunity: boolean = false) => {
    setEditingContent(item);
    setEditFormData({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "video",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    setSubmitting(true);
    try {
      await AdminService.updateContent(editingContent._id, editFormData);
      toast.success(t("messages.updateSuccess", { defaultValue: "Content updated successfully" }));
      setIsEditDialogOpen(false);
      fetchContents();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.updateFailed", { defaultValue: "Failed to update content" }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: any) => {
    setDeletingContent(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingContent) return;

    setSubmitting(true);
    try {
      await AdminService.deleteContent(deletingContent._id);
      toast.success(t("messages.deleteSuccess", { defaultValue: "Content deleted successfully" }));
      setIsDeleteDialogOpen(false);
      fetchContents();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.deleteFailed", { defaultValue: "Failed to delete content" }));
    } finally {
      setSubmitting(false);
      setDeletingContent(null);
    }
  };

  const filteredContent = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const officialContent = filteredContent.filter(c => c.createdBy?.role === 'admin');
  const communityContent = filteredContent.filter(c => c.createdBy?.role !== 'admin');

  const pendingContent = communityContent.filter(c => c.approvalStatus === 'pending');
  const approvedContent = communityContent.filter(c => (!c.approvalStatus || c.approvalStatus === 'approved'));
  const rejectedContent = communityContent.filter(c => c.approvalStatus === 'rejected');

  const ContentTable = ({ data, showApprovalActions = false }: { data: any[], showApprovalActions?: boolean }) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.user")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                {t("table.noContent")}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium truncate max-w-[200px]">{item.title}</TableCell>
                <TableCell>{item.createdBy?.name || t("table.unknown")}</TableCell>

                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${ 
                    (item.approvalStatus || 'approved') === 'approved' ? 'text-green-600 border-green-200 bg-green-50' : 
                    item.approvalStatus === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' : 
                    'text-amber-600 border-amber-200 bg-amber-50'
                  }`}>
                    {item.approvalStatus || 'approved'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {showApprovalActions ? (
                      <>
                        <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApprove(item._id, 'approved')}>
                          <CheckCircle className="mr-2 h-4 w-4" /> {t("table.approve")}
                        </Button>
                        <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleApprove(item._id, 'rejected')}>
                          <XCircle className="mr-2 h-4 w-4" /> {t("table.reject")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(item, !showApprovalActions)}
                          title={t("actions.edit", { defaultValue: "Edit" })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(item)}
                          title={t("actions.delete", { defaultValue: "Delete" })}
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
        {activeTab !== "community" && (
          <Link href="/admin/upload?section=impact">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t("addContent", { defaultValue: "Add Content" })}
            </Button>
          </Link>
        )}
      </div>

      <Tabs
        defaultValue="official"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="official" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              {t("tabs.official")}
              <Badge variant="secondary" className="ml-1">{officialContent.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("tabs.community")}
              {pendingContent.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingContent.length}</Badge>
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
            {loading ? <div>{t("loading")}</div> : <ContentTable data={officialContent} />}
          </TabsContent>

        <TabsContent value="community" className="mt-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.pending")}</h3>
                  <Badge variant="destructive" className="ml-1">{pendingContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={pendingContent} showApprovalActions={true} />
                )}
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.approved")}</h3>
                  <Badge variant="secondary" className="ml-1">{approvedContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={approvedContent} />
                )}
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.rejected")}</h3>
                  <Badge variant="secondary" className="ml-1">{rejectedContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={rejectedContent} />
                )}
              </div>
            </div>
          </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              {t("dialog.editContent", { defaultValue: "Edit Content" })}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.editDescription", { defaultValue: "Update content details", title: editingContent?.title })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("dialog.title", { defaultValue: "Title" })}</Label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                placeholder={t("dialog.titlePlaceholder", { defaultValue: "Enter content title" })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("dialog.description", { defaultValue: "Description" })}</Label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder={t("dialog.descriptionPlaceholder", { defaultValue: "Enter content description" })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t("dialog.type", { defaultValue: "Type" })}</Label>
              <Input
                id="type"
                value={editFormData.type}
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                placeholder={t("dialog.typePlaceholder", { defaultValue: "e.g. video, reel, documentary, podcast..." })}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t("dialog.saveChanges", { defaultValue: "Save Changes" })}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              {t("dialog.deleteContent", { defaultValue: "Delete Content" })}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.deleteDescription", { 
                defaultValue: "Are you sure you want to delete this content? This action cannot be undone.", 
                title: deletingContent?.title 
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("dialog.cancel", { defaultValue: "Cancel" })}
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("dialog.delete", { defaultValue: "Delete" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
