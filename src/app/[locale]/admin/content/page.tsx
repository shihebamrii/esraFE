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
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AdminService } from "@/features/admin/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminContentPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getContent({ limit: 100 });
      setContents(res.data?.contents || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load content");
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
      toast.success(`Content ${status} successfully`);
      fetchContents();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${status} content`);
    }
  };

  const filteredContent = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const pendingContent = filteredContent.filter(c => c.approvalStatus === 'pending');
  const approvedContent = filteredContent.filter(c => (!c.approvalStatus || c.approvalStatus === 'approved'));
  const rejectedContent = filteredContent.filter(c => c.approvalStatus === 'rejected');

  const ContentTable = ({ data, showApprovalActions = false }: { data: any[], showApprovalActions?: boolean }) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No content found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium truncate max-w-[200px]">{item.title}</TableCell>
                <TableCell>{item.createdBy?.name || 'Unknown'}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>
                  <Badge variant={item.approvalStatus === 'approved' ? "default" : "secondary"}>
                    {item.approvalStatus || 'approved'}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(item.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-right space-x-2">
                  {showApprovalActions ? (
                    <>
                      <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApprove(item._id, 'approved')}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleApprove(item._id, 'rejected')}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
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

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock className="h-4 w-4" /> Pending Approvals 
            <Badge variant="secondary" className="ml-1">{pendingContent.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex gap-2">
            <CheckCircle className="h-4 w-4" /> Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex gap-2">
            <XCircle className="h-4 w-4" /> Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {loading ? <div>Loading...</div> : <ContentTable data={pendingContent} showApprovalActions={true} />}
        </TabsContent>
        <TabsContent value="approved">
          {loading ? <div>Loading...</div> : <ContentTable data={approvedContent} />}
        </TabsContent>
        <TabsContent value="rejected">
          {loading ? <div>Loading...</div> : <ContentTable data={rejectedContent} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
