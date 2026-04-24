"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MasonryGrid } from "@/features/photos/components/MasonryGrid";
import { PhotoService, Photo } from "@/features/photos/api";
import { resolveMediaUrl } from "@/lib/media";
import { api } from "@/lib/api";
import { Loader2, ArrowLeft, Image as ImageIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function UserProfilePage() {
  const t = useTranslations("UserProfile");
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [userRes, photosRes] = await Promise.all([
          api.get(`/auth/users/${userId}`),
          PhotoService.getPhotos({ userId, limit: 100 })
        ]);

        if (userRes.data?.status === "success") {
          setUser(userRes.data.data.user);
        }

        if (photosRes?.status === "success") {
          setPhotos(photosRes.data.photos);
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const adaptedPhotos = photos.map(p => ({
    id: p._id,
    title: p.title,
    url: resolveMediaUrl(p.previewUrl),
    location: p.governorate,
    price: p.priceTND,
    width: 800,
    height: 800 + (Math.random() * 400),
    gov: p.governorate,
    mediaType: p.mediaType,
    type: p.landscapeType,
    source: p.source || 'community',
    creatorName: p.creatorName,
    creatorId: p.createdBy,
  }));

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const getProfilePictureUrl = () => {
    if (user?.profilePictureFileId) {
      return `/api/media/${user.profilePictureFileId}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9e6] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#ffcc1a]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff9e6] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-[#6a0d2e] mb-4">{t('notFound')}</h1>
        <Button onClick={() => router.back()} variant="outline" className="text-[#6a0d2e] border-[#6a0d2e]">
          {t('goBack')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9e6] text-[#6a0d2e] font-sans selection:bg-[#ffcc1a] selection:text-[#fff9e6]">
      {/* Global Zellige texture layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%236a0d2e' stroke-width='0.4'%3E%3Cpath d='M60 0L75 15L60 30L45 15Z'/%3E%3Cpath d='M60 90L75 105L60 120L45 105Z'/%3E%3Cpath d='M0 60L15 45L30 60L15 75Z'/%3E%3Cpath d='M90 60L105 45L120 60L105 75Z'/%3E%3Cpath d='M60 30L75 45L60 60L45 45Z'/%3E%3Cpath d='M60 60L75 75L60 90L45 75Z'/%3E%3Cpath d='M30 60L45 45L60 60L45 75Z'/%3E%3Cpath d='M60 60L75 45L90 60L75 75Z'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='0' cy='0' r='5'/%3E%3Ccircle cx='120' cy='0' r='5'/%3E%3Ccircle cx='0' cy='120' r='5'/%3E%3Ccircle cx='120' cy='120' r='5'/%3E%3Cpath d='M30 0L60 30L90 0'/%3E%3Cpath d='M30 120L60 90L90 120'/%3E%3Cpath d='M0 30L30 60L0 90'/%3E%3Cpath d='M120 30L90 60L120 90'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      <div className="relative z-10 w-full pt-20 px-6 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8 hover:bg-[#6a0d2e]/10 text-[#6a0d2e] gap-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>

          {/* User Profile Header */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-[0_10px_40px_rgba(106,13,46,0.06)] flex flex-col md:flex-row items-center gap-8 mb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffcc1a]/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6a0d2e]/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
             
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-[#6a0d2e] to-[#8b1c4a] flex items-center justify-center text-white text-4xl font-serif">
                {getProfilePictureUrl() ? (
                  <img
                    src={getProfilePictureUrl()!}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
              {user.role === 'admin' && (
                <div className="absolute bottom-0 right-0 bg-[#ffcc1a] text-[#6a0d2e] p-2 rounded-full border-2 border-white shadow-lg" title={t('officialContributor')}>
                  <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">★</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <h1 className="text-4xl font-serif font-bold text-[#6a0d2e] mb-2 drop-shadow-sm">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-[#6a0d2e]/60 text-sm mb-4">
                <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold text-xs">
                  {user.role === 'admin' ? (
                     <><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('officialCreator')}</>
                  ) : (
                     <><span className="w-2 h-2 rounded-full bg-blue-500"></span> {t('communityCreator')}</>
                  )}
                </span>
                <span>•</span>
                <span>{t('joined', { date: new Date(user.createdAt).toLocaleDateString() })}</span>
              </div>
            </div>

            <div className="flex gap-6 z-10 bg-white/40 p-4 rounded-2xl shadow-sm border border-white/50">
              <div className="text-center">
                <span className="block text-3xl font-serif text-[#6a0d2e] leading-none mb-1">{photos.length}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#6a0d2e]/60">{t('uploads')}</span>
              </div>
            </div>
          </div>

          {/* User's Gallery */}
          <div className="mb-10 flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-[#6a0d2e] flex items-center justify-center shadow-lg">
                <ImageIcon className="h-5 w-5 text-[#ffcc1a]" />
             </div>
             <h2 className="text-2xl font-serif font-bold text-[#6a0d2e] drop-shadow-sm">{t('gallery')}</h2>
          </div>

          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-32 text-[#6a0d2e]/60 border border-dashed border-[#6a0d2e]/20 bg-white/30 rounded-3xl backdrop-blur-sm shadow-sm">
              <ImageIcon className="h-16 w-16 mb-6 opacity-30" />
              <p className="text-lg tracking-widest uppercase font-bold text-[#6a0d2e]">{t('noUploadsTitle')}</p>
              <p className="text-sm mt-2 opacity-70">{t('noUploadsDesc')}</p>
            </div>
          ) : (
            <MasonryGrid photos={adaptedPhotos} />
          )}
        </div>
      </div>
    </div>
  );
}
