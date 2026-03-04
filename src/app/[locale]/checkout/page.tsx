"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  cardNumber: z.string().min(16).max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cvc: z.string().min(3).max(4),
});

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      // 1. Clear the server-side cart first to avoid duplicates
      await api.delete("/cart");

      // 2. Sync frontend cart items to the backend Cart
      for (const item of items) {
        await api.post("/cart", {
          type: item.type,
          itemId: item.id,
        });
      }

      // 3. Create the order via the checkout endpoint
      const checkoutRes = await api.post("/checkout", {
        billingInfo: {
          name: values.fullName,
          email: values.email,
        },
      });

      // 4. Auto-complete mock payment (dev mode)
      const paymentUrl = checkoutRes.data?.data?.payment?.url;
      if (paymentUrl) {
        await fetch(paymentUrl);
      }

      toast.success("Payment successful! Order placed.");
      clearCart();
      router.push("/orders");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Payment failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
      // Redirect handled or just show minimal
      return <div>Cart is empty</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Card>
          <CardHeader>
             <CardTitle>Total: {total()} TND</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-2 text-sm text-muted-foreground">
               {items.map(item => (
                 <li key={item.id} className="flex justify-between">
                   <span>{item.title}</span>
                   <span>{item.price} TND</span>
                 </li>
               ))}
             </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                   <Input placeholder="Full Name on Card" {...register("fullName")} />
                   {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                </div>
                 <div className="space-y-2">
                   <Input placeholder="Email Receipt" {...register("email")} />
                   {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>
                 <div className="space-y-2">
                   <Input placeholder="Card Number (0000 0000 0000 0000)" {...register("cardNumber")} />
                   {errors.cardNumber && <p className="text-destructive text-sm">{errors.cardNumber.message}</p>}
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Input placeholder="MM/YY" {...register("expiry")} />
                      {errors.expiry && <p className="text-destructive text-sm">{errors.expiry.message}</p>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input placeholder="CVC" {...register("cvc")} />
                      {errors.cvc && <p className="text-destructive text-sm">{errors.cvc.message}</p>}
                    </div>
                </div>

                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                   {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                   Pay {total()} TND
                </Button>
             </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
