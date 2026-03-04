"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

export default function UserIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/user/dashboard");
  }, [router]);
  return null;
}
