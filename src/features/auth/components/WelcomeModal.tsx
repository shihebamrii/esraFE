"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Video, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Auth");
  const router = useRouter();

  useEffect(() => {
    // Check if we should show the welcome modal (set during registration)
    const showWelcome = localStorage.getItem("show_welcome_modal");
    if (showWelcome === "true") {
      setIsOpen(true);
      localStorage.removeItem("show_welcome_modal");
    }
  }, []);

  const handleExplore = () => {
    setIsOpen(false);
    router.push("/impact");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white rounded-[2rem] border-none shadow-2xl overflow-hidden p-0">
        <div className="relative h-32 bg-gradient-to-br from-[#1f3a5f] to-[#2a4a75] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M40 0L50 10L40 20L30 10Z'/%3E%3Cpath d='M40 60L50 70L40 80L30 70Z'/%3E%3Cpath d='M0 40L10 30L20 40L10 50Z'/%3E%3Cpath d='M60 40L70 30L80 40L70 50Z'/%3E%3C/g%3E%3C/svg%3E")`,
               }}
          />
          <div className="bg-[#ffcc1a] p-4 rounded-full shadow-lg relative z-10 animate-bounce">
            <Gift className="h-8 w-8 text-[#1f3a5f]" />
          </div>
        </div>
        
        <div className="p-8 text-center">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-serif text-[#1f3a5f] text-center flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-[#ffcc1a]" />
              Welcome to the Vision!
            </DialogTitle>
            <DialogDescription className="text-base text-[#1f3a5f]/60 pt-2 text-center">
              We've added a special gift to your account to get you started.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#fff9e6] rounded-2xl p-6 mb-8 border border-[#ffcc1a]/20">
            <div className="flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-xl bg-[#1f3a5f] flex items-center justify-center shrink-0">
                <Video className="h-6 w-6 text-[#ffcc1a]" />
              </div>
              <div>
                <h4 className="font-bold text-[#1f3a5f]">1 Free Impact Video</h4>
                <p className="text-xs text-[#1f3a5f]/60">Use your credit to download any professional storytelling video or reel.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm text-[#1f3a5f]/80 justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Automatically added to your dashboard</span>
             </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 sm:justify-center">
          <Button 
            onClick={handleExplore}
            className="w-full h-14 rounded-2xl bg-[#1f3a5f] hover:bg-[#2a4a75] text-white font-bold shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            Start Exploring Impact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
