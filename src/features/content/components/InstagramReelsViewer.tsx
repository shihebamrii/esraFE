"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, X, Music, Volume2, VolumeX, Play } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";

interface InstagramReelsViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  thumbnail?: string;
  title?: string;
  author?: string;
  likes?: number;
  comments?: number;
  instagramUsername?: string;
}

export function InstagramReelsViewer({
  isOpen,
  onClose,
  videoSrc = "/Impact.mp4", // A fallback or use the passed one
  thumbnail,
  title = "Beautiful Tunisian View",
  author = "@beestory_tn",
  likes = 1240,
  comments = 89,
  instagramUsername,
}: InstagramReelsViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = resolveMediaUrl(videoSrc);
  const resolvedThumbnail = resolveMediaUrl(thumbnail);

  // Auto-play when opened
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setHasError(false);
      const playVideo = async () => {
        try {
          videoRef.current!.currentTime = 0;
          await videoRef.current!.play();
          setIsPlaying(true);
        } catch {
          // Autoplay blocked, try muted
          videoRef.current!.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current!.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
        }
      };
      // Small delay to let the DOM render
      setTimeout(playVideo, 100);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [isOpen, resolvedSrc]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Reel Container */}
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[400px] h-[85vh] md:h-[90vh] bg-black rounded-[32px] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 flex flex-col"
          >
            {/* Dark Gradient Overlay for Top Options */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

            {/* Top Bar inside reel */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-20">
               <span className="text-white font-bold text-lg tracking-wide shadow-sm">Reels</span>
               {/* Mute/Unmute Button */}
               <button
                 onClick={toggleMute}
                 className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
               >
                 {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
               </button>
            </div>

            {/* Video Player */}
            <div className="absolute inset-0 w-full h-full bg-[#111]" onClick={togglePlay}>
              <video
                ref={videoRef}
                poster={resolvedThumbnail}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onError={() => setHasError(true)}
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={resolvedSrc} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                <source src={resolvedSrc} type="video/mp4" />
              </video>

              {/* Play button overlay when paused */}
              {!isPlaying && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center text-white">
                    <p className="text-lg font-bold mb-2">Video Unavailable</p>
                    <p className="text-sm text-white/60">Tap to retry</p>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Gradient Overlay for Bottom Info */}
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-16 p-4 z-20 flex flex-col gap-3">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/50 overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=TN&background=ffcc1a&color=1f3a5f" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm leading-none">{instagramUsername ? `@${instagramUsername}` : author}</span>
                  {instagramUsername ? (
                    <a
                      href={`https://instagram.com/${instagramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-xs border border-white/40 rounded-full px-3 py-1 font-medium bg-transparent hover:bg-white/20 transition-colors"
                    >
                      Follow
                    </a>
                  ) : (
                    <button className="text-white text-xs border border-white/40 rounded-full px-3 py-1 font-medium bg-transparent hover:bg-white/20 transition-colors">
                      Follow
                    </button>
                  )}
                </div>
              </div>

              {/* Title / Description */}
              <p className="text-white/90 text-sm line-clamp-2 pr-4">{title}</p>
              
              {/* Audio tracking */}
              <div className="flex items-center gap-2 text-white/80 mt-1">
                 <Music className="w-4 h-4" />
                 <div className="overflow-hidden w-[150px]">
                    <div className="animate-marquee whitespace-nowrap text-xs">
                       Original Audio - {instagramUsername ? `@${instagramUsername}` : author}
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Side Interaction Bar */}
            <div className="absolute bottom-4 right-2 z-20 flex flex-col items-center gap-6 p-2">
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
                  <Heart className="w-7 h-7 text-white group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                </div>
                <span className="text-white font-semibold text-xs text-shadow-sm">{likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="text-white font-semibold text-xs text-shadow-sm">{comments}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
                  <Share2 className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="text-white font-semibold text-xs text-shadow-sm">Share</span>
              </button>

              <button className="flex flex-col items-center gap-1 mt-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <MoreHorizontal className="w-6 h-6 text-white" />
                </div>
              </button>
              
              {/* Rotating Audio disk */}
              <div className="mt-4 w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden animate-spin-slow">
                 <img src="https://ui-avatars.com/api/?name=TN&background=ffcc1a&color=1f3a5f" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
