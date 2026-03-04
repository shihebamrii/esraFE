"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function CartPage() {
  const { items, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any items yet.</p>
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="flex items-center p-4 gap-4">
               <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-muted">
               {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="object-cover w-full h-full" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">No Img</div>
                  )}
               </div>
               
               <div className="flex-1 min-w-0">
                 <h3 className="font-semibold truncate">{item.title}</h3>
                 <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                 <div className="text-lg font-bold mt-1">{item.price} TND</div>
               </div>

               <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(item.id, item.type)}
               >
                 <Trash2 className="h-5 w-5" />
               </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
             <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
             <div className="flex justify-between mb-2">
               <span className="text-muted-foreground">Subtotal</span>
               <span>{total()} TND</span>
             </div>
             <div className="flex justify-between mb-4 pb-4 border-b">
               <span className="text-muted-foreground">Tax (Estimated)</span>
               <span>0.00 TND</span>
             </div>
             <div className="flex justify-between text-xl font-bold mb-6">
               <span>Total</span>
               <span>{total()} TND</span>
             </div>
             
             <Link href="/checkout">
              <Button className="w-full h-12 text-lg" size="lg">
                Proceed to Checkout <ArrowRight className="ms-2 h-5 w-5" />
              </Button>
             </Link>
          </Card>
        </div>

      </div>
    </div>
  );
}
