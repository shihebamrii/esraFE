"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, Camera, Check } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum(["user", "uploader"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "user",
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      
      toast.success(t("welcomeSuccess"));
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("createAccount")}</CardTitle>
        <CardDescription>
          {t("enterDetails")}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("roleLabel")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-accent/50",
                  selectedRole === "user"
                    ? "border-primary bg-accent/50"
                    : "border-muted bg-transparent"
                )}
                onClick={() => setValue("role", "user")}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="relative">
                    <User className="h-8 w-8 text-primary" />
                    {selectedRole === "user" && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{t("userRole")}</span>
                </div>
              </div>

              <div
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-accent/50",
                  selectedRole === "uploader"
                    ? "border-primary bg-accent/50"
                    : "border-muted bg-transparent"
                )}
                onClick={() => setValue("role", "uploader")}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="relative">
                    <Camera className="h-8 w-8 text-primary" />
                    {selectedRole === "uploader" && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{t("photographerRole")}</span>
                </div>
              </div>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("roleDescription")}
            </p>
          </div>

          <div className="space-y-2">
            <Input
              placeholder={t("namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={t("password")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={t("password")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {t("signUpButton")}
          </Button>
          <div className="text-sm text-muted-foreground text-center">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("signInLink")}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
