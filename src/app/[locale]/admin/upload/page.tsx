"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadVideoForm } from "@/features/admin/components/UploadVideoForm";
import { UploadPhotoForm } from "@/features/admin/components/UploadPhotoForm";
import { Video, ImageIcon } from "lucide-react";

export default function AdminUploadPage() {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Content</h2>
        <p className="text-muted-foreground mt-2">
          Add new Impact videos or Tounesna photos directly to the platform.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Impact (Video)
          </TabsTrigger>
          <TabsTrigger value="photo" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Tounesna (Photo)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Impact Video Details</CardTitle>
              <CardDescription>
                Upload a new video for the Impact section. Videos will be public immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadVideoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo" className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Tounesna Photo Details</CardTitle>
              <CardDescription>
                Upload a new photo for the Tounesna section. Photos will be public immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadPhotoForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
