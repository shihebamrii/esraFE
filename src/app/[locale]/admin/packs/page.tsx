"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_PACKS = [
  { id: 1, name: "Starter Creator Pack", price: "49 TND", items: 6, popular: false },
  { id: 2, name: "Pro Media Bundle", price: "199 TND", items: 62, popular: true },
  { id: 3, name: "Enterprise Collection", price: "499 TND", items: "Unlimited", popular: false },
];

export default function AdminPacksPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Packs Management</h2>
          <Button>
             <Plus className="me-2 h-4 w-4" /> Create Pack
          </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pack Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Content Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {MOCK_PACKS.map(pack => (
               <TableRow key={pack.id}>
                  <TableCell className="font-medium">
                    {pack.name}
                    {pack.popular && <Badge className="ms-2 bg-amber-500 text-white hover:bg-amber-600">Popular</Badge>}
                  </TableCell>
                  <TableCell>{pack.price}</TableCell>
                  <TableCell>{pack.items}</TableCell>
                  <TableCell><Badge variant="outline">Active</Badge></TableCell>
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
