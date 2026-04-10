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
import { useTranslations } from "next-intl";
import { ShieldAlert, User } from "lucide-react";

export default function AdminContentPage() {
  const t = useTranslations("AdminDashboard.content");
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
      toast.error(t("messages.fetchFailed"));
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
      toast.success(t("messages.approveSuccess", { status: t(`table.${status}`) }));
      fetchContents();
    } catch (e) {
      console.error(e);
      toast.error(t("messages.approveFailed", { status: t(`table.${status}`) }));
    }
  };

  const filteredContent = contents.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const officialContent = filteredContent.filter(c => c.createdBy?.role === 'admin');
  const communityContent = filteredContent.filter(c => c.createdBy?.role !== 'admin');

  const pendingContent = communityContent.filter(c => c.approvalStatus === 'pending');
  const approvedContent = communityContent.filter(c => (!c.approvalStatus || c.approvalStatus === 'approved'));
  const rejectedContent = communityContent.filter(c => c.approvalStatus === 'rejected');

  const ContentTable = ({ data, showApprovalActions = false }: { data: any[], showApprovalActions?: boolean }) => (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
            <TableRow>
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.user")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.date")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                {t("table.noContent")}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium truncate max-w-[200px]">{item.title}</TableCell>
                <TableCell>{item.createdBy?.name || t("table.unknown")}</TableCell>

                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${ 
                    (item.approvalStatus || 'approved') === 'approved' ? 'text-green-600 border-green-200 bg-green-50' : 
                    item.approvalStatus === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' : 
                    'text-amber-600 border-amber-200 bg-amber-50'
                  }`}>
                    {item.approvalStatus || 'approved'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {showApprovalActions ? (
                      <>
                        <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApprove(item._id, 'approved')}>
                          <CheckCircle className="mr-2 h-4 w-4" /> {t("table.approve")}
                        </Button>
                        <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleApprove(item._id, 'rejected')}>
                          <XCircle className="mr-2 h-4 w-4" /> {t("table.reject")}
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {t("addContent", { defaultValue: "Add Content" })}
        </Button>
      </div>

      <Tabs
        defaultValue="official"
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="official" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              {t("tabs.official")}
              <Badge variant="secondary" className="ml-1">{officialContent.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("tabs.community")}
              {pendingContent.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingContent.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <TabsContent value="official" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("officialDescription")}</p>
            </div>
            {loading ? <div>{t("loading")}</div> : <ContentTable data={officialContent} />}
          </TabsContent>

        <TabsContent value="community" className="mt-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.pending")}</h3>
                  <Badge variant="destructive" className="ml-1">{pendingContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={pendingContent} showApprovalActions={true} />
                )}
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.approved")}</h3>
                  <Badge variant="secondary" className="ml-1">{approvedContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={approvedContent} />
                )}
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-lg font-semibold">{t("tabs.rejected")}</h3>
                  <Badge variant="secondary" className="ml-1">{rejectedContent.length}</Badge>
                </div>
                {loading ? (
                  <div>{t("loading")}</div>
                ) : (
                  <ContentTable data={rejectedContent} />
                )}
              </div>
            </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}
