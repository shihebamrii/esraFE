"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const t = useTranslations("Auth");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Left Side - Immersive Visual */}
      <div className="hidden lg:block relative overflow-hidden bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        >
          <source src="/long-hero.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md space-y-8"
          >
            <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Image 
                src="/logo-beestory.png" 
                alt="BeeStory" 
                width={143} 
                height={40} 
                style={{ width: 'auto' }}
                className="brightness-0 invert h-10"
              />
            </div>
            <h2 className="text-5xl font-serif font-bold tracking-tight leading-tight">
              {t("exploreUnseen")}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
            <p className="text-xl text-white/80 font-light leading-relaxed">
              {t("joinPlatform")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 relative">
        <div className="lg:hidden mb-12">
          <Image 
            src="/logo-beestory.png" 
            alt="BeeStory" 
            width={143} 
            height={40} 
            style={{ width: 'auto' }}
            className="h-10"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[400px]"
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
