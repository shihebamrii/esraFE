import { LoginForm } from "@/features/auth/components/LoginForm";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visual */}
      <div className="hidden lg:block relative bg-muted">
        <div 
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-serif font-bold mb-4">{t("exploreUnseen")}</h2>
            <p className="text-lg text-white/90">{t("joinPlatform")}</p>
          </div>
        </div>
        <div className="absolute top-8 left-8">
           <Link href="/" className="font-bold text-xl text-white tracking-tight">CnBees</Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
