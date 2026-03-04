"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const MOCK_PHOTOS = [
  { id: 1, title: "Sidi Bou Said", location: "Tunis", price: "15 TND", thumbnail: "https://images.unsplash.com/photo-1566453880482-1a4247502cd5?q=80&w=200&auto=format&fit=crop" },
  { id: 2, title: "Sahara Dunes", location: "Kebili", price: "25 TND", thumbnail: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=200&auto=format&fit=crop" },
  { id: 3, title: "El Jem", location: "Mahdia", price: "20 TND", thumbnail: "https://images.unsplash.com/photo-1532420958197-e81c7e96b301?q=80&w=200&auto=format&fit=crop" },
];

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState(MOCK_PHOTOS);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPhotos = photos.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Photos Management</h2>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button>
                 <Plus className="me-2 h-4 w-4" /> Upload Photo
               </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Upload Photo</DialogTitle>
                  <DialogDescription>Add a new photo to the Tounesna collection.</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label className="text-right">Title</Label>
                     <Input className="col-span-3" placeholder="Photo Title" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label className="text-right">Location</Label>
                     <Input className="col-span-3" placeholder="Governorate / City" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label className="text-right">Price</Label>
                     <Input className="col-span-3" type="number" placeholder="in TND" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label className="text-right">File</Label>
                     <Input className="col-span-3" type="file" accept="image/*" />
                  </div>
               </div>
               <DialogFooter>
                  <Button onClick={() => setIsDialogOpen(false)}>Upload</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPhotos.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                     <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell className="text-right space-x-2">
                   <Button variant="ghost" size="icon">
                     <Pencil className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="text-destructive">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
