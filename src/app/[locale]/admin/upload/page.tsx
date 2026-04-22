"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadVideoForm } from "@/features/admin/components/UploadVideoForm";
import { UploadPhotoForm } from "@/features/admin/components/UploadPhotoForm";
import { Video, ImageIcon } from "lucide-react";

export default function AdminUploadPage() {
  const t = useTranslations("AdminDashboard.upload");
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  // If coming from impact (content), default to video tab; if from tounesna (photos), default to photo tab
  const defaultTab = section === "impact" ? "video" : "photo";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (section === "impact") {
      setActiveTab("video");
    } else if (section === "tounesna") {
      setActiveTab("photo");
    }
  }, [section]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6">
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t("photoTab")}
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            {t("videoTab")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photo">
          <UploadPhotoForm />
        </TabsContent>
        <TabsContent value="video">
          <UploadVideoForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
