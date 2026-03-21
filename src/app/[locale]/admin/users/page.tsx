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
  Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/features/admin/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPack, setEditingPack] = useState<UserPack | null>(null);
  const [isQuotaDialogOpen, setIsQuotaDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quotas, setQuotas] = useState({
    photosRemaining: 0,
    reelsRemaining: 0,
    videosRemaining: 0,
    documentariesRemaining: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getUsers({ search });
      if (response.status === "success") {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleUserStatus = async (user: User) => {
    try {
      await AdminService.updateUserStatus(user._id, !user.isActive);
      toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
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
      toast.success("Quotas updated successfully");
      setIsQuotaDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update quotas");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active Packs & Quotas</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                        Deactivated
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
                                <span className="opacity-60">Photos:</span>
                                <span className="font-mono">{up.quotas.photosRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">Reels:</span>
                                <span className="font-mono">{up.quotas.reelsRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">Videos:</span>
                                <span className="font-mono">{up.quotas.videosRemaining}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-60">Docs:</span>
                                <span className="font-mono">{up.quotas.documentariesRemaining}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No active packs</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={user.isActive ? "text-red-600" : "text-green-600"}
                      onClick={() => toggleUserStatus(user)}
                    >
                      {user.isActive ? (
                        <><Ban className="h-4 w-4 me-2" /> Deactivate</>
                      ) : (
                        <><CheckCircle2 className="h-4 w-4 me-2" /> Activate</>
                      )}
                    </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quotas</DialogTitle>
            <DialogDescription>
              Manually adjust the remaining quotas for {editingUser?.name}'s {editingPack?.packId?.title}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateQuota} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Photos Remaining</Label>
                <Input
                  type="number"
                  value={quotas.photosRemaining}
                  onChange={(e) => setQuotas({ ...quotas, photosRemaining: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reels Remaining</Label>
                <Input
                  type="number"
                  value={quotas.reelsRemaining}
                  onChange={(e) => setQuotas({ ...quotas, reelsRemaining: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Videos Remaining</Label>
                <Input
                  type="number"
                  value={quotas.videosRemaining}
                  onChange={(e) => setQuotas({ ...quotas, videosRemaining: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Docs Remaining</Label>
                <Input
                  type="number"
                  value={quotas.documentariesRemaining}
                  onChange={(e) => setQuotas({ ...quotas, documentariesRemaining: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsQuotaDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
