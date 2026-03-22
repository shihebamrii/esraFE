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
  Layers
} from "lucide-react";
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
      const res = await AdminService.getPlaylists({ search });
      setPlaylists(res.data?.playlists || []);
    } catch (e) {
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableContent = async () => {
    try {
      const res = await AdminService.getContent({ limit: 100 });
      setAvailableContent(res.data?.contents || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchAvailableContent();
  }, []);

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      ...playlist,
      items: [...playlist.items].sort((a, b) => a.order - b.order),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await AdminService.deletePlaylist(id);
      toast.success("Playlist deleted");
      fetchPlaylists();
    } catch (e) {
      toast.error("Failed to delete");
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
        toast.success("Playlist updated");
      } else {
        await AdminService.createPlaylist(data);
        toast.success("Playlist created");
      }
      setIsDialogOpen(false);
      fetchPlaylists();
      resetForm();
    } catch (e) {
      toast.error("Failed to save playlist");
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Playlists & Series</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="me-2 h-4 w-4" /> Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlaylist ? "Edit Playlist" : "New Playlist"}</DialogTitle>
              <DialogDescription>Create a series of videos or podcasts for the Impact module.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v: any) => setFormData({...formData, type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="series">Story Series</SelectItem>
                      <SelectItem value="podcast_series">Podcast Series</SelectItem>
                      <SelectItem value="collection">General Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold">Playlist Items</Label>
                  <div className="flex gap-2 w-1/2">
                    <Select onValueChange={addItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add content to playlist..." />
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
                              <Check className="h-4 w-4 rotate-180" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(idx, 'down')} disabled={idx === (formData.items?.length || 0) - 1}>
                              <Check className="h-4 w-4" />
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
                      No items in this playlist yet. Select content above to add.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={v => setFormData({...formData, isActive: v})}
                />
                <Label>Active and visible on Impact module</Label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {editingPlaylist ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Playlist Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell>
              </TableRow>
            ) : playlists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No playlists found</TableCell>
              </TableRow>
            ) : (
              playlists.map((pl) => (
                <TableRow key={pl._id}>
                  <TableCell className="font-medium">{pl.title}</TableCell>
                  <TableCell className="capitalize">{pl.type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      {pl.items.length} items
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pl.isActive ? "default" : "secondary"}>
                      {pl.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pl)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(pl._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
