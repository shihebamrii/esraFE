"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_CONTENT = [
  { id: 1, title: "Discovering the Sahara", category: "Documentary", status: "Published", type: "Video" },
  { id: 2, title: "Tunis Medina Crafts", category: "Culture", status: "Published", type: "Video" },
  { id: 3, title: "Podcast: Future of Tourism", category: "Tech", status: "Draft", type: "Audio" },
];

export default function AdminContentPage() {
  const [contents, setContents] = useState(MOCK_CONTENT);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter content
  const filteredContent = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button>
                 <Plus className="me-2 h-4 w-4" /> Add Content
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Add New Content</DialogTitle>
                  <DialogDescription>
                    Upload a new video, audio, or article to the Impact platform.
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="title" className="text-right">Title</Label>
                     <Input id="title" placeholder="Content title" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="category" className="text-right">Category</Label>
                     <Input id="category" placeholder="e.g. Documentary" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="file" className="text-right">File</Label>
                     <Input id="file" type="file" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="desc" className="text-right">Desc</Label>
                     <Textarea id="desc" placeholder="Short description..." className="col-span-3" />
                  </div>
               </div>
               <DialogFooter>
                  <Button type="submit" onClick={() => setIsDialogOpen(false)}>Upload</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search content..."
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
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Published' ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </TableCell>
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
