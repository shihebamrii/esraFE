"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const { user, accessToken } = response.data.data;
      login(user, accessToken);
      toast.success(t("welcomeSuccess"));
      
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
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">{t("welcomeBack")}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t("enterEmail")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
              autoComplete="email"
              className="h-12 pl-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-semibold text-foreground/80">
              {t("password")}
            </label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              autoComplete="current-password"
              className="h-12 pl-10 pr-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            t("signIn")
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4 transition-all">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
