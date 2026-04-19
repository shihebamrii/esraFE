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
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Video, 
  Loader2, 
  X, 
  Check, 
  GripVertical,
  ChevronUp,
  ChevronDown,
  Layers
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PlaylistItem {
  contentId: string;
  order: number;
  title?: string;
  type?: string;
}

interface Playlist {
  _id: string;
  title: string;
  description: string;
  type: "series" | "collection" | "podcast_series";
  items: PlaylistItem[];
  isActive: boolean;
  themes: string[];
  region: string;
  tags: string[];
  thumbnailFileId?: string;
}

export default function AdminPlaylistsPage() {
  const t = useTranslations("AdminDashboard.playlists");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [availableContent, setAvailableContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Playlist>>({
    title: "",
    description: "",
    type: "series",
    items: [],
    isActive: true,
    themes: [],
    region: "",
    tags: [],
  });

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getPlaylists();
      setPlaylists(res.data?.playlists || []);
    } catch (e) {
      toast.error(t("messages.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableContent = async () => {
    try {
      const res = await AdminService.getContent({ limit: 100 });
      setAvailableContent(res.data?.contents || []);
    } catch (e) {
      toast.error(t("messages.contentFailed"));
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchAvailableContent();
  }, []);

  // Client-side filtering for playlists
  const filteredPlaylists = playlists.filter((pl) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;
    return (
      pl.title.toLowerCase().includes(searchTerm) ||
      pl.description.toLowerCase().includes(searchTerm) ||
      pl.type.toLowerCase().includes(searchTerm)
    );
  });

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      ...playlist,
      items: [...playlist.items].sort((a, b) => a.order - b.order),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("messages.deleteConfirm"))) return;
    try {
      await AdminService.deletePlaylist(id);
      toast.success(t("messages.deleteSuccess"));
      fetchPlaylists();
    } catch (e) {
      toast.error(t("messages.deleteFailed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...formData,
        // Ensure order is correct
        items: formData.items?.map((item, idx) => ({ ...item, order: idx }))
      };

      if (editingPlaylist) {
        await AdminService.updatePlaylist(editingPlaylist._id, data);
        toast.success(t("messages.saveSuccess"));
      } else {
        await AdminService.createPlaylist(data);
        toast.success(t("messages.saveSuccess"));
      }
      setIsDialogOpen(false);
      fetchPlaylists();
      resetForm();
    } catch (e) {
      toast.error(t("messages.saveFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingPlaylist(null);
    setFormData({
      title: "",
      description: "",
      type: "series",
      items: [],
      isActive: true,
      themes: [],
      region: "",
      tags: [],
    });
  };

  const addItem = (contentId: string) => {
    const content = availableContent.find(c => c._id === contentId);
    if (!content) return;
    
    if (formData.items?.some(i => i.contentId === contentId)) {
      toast.error("Item already in playlist");
      return;
    }

    setFormData({
      ...formData,
      items: [
        ...(formData.items || []),
        { 
          contentId, 
          order: (formData.items?.length || 0),
          title: content.title,
          type: content.type
        }
      ]
    });
  };

  const removeItem = (contentId: string) => {
    setFormData({
      ...formData,
      items: formData.items?.filter(i => i.contentId !== contentId)
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!formData.items) return;
    const newItems = [...formData.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder", { defaultValue: "Search playlists..." })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingPlaylist(null);
                setIsDialogOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("createPlaylist")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlaylist ? t("editPlaylist") : t("createPlaylist")}</DialogTitle>
              <DialogDescription>{t("form.descriptionPlaceholder")}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.title")}</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder={t("form.titlePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.type")}</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v: any) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="series">{t("form.series")}</SelectItem>
                      <SelectItem value="podcast_series">{t("form.podcast")}</SelectItem>
                      <SelectItem value="collection">{t("form.collection")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("form.description")}</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder={t("form.descriptionPlaceholder")}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold">{t("form.content")}</Label>
                  <div className="flex gap-2 w-1/2">
                    <Select onValueChange={addItem}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectContent")} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableContent.map(c => (
                          <SelectItem key={c._id} value={c._id}>
                            [{c.type}] {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg divide-y bg-muted/20">
                  {formData.items && formData.items.length > 0 ? (
                    formData.items.map((item, idx) => {
                      const content = availableContent.find(c => c._id === item.contentId) || item;
                      return (
                        <div key={item.contentId} className="flex items-center gap-4 p-3 group">
                          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{content.title}</p>
                            <Badge variant="secondary" className="text-[10px] h-4">{content.type}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(idx, 'up')} disabled={idx === 0}>
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(idx, 'down')} disabled={idx === (formData.items?.length || 0) - 1}>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.contentId)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm italic">
                      {t("form.noItems", { defaultValue: "No items in this playlist yet. Select content above to add." })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={v => setFormData({...formData, isActive: v})}
                />
                <Label>{t("form.active")}</Label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-amber-600 hover:bg-amber-700 text-white">
                  {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {editingPlaylist ? t("editPlaylist") : t("createPlaylist")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">{t("table.name")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.items")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead className="text-right pr-6">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell>
              </TableRow>
            ) : filteredPlaylists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {search ? t("messages.noSearchResults", { defaultValue: "No playlists found matching your search." }) : t("messages.noPlaylists", { defaultValue: "No playlists found" })}
                </TableCell>
              </TableRow>
            ) : (
              filteredPlaylists.map((pl) => (
                <TableRow key={pl._id}>
                  <TableCell className="pl-6 font-medium">{pl.title}</TableCell>
                  <TableCell className="capitalize">{pl.type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      {pl.items?.length || 0} {t("table.items")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={pl.isActive ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground"}>
                      {pl.isActive ? t("table.active") : t("table.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(pl)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(pl._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
