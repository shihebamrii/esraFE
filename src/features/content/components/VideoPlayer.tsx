"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#1f3a5f] aspect-video shadow-2xl">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1f3a5f]/90 via-[#1f3a5f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay} 
              className="p-2 transition-all hover:scale-110"
              style={{ color: isPlaying ? "#ffffff" : "#ffcc1a" }}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </button>
            <button 
              onClick={toggleMute} 
              className="p-2 transition-all hover:scale-110 text-white/80 hover:text-white"
            >
               {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
          
          <button 
            onClick={toggleFullscreen} 
            className="p-2 transition-all hover:scale-110 text-white/80 hover:text-white"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>

       {/* Centered Play Button when paused */}
       {!isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="p-6 rounded-full shadow-2xl transform scale-100 transition-transform"
              style={{ backgroundColor: "#ffcc1a", color: "#1f3a5f" }}
            >
               <Play className="h-8 w-8 fill-current ml-1" />
            </div>
         </div>
       )}
    </div>
  );
}
