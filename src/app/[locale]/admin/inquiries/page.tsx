"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Mail, MessageSquare, Trash2, Eye, Reply, Search } from "lucide-react";
import { format } from "date-fns";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  adminNotes?: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;
    return (
      inquiry.name.toLowerCase().includes(searchTerm) ||
      inquiry.email.toLowerCase().includes(searchTerm) ||
      inquiry.subject.toLowerCase().includes(searchTerm) ||
      inquiry.message.toLowerCase().includes(searchTerm) ||
      inquiry.status.toLowerCase().includes(searchTerm)
    );
  });

  const fetchInquiries = async () => {
    try {
      const response = await api.get("/admin/inquiries");
      if (response.data.status === 'success') {
        setInquiries(response.data.data.inquiries);
      }
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      const response = await api.patch(`/admin/inquiries/${id}`, { status, adminNotes });
      
      if (response.data.status === 'success') {
        toast.success("Inquiry updated");
        fetchInquiries();
        setSelectedInquiry(null);
      }
    } catch (error) {
      toast.error("Failed to update inquiry");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await api.delete(`/admin/inquiries/${id}`);
      
      if (response.status === 204 || response.data?.status === 'success') {
        toast.success("Inquiry deleted");
        fetchInquiries();
      }
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'read': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Read</Badge>;
      case 'replied': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Replied</Badge>;
      case 'archived': return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1f3a5f]">Messages</h1>
          <p className="text-[#1f3a5f]/60">Manage messages sent from the contact form.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#1f3a5f]/5 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#fff9e6]/50">
            <TableRow>
              <TableHead className="font-bold">Sender</TableHead>
              <TableHead className="font-bold">Subject</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading messages...</TableCell>
              </TableRow>
            ) : filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  {search ? "No messages found matching your search." : "No messages found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1f3a5f]">{inquiry.name}</span>
                      <span className="text-xs text-[#1f3a5f]/50">{inquiry.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-medium">{inquiry.subject}</TableCell>
                  <TableCell className="text-sm text-[#1f3a5f]/60">
                    {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setAdminNotes(inquiry.adminNotes || "");
                          if (inquiry.status === 'pending') {
                            handleUpdateStatus(inquiry._id, 'read');
                          }
                        }}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(inquiry._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl rounded-3xl">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#ffcc1a] flex items-center justify-center text-[#1f3a5f]">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">{selectedInquiry.subject}</DialogTitle>
                    <DialogDescription>
                      From: {selectedInquiry.name} ({selectedInquiry.email})
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-[#1f3a5f] whitespace-pre-wrap leading-relaxed">
                    {selectedInquiry.message}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#1f3a5f]/70 ml-1">Admin Notes</label>
                  <Textarea 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                    className="min-h-[100px] rounded-2xl border-[#1f3a5f]/10"
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 mr-auto">
                   <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedInquiry._id, 'replied')}
                    disabled={isUpdating}
                    className="rounded-xl border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Reply size={16} className="mr-2" /> Mark as Replied
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedInquiry._id, 'archived')}
                    disabled={isUpdating}
                    className="rounded-xl"
                  >
                    Archive
                  </Button>
                </div>
                <Button 
                  onClick={() => handleUpdateStatus(selectedInquiry._id, selectedInquiry.status)}
                  disabled={isUpdating}
                  className="rounded-xl bg-[#1f3a5f]"
                >
                  Save Notes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
