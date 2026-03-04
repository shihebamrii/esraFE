import { VideoPlayer } from "@/features/content/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Unlock } from "lucide-react";
import { Link } from "@/i18n/navigation";

// Mock data (in real app, fetch based on props.params.id)
const MOCK_DETAIL = {
    id: "1",
    title: "Discovering the Sahara: A Journey Through Time",
    description: "Experience the majestic beauty of the Tunisian Sahara in this exclusive documentary under 4K resolution. Follow the path of ancient nomads and discover the secrets hidden within the golden dunes.",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample public video
    poster: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1200&auto=format&fit=crop",
    duration: "12:45",
    type: "video" as const,
    isPremium: true,
    category: "Documentary",
    tags: ["Sahara", "Nature", "4K", "Tozeur"],
    author: "CnBees Studios",
    price: 15.00
};

export default async function ImpactDetailsPage({ params }: { params: { id: string } }) {
  // In a real server component, await params
  // const { id } = await params; 
  // For now just use mock
  
  const content = MOCK_DETAIL;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer src={content.videoUrl} poster={content.poster} />
          
          <div>
            <div className="flex items-start justify-between mb-4">
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h1>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">{content.category}</Badge>
                    <span className="text-sm text-muted-foreground">{content.duration}</span>
                  </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="ghost" size="icon">
                   <Share2 className="h-5 w-5" />
                 </Button>
               </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {content.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {content.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="hover:bg-secondary/80">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
             <h3 className="font-semibold text-xl mb-4">Content Access</h3>
             
             {content.isPremium ? (
               <div className="space-y-4">
                 <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 mb-4">
                   <div className="flex items-center gap-2 font-medium mb-1">
                     <Unlock className="h-4 w-4" />
                     Premium Content
                   </div>
                   <p className="text-sm opacity-90">Unlock this video to watch in full quality.</p>
                 </div>
                 
                 <Button className="w-full text-lg py-6" size="lg">
                   Unlock for {content.price} TND
                 </Button>
                 
               </div>
             ) : (
                <Button className="w-full" size="lg" variant="secondary">
                  <Download className="me-2 h-4 w-4" />
                  Download
                </Button>
             )}

             <div className="mt-6 pt-6 border-t">
               <div className="text-sm text-muted-foreground">
                 <p className="mb-2"><strong>Author:</strong> {content.author}</p>
                 <p><strong>License:</strong> Standard Digital License</p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
