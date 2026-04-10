"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  bgColor: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "weak", color: "text-red-500", bgColor: "bg-red-500" };
  if (score <= 3) return { score: 2, label: "fair", color: "text-orange-500", bgColor: "bg-orange-500" };
  if (score <= 4) return { score: 3, label: "good", color: "text-yellow-500", bgColor: "bg-yellow-500" };
  return { score: 4, label: "strong", color: "text-emerald-500", bgColor: "bg-emerald-500" };
}

export function RegisterForm() {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const passwordValue = watch("password", "");

  const passwordChecks = useMemo(() => [
    { key: "minLength", pass: passwordValue.length >= 8 },
    { key: "uppercase", pass: /[A-Z]/.test(passwordValue) },
    { key: "lowercase", pass: /[a-z]/.test(passwordValue) },
    { key: "number", pass: /[0-9]/.test(passwordValue) },
    { key: "special", pass: /[^A-Za-z0-9]/.test(passwordValue) },
  ], [passwordValue]);

  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "user",
      });
      
      localStorage.setItem("show_welcome_modal", "true");
      toast.success(t("welcomePackSuccess"), {
        duration: 5000,
      });
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">{t("createAccount")}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t("enterDetails")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80 ml-1">
            {t("name")}
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={t("namePlaceholder")}
              {...register("name")}
              className="h-12 pl-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-all duration-200"
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">{errors.name.message}</p>
          )}
        </div>

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
              className="h-12 pl-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-all duration-200"
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80 ml-1">
            {t("password")}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
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

          {/* Password strength meter */}
          {passwordValue.length > 0 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Strength bar */}
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        level <= strength.score
                          ? strength.bgColor
                          : "bg-muted-foreground/15"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strength.color} transition-colors duration-300`}>
                  {t(`passwordStrength.${strength.label}`)}
                </p>
              </div>

              {/* Requirements checklist */}
              <div className="grid grid-cols-1 gap-1">
                {passwordChecks.map((check) => (
                  <div
                    key={check.key}
                    className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                      check.pass ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  >
                    {check.pass ? (
                      <Check className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span>{t(`passwordRules.${check.key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80 ml-1">
            {t("confirmPassword")}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="h-12 pl-10 pr-10 bg-muted/50 border-muted-foreground/20 focus:bg-background transition-all duration-200"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button 
          className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all mt-4" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            t("signUpButton")
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4 transition-all">
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
