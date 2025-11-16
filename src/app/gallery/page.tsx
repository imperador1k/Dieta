'use client';

import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { EvolutionPhoto } from '@/lib/types';
import GalleryHeader from '@/components/gallery/gallery-header';
import GalleryGrid from '@/components/gallery/gallery-grid';
import PhotoView from '@/components/gallery/photo-view';

const initialPhotos: EvolutionPhoto[] = PlaceHolderImages.map((p, index) => ({
  id: p.id,
  date: new Date(2024, 4, 15 + index * 5).toISOString(),
  imageUrl: p.imageUrl,
  imageHint: p.imageHint,
  weight: 80 - index * 0.5,
  width: 1080,
  height: 1350,
}));

export default function GalleryPage() {
  const [photos, setPhotos] = useState<EvolutionPhoto[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto | null>(null);

  const handleSelectPhoto = (photo: EvolutionPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="bg-background min-h-screen">
      <PhotoView
        photo={selectedPhoto}
        onClose={handleClosePhoto}
      />
      <GalleryHeader
        title="Galeria de Evolução"
        photoCount={photos.length}
      />
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-2 sm:px-4">
          <GalleryGrid
            photos={photos}
            onPhotoSelect={handleSelectPhoto}
          />
        </div>
      </main>
    </div>
  );
}
