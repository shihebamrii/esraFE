"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Search, 
  User as UserIcon, 
  Shield, 
  Ban, 
  CheckCircle2,
  Package,
  Pencil,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/features/admin/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserPack {
  _id: string;
  packId: {
    _id: string;
    title: string;
    membershipFeatures: any;
  };
  quotas: {
    photosRemaining: number;
    reelsRemaining: number;
    videosRemaining: number;
    documentariesRemaining: number;
  };
  module: string;
  isActive: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  packs: UserPack[];
}

export default function AdminUsersPage() {
  const t = useTranslations("AdminDashboard.users");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPack, setEditingPack] = useState<UserPack | null>(null);
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quotas, setQuotas] = useState({
    photosRemaining: 0,
    reelsRemaining: 0,
    videosRemaining: 0,
    documentariesRemaining: 0,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getUsers({ search });
      if (response.status === "success") {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error(t("messages.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, t]);

  const toggleUserStatus = async (user: User) => {
    const newStatus = user.isActive ? "deactivated" : "active";
    try {
      await AdminService.updateUserStatus(user._id, !user.isActive);
      toast.success(t("messages.updateStatusSuccess", { status: t(`status.${newStatus}`) }));
      fetchUsers();
    } catch (error) {
      toast.error(t("messages.updateStatusFailed"));
    }
  };

  const handleEditQuota = (user: User, pack: UserPack) => {
    setEditingUser(user);
    setEditingPack(pack);
    setQuotas({
      photosRemaining: pack.quotas.photosRemaining,
      reelsRemaining: pack.quotas.reelsRemaining,
      videosRemaining: pack.quotas.videosRemaining,
      documentariesRemaining: pack.quotas.documentariesRemaining,
    });
    setIsQuotaDialogOpen(true);
  };

  const handleUpdateQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingPack) return;

    setSubmitting(true);
    try {
      await AdminService.updateUserPackQuota(editingUser._id, editingPack._id, quotas);
      toast.success(t("messages.updateQuotasSuccess"));
      setIsQuotaDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(t("messages.updateQuotasFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      await AdminService.updateUser(editingUser._id, editFormData);
      toast.success(t("messages.updateSuccess", { defaultValue: "User updated successfully" }));
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(t("messages.updateFailed", { defaultValue: "Failed to update user" }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;

    setSubmitting(true);
    try {
      await AdminService.deleteUser(editingUser._id);
      toast.success(t("messages.deleteSuccess", { defaultValue: "User deleted successfully" }));
      setIsDeleteDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(t("messages.deleteFailed", { defaultValue: "Failed to delete user" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.user")}</TableHead>
            <TableHead>{t("table.role")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.quotas")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {user.role === "admin" ? (
                        <Shield className="h-3 w-3 text-amber-600" />
                      ) : (
                        <UserIcon className="h-3 w-3 text-blue-600" />
                      )}
                      <span className="capitalize text-sm">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {t("status.active")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                        {t("status.deactivated")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-3">
                      {user.packs && user.packs.length > 0 ? (
                        user.packs.map((up) => (
                          <div key={up._id} className="text-[11px] p-2 border rounded-lg bg-muted/20 relative group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-primary">{up.packId?.title}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleEditQuota(user, up)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                              <div className="flex justify-between">
                                <span className="opacity-60">{t("packs.photos")}:</span>
                                <span className="font-mono">{up.quotas.photosRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">{t("packs.reels")}:</span>
                                <span className="font-mono">{up.quotas.reelsRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">{t("packs.videos")}:</span>
                                <span className="font-mono">{up.quotas.videosRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">{t("packs.docs")}:</span>
                                <span className="font-mono">{up.quotas.documentariesRemaining}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {t("packs.noPacks")}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleEditUser(user)}
                        title={t("actions.edit", { defaultValue: "Edit" })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => {
                          setEditingUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                        title={t("actions.delete", { defaultValue: "Delete" })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={user.isActive ? "text-red-600" : "text-green-600"}
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.isActive ? (
                          <><Ban className="h-4 w-4 me-2" /> {t("status.deactivate")}</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4 me-2" /> {t("status.activate")}</>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isQuotaDialogOpen} onOpenChange={setIsQuotaDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-violet-600" />
              {t("dialog.editQuotas")}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.editDescription", {
                name: editingUser?.name,
                pack: editingPack?.packId?.title,
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photos" className="text-right">
                {t("dialog.photosRemaining")}
              </Label>
              <Input
                id="photos"
                type="number"
                value={quotas.photosRemaining}
                onChange={(e) =>
                  setQuotas({
                    ...quotas,
                    photosRemaining: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reels" className="text-right">
                {t("dialog.reelsRemaining")}
              </Label>
              <Input
                id="reels"
                type="number"
                value={quotas.reelsRemaining}
                onChange={(e) =>
                  setQuotas({
                    ...quotas,
                    reelsRemaining: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="videos" className="text-right">
                {t("dialog.videosRemaining")}
              </Label>
              <Input
                id="videos"
                type="number"
                value={quotas.videosRemaining}
                onChange={(e) =>
                  setQuotas({
                    ...quotas,
                    videosRemaining: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docs" className="text-right">
                {t("dialog.docsRemaining")}
              </Label>
              <Input
                id="docs"
                type="number"
                value={quotas.documentariesRemaining}
                onChange={(e) =>
                  setQuotas({
                    ...quotas,
                    documentariesRemaining: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateQuota}
              disabled={submitting}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("dialog.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              {t("dialog.editUser", { defaultValue: "Edit User" })}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.editUserDescription", { defaultValue: "Update user details", name: editingUser?.name })}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("dialog.name", { defaultValue: "Name" })}
              </Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("dialog.email", { defaultValue: "Email" })}
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t("dialog.role", { defaultValue: "Role" })}
              </Label>
              <select
                id="role"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              {t("dialog.deleteUser", { defaultValue: "Delete User" })}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.deleteUserDescription", { 
                defaultValue: "Are you sure you want to delete this user? This action cannot be undone.", 
                name: editingUser?.name 
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
              onClick={handleDeleteUser}
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
