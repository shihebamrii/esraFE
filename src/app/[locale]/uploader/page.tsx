"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function UploaderIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/uploader/dashboard");
  }, [router]);
  return null;
}
