import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const PACKS = [
  {
    id: "1",
    title: "Starter Creator Pack",
    price: 49,
    features: ["5 High-Res Photos", "1 HD Video", "Commercial License"],
    popular: false
  },
  {
    id: "2",
    title: "Pro Media Bundle",
    price: 199,
    features: ["50 High-Res Photos", "10 4K Videos", "2 Audio Tracks", "Extended License", "Priority Support"],
    popular: true
  },
  {
    id: "3",
    title: "Enterprise Collection",
    price: 499,
    features: ["Unlimited Access", "ALL Tounesna Photos", "ALL Impact Videos", "Global License", "Custom Edits"],
    popular: false
  }
];

export default function PacksPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
       <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Pack</h1>
          <p className="text-muted-foreground text-xl">Flexible options for developers, creators, and agencies.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PACKS.map(pack => (
             <div key={pack.id} className={`relative flex flex-col p-8 rounded-2xl border ${pack.popular ? 'border-primary shadow-2xl scale-105 bg-card z-10' : 'bg-background shadow-lg border-border'}`}>
                {pack.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1">Best Value</Badge>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{pack.title}</h3>
                <div className="text-4xl font-bold mb-6">{pack.price} <span className="text-lg text-muted-foreground font-normal">TND</span></div>
                
                <ul className="flex-1 space-y-4 mb-8">
                   {pack.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                         <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                           <Check className="h-4 w-4" />
                         </div>
                         <span>{feature}</span>
                      </li>
                   ))}
                </ul>

                <Button size="lg" className="w-full" variant={pack.popular ? "default" : "outline"}>
                   Choose Plan
                </Button>
             </div>
          ))}
       </div>
    </div>
  );
}
