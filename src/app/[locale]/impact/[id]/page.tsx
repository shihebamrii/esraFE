"use client";

import { useState, useEffect, use } from "react";
import { VideoPlayer } from "@/features/content/components/VideoPlayer";
import { Download, Share2, Unlock, ArrowLeft, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ImpactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/contents/${id}`);
        if (response.data?.status === "success") {
          const c = response.data.data.content;
          
          setContent({
            id: c._id,
            title: c.title,
            description: c.description || c.title,
            videoUrl: c.contentUrl || "/Impact.mp4",
            poster: c.thumbnailUrl || "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1200&auto=format&fit=crop",
            duration: formatDuration(c.duration),
            type: c.type || "video",
            isPremium: c.rights !== 'free',
            category: c.type || 'Documentary',
            tags: c.themes && c.themes.length > 0 ? c.themes : ["Impact"],
            author: c.createdBy?.name || "Bee Story Studios",
            price: c.price || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch content details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}>
        <p className="font-bold animate-pulse text-lg py-32">Loading Content...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}>
        <p className="font-bold text-lg py-32">Content not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: "#fff9e6", color: "#1f3a5f" }}
    >
      {/* Top Navigation Bar */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ backgroundColor: "#fff9e6cc", borderColor: "#1f3a5f15" }}
      >
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/impact"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: "#1f3a5f" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Impact
          </Link>
          <span style={{ color: "#1f3a5f30" }}>·</span>
          <span
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#1f3a5f", color: "#ffcc1a" }}
          >
            {content.category}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 25px 60px -15px rgba(31,58,95,0.25)" }}
            >
              <VideoPlayer src={content.videoUrl} poster={content.poster} />
            </motion.div>

            {/* Title & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1
                    className="text-2xl md:text-3xl font-serif font-bold leading-snug mb-2"
                    style={{ color: "#1f3a5f" }}
                  >
                    {content.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm" style={{ color: "#1f3a5f70" }}>
                    <span
                      className="font-bold uppercase tracking-wide text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#ffcc1a20", color: "#1f3a5f" }}
                    >
                      {content.category}
                    </span>
                    <span>·</span>
                    <span>{content.duration}</span>
                    <span>·</span>
                    <span className="capitalize">{content.type}</span>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  className="p-2.5 rounded-full transition-all hover:scale-105"
                  style={{ backgroundColor: "#1f3a5f0d", color: "#1f3a5f" }}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px my-5" style={{ backgroundColor: "#1f3a5f15" }} />

              {/* Description */}
              <p
                className="leading-relaxed text-base"
                style={{ color: "#1f3a5f99" }}
              >
                {content.description}
              </p>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-default"
                    style={{
                      backgroundColor: "#1f3a5f0d",
                      color: "#1f3a5f",
                      border: "1px solid #1f3a5f15",
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" style={{ color: "#ffcc1a" }} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div
              className="rounded-2xl p-6 sticky top-24 shadow-xl"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #1f3a5f12",
                boxShadow: "0 8px 40px -10px rgba(31,58,95,0.15)",
              }}
            >
              {/* Card Header */}
              <h3 className="font-bold text-lg mb-5" style={{ color: "#1f3a5f" }}>
                Content Access
              </h3>

              {content.isPremium ? (
                <div className="space-y-4">
                  {/* Premium Banner */}
                  <div
                    className="p-4 rounded-xl flex items-start gap-3"
                    style={{
                      background: "linear-gradient(135deg, #1f3a5f08 0%, #ffcc1a10 100%)",
                      border: "1px solid #ffcc1a30",
                    }}
                  >
                    <div
                      className="mt-0.5 p-1.5 rounded-lg"
                      style={{ backgroundColor: "#ffcc1a20" }}
                    >
                      <Unlock className="h-4 w-4" style={{ color: "#1f3a5f" }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5" style={{ color: "#1f3a5f" }}>
                        Premium Content
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "#1f3a5f80" }}>
                        Unlock this video to watch in full quality.
                      </p>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="text-center py-2">
                    <span className="text-4xl font-bold" style={{ color: "#1f3a5f" }}>
                      {content.price}
                    </span>
                    <span className="text-lg ml-1 font-medium" style={{ color: "#1f3a5f60" }}>
                      TND
                    </span>
                    <p className="text-xs mt-1" style={{ color: "#1f3a5f50" }}>
                      One-time purchase · Lifetime access
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    style={{
                      backgroundColor: "#1f3a5f",
                      color: "#ffcc1a",
                      boxShadow: "0 4px 20px -5px rgba(31,58,95,0.5)",
                    }}
                  >
                    Unlock Now · {content.price} TND
                  </button>

                  <p className="text-xs text-center" style={{ color: "#1f3a5f40" }}>
                    Secure payment · Instant access
                  </p>
                </div>
              ) : (
                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "#fff9e6",
                    color: "#1f3a5f",
                    border: "2px solid #1f3a5f20",
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Free
                </button>
              )}

              {/* Meta Section */}
              <div
                className="mt-6 pt-5 border-t space-y-3"
                style={{ borderColor: "#1f3a5f10" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#1f3a5f60" }}>Author</span>
                  <span className="font-medium" style={{ color: "#1f3a5f" }}>
                    {content.author}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#1f3a5f60" }}>License</span>
                  <span className="font-medium" style={{ color: "#1f3a5f" }}>
                    Standard Digital
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#1f3a5f60" }}>Duration</span>
                  <span className="font-medium" style={{ color: "#1f3a5f" }}>
                    {content.duration}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
