"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardDescription, FloatingCard } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CreditCard, Mail, User, Lock, Calendar, ShieldCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// No complex algorithm for the card number or expiry format
export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const { items, total, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Define schema inside component or use t() for messages
  const checkoutSchema = z.object({
    fullName: z.string().min(2, t("nameTooShort")),
    email: z.string().email(t("invalidEmail")),
    cardNumber: z.string().min(1, t("cardNumberRequired")),
    expiry: z.string().min(1, t("expiryRequired")),
    cvc: z.string().min(1, t("cvcRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsLoading(true);
    try {
      await api.delete("/cart");

      for (const item of items) {
        await api.post("/cart", {
          type: item.type,
          itemId: item.id,
        });
      }

      const checkoutRes = await api.post("/checkout", {
        billingInfo: {
          name: values.fullName,
          email: values.email,
        },
      });

      const paymentUrl = checkoutRes.data?.data?.payment?.url;
      if (paymentUrl) {
        clearCart();
        window.location.href = paymentUrl;
        return;
      }

      toast.success(t("successMessage"));
      clearCart();
      router.push("/orders");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message || t("failedMessage"));
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 animate-fade-in p-8 glass-subtle rounded-3xl border border-border/50 shadow-subtle">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
               <CreditCard className="w-10 h-10 text-primary" />
             </div>
             <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t("emptyTitle")}</h2>
             <p className="text-muted-foreground text-lg">{t("emptyDescription")}</p>
             <Button onClick={() => router.push("/")} variant="outline" size="lg" className="mt-6 font-medium rounded-full hover-lift">
               {t("returnHome")}
             </Button>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Decorative background elements matching the global theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl -z-10 animate-fade-in" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-3xl -z-10 animate-fade-in" style={{ animationDelay: "0.2s" }} />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl animate-fade-in">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-3">{t("secureCheckout")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("secureDescription")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Payment Form - Left Side */}
          <div className="lg:col-span-3 space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <FloatingCard className="border-0 shadow-floating glass-subtle overflow-hidden">
              <div className="bg-primary p-8 text-primary-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">{t("paymentDetails")}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2 text-primary-foreground/80 font-medium text-sm">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    {t("secureTransaction")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-white/10 backdrop-blur-md rounded shadow-sm border border-white/20 flex items-center justify-center text-xs font-black text-white tracking-widest italic">VISA</div>
                  <div className="w-12 h-8 bg-white/10 backdrop-blur-md rounded shadow-sm border border-white/20 flex items-center justify-center text-xs font-black text-white tracking-widest">MC</div>
                </div>
              </div>
              <CardContent className="p-8">
                 <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="space-y-6">
                      {/* Personal Info */}
                      <h3 className="text-lg font-semibold border-b border-border/50 pb-2 flex items-center gap-2">
                         <User className="w-5 h-5 text-muted-foreground" />
                         Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 group">
                           <label className="text-sm font-semibold text-foreground">{t("fullName")}</label>
                           <div className="relative hover-lift">
                             <Input className="pl-12 h-14 bg-background border-border/60 hover:border-primary/50 focus:border-primary transition-all rounded-xl shadow-sm text-base" placeholder="John Doe" {...register("fullName")} />
                             <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                           </div>
                           {errors.fullName && <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">{errors.fullName.message}</p>}
                        </div>
                        <div className="space-y-2 group">
                           <label className="text-sm font-semibold text-foreground">{t("emailAddress")}</label>
                           <div className="relative hover-lift">
                             <Input className="pl-12 h-14 bg-background border-border/60 hover:border-primary/50 focus:border-primary transition-all rounded-xl shadow-sm text-base" placeholder="john@example.com" {...register("email")} />
                             <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                           </div>
                           {errors.email && <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      {/* Card Info */}
                      <h3 className="text-lg font-semibold border-b border-border/50 pb-2 mt-8 flex items-center gap-2">
                         <CreditCard className="w-5 h-5 text-muted-foreground" />
                         Card Details
                      </h3>
                      <div className="space-y-2 group">
                         <label className="text-sm font-semibold text-foreground">{t("cardNumber")}</label>
                         <div className="relative hover-lift">
                           <Input className="pl-12 h-14 bg-background border-border/60 hover:border-primary/50 focus:border-primary transition-all rounded-xl shadow-sm text-lg font-mono tracking-wider" placeholder="0000 0000 0000 0000" {...register("cardNumber")} />
                           <CreditCard className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         </div>
                         {errors.cardNumber && <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">{errors.cardNumber.message}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2 group">
                            <label className="text-sm font-semibold text-foreground">{t("expiryDate")}</label>
                            <div className="relative hover-lift">
                              <Input className="pl-12 h-14 bg-background border-border/60 hover:border-primary/50 focus:border-primary transition-all rounded-xl shadow-sm text-lg font-mono tracking-widest" placeholder="MM/YY" {...register("expiry")} />
                              <Calendar className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            {errors.expiry && <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">{errors.expiry.message}</p>}
                          </div>
                          <div className="space-y-2 group">
                            <label className="text-sm font-semibold text-foreground">{t("cvc")}</label>
                            <div className="relative hover-lift">
                              <Input type="password" maxLength={4} className="pl-12 h-14 bg-background border-border/60 hover:border-primary/50 focus:border-primary transition-all rounded-xl shadow-sm text-lg font-mono tracking-widest" placeholder="***" {...register("cvc")} />
                              <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            {errors.cvc && <p className="text-destructive text-sm font-medium animate-in slide-in-from-top-1">{errors.cvc.message}</p>}
                          </div>
                      </div>
                    </div>

                 </form>
              </CardContent>
            </FloatingCard>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <FloatingCard className="border-0 shadow-medium glass-subtle sticky top-8 rounded-2xl overflow-hidden">
              <div className="bg-secondary/50 p-8 border-b border-border/50">
                <CardTitle className="text-2xl font-bold flex flex-col">
                   <span>{t("orderSummary")}</span>
                   <span className="text-4xl font-black text-primary mt-4">{total()} TND</span>
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-2 font-medium">{t("orderSummarySubtitle")}</p>
              </div>
              <CardContent className="p-8">
                 <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map(item => (
                     <div key={item.id} className="flex justify-between items-center group hover:bg-secondary/50 p-3 rounded-xl transition-colors border border-transparent hover:border-border/50">
                       <span className="font-semibold text-sm line-clamp-1 flex-1 pr-4 text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
                       <span className="font-bold text-primary whitespace-nowrap bg-primary/5 px-3 py-1 rounded-lg">{item.price} TND</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                      <span>{t("subtotal")}</span>
                      <span className="text-foreground">{total()} TND</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-green-600">
                      <span>{t("shipping")}</span>
                      <span>{t("free")}</span>
                    </div>
                 </div>

                 <Button 
                   form="checkout-form"
                   className="w-full mt-8 h-16 text-xl font-bold shadow-medium hover:shadow-floating transition-all hover:-translate-y-1 rounded-xl" 
                   type="submit" 
                   disabled={isLoading}
                 >
                    {isLoading ? (
                      <Loader2 className="me-3 h-6 w-6 animate-spin" />
                    ) : (
                      <Lock className="me-3 h-6 w-6" />
                    )}
                    {t("payWithAmount", { amount: total() })}
                 </Button>
                 
                 <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground font-medium bg-secondary/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-primary">
                       <ShieldCheck className="w-5 h-5" />
                       <span className="font-semibold text-sm">{t("safeSecurePayment")}</span>
                    </div>
                    <span className="text-center">{t("safeSecureDescription")}</span>
                 </div>
              </CardContent>
            </FloatingCard>
          </div>

        </div>
      </div>
    </div>
  );
}
