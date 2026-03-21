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
import { Pencil, Trash2, Plus, Loader2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/features/admin/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Pack {
  _id: string;
  title: string;
  description: string;
  type: "collection" | "membership";
  priceTND: number;
  photoIds?: string[];
  membershipFeatures?: {
    photosLimit?: number;
    reelsLimit?: number;
    videosLimit?: number;
    documentariesLimit?: number;
    quality: "standard" | "hd" | "4k";
    module: "tounesna" | "impact" | "both";
  };
  isActive: boolean;
  popular?: boolean;
}

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Pack>>({
    title: "",
    description: "",
    type: "membership",
    priceTND: 0,
    isActive: true,
    membershipFeatures: {
      quality: "standard",
      module: "tounesna",
      photosLimit: 0,
      reelsLimit: 0,
      videosLimit: 0,
      documentariesLimit: 0,
    },
  });

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getPacks();
      if (response.status === "success") {
        setPacks(response.data.packs);
      }
    } catch (error) {
      toast.error("Failed to fetch packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleEdit = (pack: Pack) => {
    setEditingPack(pack);
    setFormData({
      ...pack,
      membershipFeatures: pack.membershipFeatures || {
        quality: "standard",
        module: "tounesna",
        photosLimit: 0,
        reelsLimit: 0,
        videosLimit: 0,
        documentariesLimit: 0,
      },
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pack?")) return;
    try {
      await AdminService.deletePack(id);
      toast.success("Pack deleted successfully");
      fetchPacks();
    } catch (error) {
      toast.error("Failed to delete pack");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPack) {
        await AdminService.updatePack(editingPack._id, formData);
        toast.success("Pack updated successfully");
      } else {
        await AdminService.createPack(formData);
        toast.success("Pack created successfully");
      }
      setIsDialogOpen(false);
      fetchPacks();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save pack");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingPack(null);
    setFormData({
      title: "",
      description: "",
      type: "membership",
      priceTND: 0,
      isActive: true,
      membershipFeatures: {
        quality: "standard",
        module: "tounesna",
        photosLimit: 0,
        reelsLimit: 0,
        videosLimit: 0,
        documentariesLimit: 0,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Packs Management</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="me-2 h-4 w-4" /> Create Pack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingPack ? "Edit Pack" : "Create New Pack"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the pack. Membership packs define quotas for users.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Pack Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Tounesna Gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (TND)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.priceTND}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceTND: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What's included in this pack?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Pack Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "collection" | "membership") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">Membership (Quotas)</SelectItem>
                      <SelectItem value="collection">Collection (Static)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="active">Active and visible</Label>
                </div>
              </div>

              {formData.type === "membership" && (
                <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Membership Quotas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="module">Module</Label>
                      <Select
                        value={formData.membershipFeatures?.module}
                        onValueChange={(value: "tounesna" | "impact" | "both") =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              module: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tounesna">Tounesna (Photos)</SelectItem>
                          <SelectItem value="impact">Impact (Videos)</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quality">Max Quality</Label>
                      <Select
                        value={formData.membershipFeatures?.quality}
                        onValueChange={(value: "standard" | "hd" | "4k") =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              quality: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="hd">HD (1080p)</SelectItem>
                          <SelectItem value="4k">4K / Ultra HD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="photos">Photos Limit</Label>
                      <Input
                        id="photos"
                        type="number"
                        value={formData.membershipFeatures?.photosLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              photosLimit: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reels">Reels Limit</Label>
                      <Input
                        id="reels"
                        type="number"
                        value={formData.membershipFeatures?.reelsLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              reelsLimit: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="videos">Storytelling Videos</Label>
                      <Input
                        id="videos"
                        type="number"
                        value={formData.membershipFeatures?.videosLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              videosLimit: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docs">Mini-Docs Limit</Label>
                      <Input
                        id="docs"
                        type="number"
                        value={formData.membershipFeatures?.documentariesLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            membershipFeatures: {
                              ...formData.membershipFeatures!,
                              documentariesLimit: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {editingPack ? "Update Pack" : "Create Pack"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pack Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quotas / Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : packs.length > 0 ? (
              packs.map((pack) => (
                <TableRow key={pack._id}>
                  <TableCell className="font-medium">
                    {pack.title}
                    {pack.popular && (
                      <Badge className="ms-2 bg-amber-500 text-white hover:bg-amber-600">
                        Popular
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{pack.type}</TableCell>
                  <TableCell>{pack.priceTND} TND</TableCell>
                  <TableCell>
                    {pack.type === "membership" ? (
                      <div className="text-[10px] space-y-0.5 opacity-70">
                        {pack.membershipFeatures?.photosLimit ? <div>• {pack.membershipFeatures.photosLimit} Photos</div> : null}
                        {pack.membershipFeatures?.reelsLimit ? <div>• {pack.membershipFeatures.reelsLimit} Reels</div> : null}
                        {pack.membershipFeatures?.videosLimit ? <div>• {pack.membershipFeatures.videosLimit} Videos</div> : null}
                        <div>• {pack.membershipFeatures?.quality.toUpperCase()} Quality</div>
                      </div>
                    ) : (
                      <span className="text-sm opacity-70">{pack.photoIds?.length || 0} Photos</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pack.isActive ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(pack)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(pack._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No packs found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

