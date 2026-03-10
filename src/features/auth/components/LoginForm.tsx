"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm() {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      // Backend returns: { status, message, data: { user, accessToken, refreshToken } }
      const { user, accessToken } = response.data.data;
      const token = accessToken; // authStore expects 'token'
      
      login(user, token);
      toast.success(t("welcomeSuccess"));
      
      // Role-based redirect
      if (user.role === 'admin') {
        router.push("/admin/dashboard");
      } else if (user.role === 'user') {
        router.push("/user/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">{t("welcomeBack")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("enterEmail")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className="h-11"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder={t("password")}
            {...register("password")}
            className="h-11"
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          className="w-full h-11 text-sm font-medium" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("signIn")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">{t("noAccount")} </span>
        <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
          {t("signUp")}
        </Link>
      </div>
    </div>
  );
}
