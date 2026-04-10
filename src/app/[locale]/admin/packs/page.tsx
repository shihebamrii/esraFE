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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("AdminDashboard.packs");
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
      toast.error(t("messages.fetchFailed"));
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
    if (!confirm(t("messages.deleteConfirm"))) return;
    try {
      await AdminService.deletePack(id);
      toast.success(t("messages.deleteSuccess"));
      fetchPacks();
    } catch (error) {
      toast.error(t("messages.deleteFailed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPack) {
        await AdminService.updatePack(editingPack._id, formData);
        toast.success(t("messages.saveSuccess"));
      } else {
        await AdminService.createPack(formData);
        toast.success(t("messages.saveSuccess"));
      }
      setIsDialogOpen(false);
      fetchPacks();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("messages.saveFailed"));
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t("createPack")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingPack ? t("editPack") : t("createPack")}
              </DialogTitle>
              <DialogDescription>
                {t("createDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("form.title")}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder={t("form.titlePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">{t("form.price")}</Label>
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
                <Label htmlFor="description">{t("form.description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("form.descriptionPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("form.type")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "collection" | "membership") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("form.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">{t("form.membership")}</SelectItem>
                      <SelectItem value="collection">{t("form.collection")}</SelectItem>
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
                  <Label htmlFor="active">{t("form.active")}</Label>
                </div>
              </div>

              {formData.type === "membership" && (
                <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">{t("form.quotas")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="module">{t("form.module")}</Label>
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
                          <SelectValue placeholder={t("form.selectModule")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tounesna">{t("form.tounesna")}</SelectItem>
                          <SelectItem value="impact">{t("form.impact")}</SelectItem>
                          <SelectItem value="both">{t("form.both")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quality">{t("form.quality")}</Label>
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
                          <SelectValue placeholder={t("form.selectQuality")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">{t("form.standard")}</SelectItem>
                          <SelectItem value="hd">{t("form.hd")}</SelectItem>
                          <SelectItem value="4k">{t("form.4k")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="photos">{t("form.photosLimit")}</Label>
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
                      <Label htmlFor="reels">{t("form.reelsLimit")}</Label>
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
                      <Label htmlFor="videos">{t("form.videosLimit")}</Label>
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
                      <Label htmlFor="docs">{t("form.docsLimit")}</Label>
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
                  {t("form.cancel")}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {editingPack ? t("editPack") : t("createPack")}
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
              <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.type")}</TableHead>
            <TableHead>{t("table.price")}</TableHead>
            <TableHead>{t("table.quotas")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
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
                  <TableCell className="capitalize">
                    {pack.type === "membership" ? t("form.membership") : t("form.collection")}
                  </TableCell>
                  <TableCell>{pack.priceTND} TND</TableCell>
                  <TableCell>
                    {pack.type === "membership" ? (
                      <div className="text-[10px] space-y-0.5 opacity-70">
                        {pack.membershipFeatures?.photosLimit ? (
                          <div>• {pack.membershipFeatures.photosLimit} {t("table.photos")}</div>
                        ) : null}
                        {pack.membershipFeatures?.reelsLimit ? (
                          <div>• {pack.membershipFeatures.reelsLimit} {t("table.reels")}</div>
                        ) : null}
                        {pack.membershipFeatures?.videosLimit ? (
                          <div>• {pack.membershipFeatures.videosLimit} {t("table.videos")}</div>
                        ) : null}
                        <div>• {pack.membershipFeatures?.quality.toUpperCase()} {t("table.quality")}</div>
                      </div>
                    ) : (
                      <span className="text-sm opacity-70">
                        {pack.photoIds?.length || 0} {t("table.photos")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pack.isActive ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {t("table.active")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        {t("table.inactive")}
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

