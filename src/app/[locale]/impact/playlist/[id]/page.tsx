"use client";

import { useState, useEffect, use } from "react";
import { VideoPlayer } from "@/features/content/components/VideoPlayer";
import { ArrowLeft, Play, List, ChevronRight, ChevronLeft, Clock, Share2, Download, Unlock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/playlists/${id}`);
        if (response.data?.status === "success") {
          setPlaylist(response.data.data.playlist);
        }
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}>
        <p className="font-bold animate-pulse text-lg py-32">Loading Series...</p>
      </div>
    );
  }

  if (!playlist || !playlist.items || playlist.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}>
        <div className="text-center">
          <p className="font-bold text-lg mb-4">Series not found or empty.</p>
          <Link href="/impact">
            <button className="px-6 py-2 bg-[#1f3a5f] text-white rounded-full">Back to Impact</button>
          </Link>
        </div>
      </div>
    );
  }

  const currentItem = playlist.items[currentVideoIndex]?.contentId;
  const nextItem = playlist.items[currentVideoIndex + 1]?.contentId;

  const handleNext = () => {
    if (currentVideoIndex < playlist.items.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}>
      {/* Top Nav */}
      <div className="sticky top-0 z-30 backdrop-blur-md border-b bg-[#fff9e6cc] border-[#1f3a5f15]">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/impact" className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-[#1f3a5f30]">|</span>
            <span className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{playlist.title}</span>
          </div>
          <Badge variant="outline" className="bg-[#1f3a5f] text-[#ffcc1a] border-none px-3 py-1 uppercase tracking-tighter text-[10px]">
            {playlist.type.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Player Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl bg-black group">
               <VideoPlayer 
                  key={currentItem?._id}
                  src={resolveMediaUrl(currentItem?.contentUrl) || "/Impact.mp4"}
                  poster={resolveMediaUrl(currentItem?.thumbnailUrl) || "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1200&auto=format&fit=crop"}
                  maxPercentage={10}
               />
               
               {/* Overlay Navigation */}
               <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={handlePrev} 
                    disabled={currentVideoIndex === 0}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all pointer-events-auto disabled:opacity-30"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={currentVideoIndex === playlist.items.length - 1}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all pointer-events-auto disabled:opacity-30"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">{currentItem?.title}</h1>
                    <div className="flex items-center gap-4 text-sm opacity-60">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDuration(currentItem?.duration)}</span>
                      <span>Part {currentVideoIndex + 1} of {playlist.items.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-[#1f3a5f20] hover:bg-[#1f3a5f05]">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => {
                        if (currentItem?.contentUrl) {
                          const downloadUrl = currentItem.contentUrl.startsWith('/api/media/') 
                            ? `${currentItem.contentUrl}/download` 
                            : currentItem.contentUrl;
                          window.open(downloadUrl, '_blank');
                        }
                      }}
                      className="bg-[#1f3a5f] text-white hover:bg-[#1f3a5f]/90 rounded-full px-6 h-12 shadow-lg shadow-[#1f3a5f20]"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download Episode
                    </Button>
                  </div>
               </div>
               
               <p className="text-lg leading-relaxed text-[#1f3a5f]/80 font-light">
                 {currentItem?.description || "No description available for this episode."}
               </p>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="space-y-6">
            <div className="bg-white/40 backdrop-blur-xl rounded-[32px] p-6 border border-white/60 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-[#ffcc1a] flex items-center justify-center">
                    <List className="h-5 w-5 text-[#1f3a5f]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold">Series Content</h2>
               </div>

               <div className="space-y-3">
                  {playlist.items.map((item: any, idx: number) => {
                    const isActive = idx === currentVideoIndex;
                    return (
                      <button
                        key={item.contentId?._id}
                        onClick={() => setCurrentVideoIndex(idx)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 text-left group ${
                          isActive 
                            ? 'bg-[#1f3a5f] text-white shadow-lg' 
                            : 'hover:bg-white/60'
                        }`}
                      >
                        <div className="relative h-16 w-24 shrink-0 rounded-xl overflow-hidden shadow-md">
                          <img 
                            src={resolveMediaUrl(item.contentId?.thumbnailUrl) || "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=400&auto=format&fit=crop"} 
                            alt={item.contentId?.title}
                            className="h-full w-full object-cover"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-[#1f3a5f]/40 flex items-center justify-center">
                              <Play className="h-6 w-6 text-[#ffcc1a] fill-current" />
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[8px] text-white">
                            {formatDuration(item.contentId?.duration)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-[#1f3a5f]'}`}>
                            {idx + 1}. {item.contentId?.title}
                          </p>
                          <p className={`text-[10px] mt-1 opacity-60 uppercase tracking-tighter ${isActive ? 'text-white' : 'text-[#1f3a5f]'}`}>
                            {item.contentId?.type}
                          </p>
                        </div>
                      </button>
                    );
                  })}
               </div>
            </div>

            {nextItem && (
               <div className="p-6 rounded-[32px] bg-[#1f3a5f] text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc1a]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-[10px] uppercase tracking-widest text-[#ffcc1a] mb-2">Up Next</p>
                  <h4 className="font-serif font-bold mb-4 line-clamp-2">{nextItem.title}</h4>
                  <Button 
                    onClick={handleNext}
                    variant="elegant" 
                    className="w-full bg-white text-[#1f3a5f] hover:bg-[#ffcc1a] border-none"
                  >
                    Play Next Episode
                  </Button>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, variant, size, className, onClick, disabled }: any) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    elegant: "bg-primary text-primary-foreground shadow-md hover:translate-y-[-1px] hover:shadow-lg transition-all duration-300",
  };
  const sizes = {
    icon: "h-9 w-9",
    default: "h-9 px-4 py-2"
  };
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant as keyof typeof variants] || ""} ${sizes[size as keyof typeof sizes] || ""} ${className}`}
    >
      {children}
    </button>
  );
}
