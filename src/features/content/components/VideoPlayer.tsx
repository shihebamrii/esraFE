"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveMediaUrl } from "@/lib/media";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  maxPercentage?: number; // 0 to 100
}

export function VideoPlayer({ src, poster, maxPercentage }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Resolve the media URLs to full backend URLs
  const resolvedSrc = resolveMediaUrl(src);
  const resolvedPoster = resolveMediaUrl(poster);

  // Reset state when src changes
  useEffect(() => {
    setHasError(false);
    setShowLimitReached(false);
    setIsPlaying(false);
    setIsLoading(true);
  }, [resolvedSrc]);

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || showLimitReached || hasError) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (err: any) {
      // NotAllowedError = autoplay blocked, user needs to interact
      if (err.name === "NotAllowedError") {
        // Try muted autoplay as fallback
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          // Even muted play failed, just show play button
          setIsPlaying(false);
        }
      } else {
        console.error("Video play error:", err);
        setIsPlaying(false);
      }
    }
  }, [showLimitReached, hasError]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || showLimitReached) return;

    if (hasError) {
      // Retry: reload the video on click
      setHasError(false);
      setIsLoading(true);
      video.load();
      return;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      await attemptPlay();
    }
  }, [isPlaying, showLimitReached, hasError, attemptPlay]);

  const handleTimeUpdate = () => {
    if (videoRef.current && maxPercentage && maxPercentage < 100) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration > 0 && (currentTime / duration) * 100 >= maxPercentage) {
        videoRef.current.pause();
        videoRef.current.currentTime = (duration * maxPercentage) / 100;
        setIsPlaying(false);
        setShowLimitReached(true);
      }
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

  const handleError = () => {
    setHasError(true);
    setIsPlaying(false);
    setIsLoading(false);
    console.error("Video failed to load:", resolvedSrc);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleRetry = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasError(false);
    setIsLoading(true);
    video.load();
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#1f3a5f] aspect-video shadow-2xl">
      <video
        ref={videoRef}
        poster={resolvedPoster}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onCanPlay={handleCanPlay}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
        playsInline
        preload="metadata"
      >
        <source src={resolvedSrc} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
        <source src={resolvedSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && !hasError && !showLimitReached && (
        <div className="absolute inset-0 z-15 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white/30 border-t-[#ffcc1a] rounded-full animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Video Unavailable</h3>
          <p className="text-white/60 text-sm max-w-[280px] mb-6">
            The video failed to load. Please try again.
          </p>
          <Button
            className="bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white font-bold gap-2"
            onClick={handleRetry}
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
      
      {/* Limit Reached Overlay */}
      {showLimitReached && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#ffcc1a] flex items-center justify-center mb-4 shadow-lg shadow-[#ffcc1a]/20">
             <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Preview Limit Reached</h3>
          <p className="text-white/70 text-sm max-w-[280px]">
            Unlock the full version to continue watching this content.
          </p>
          <Button 
            className="mt-6 bg-[#ffcc1a] text-[#1f3a5f] hover:bg-white font-bold"
            onClick={() => window.location.hash = "pricing"}
          >
            Unlock Full Access
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1f3a5f]/90 via-[#1f3a5f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] ${showLimitReached || hasError ? 'hidden' : ''}`}>
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
       {!isPlaying && !showLimitReached && !hasError && !isLoading && (
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
