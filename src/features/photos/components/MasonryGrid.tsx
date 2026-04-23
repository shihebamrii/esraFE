"use client";

import { PhotoCard } from "./PhotoCard";

interface Photo {
  id: string;
  title: string;
  url: string;
  location: string;
  price: number;
  width: number;
  height: number;
  gov: string;
  mediaType?: 'photo' | 'video';
  source?: 'official' | 'community';
}

interface MasonryGridProps {
  photos: Photo[];
}

export function MasonryGrid({ photos }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} {...photo} />
      ))}
    </div>
  );
}
