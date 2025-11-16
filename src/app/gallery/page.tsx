
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import type { EvolutionPhoto } from '@/lib/types';
import GalleryHeader from '@/components/gallery/gallery-header';
import GalleryGrid from '@/components/gallery/gallery-grid';
import PhotoView from '@/components/gallery/photo-view';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/app/context/AppContext';

export default function GalleryPage() {
  const { photos, setPhotos } = useAppContext();
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto | null>(null);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSelectPhoto = (photo: EvolutionPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  }

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (loadEvent) => {
          const imageUrl = loadEvent.target?.result as string;
          if(imageUrl) {
            const img = new Image();
            img.onload = () => {
                 const newPhoto: EvolutionPhoto = {
                    id: `new-${Date.now()}`,
                    date: new Date().toISOString(),
                    imageUrl: imageUrl,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    // In a real app, you might ask for the weight or fetch the latest one
                    weight: photos[0]?.weight ? photos[0].weight! - 0.3 : 75,
                };
                
                // Add to the beginning of the array
                setPhotos([newPhoto, ...photos]);

                toast({
                  title: "Foto Adicionada!",
                  description: "A sua nova foto de evolução foi guardada.",
                });
            }
            img.src = imageUrl;
          }
      };

      reader.readAsDataURL(file);

      // Reset file input to allow re-uploading the same file
      if (e.target) { 
        e.target.value = "";
      }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
        accept="image/*"
      />
      
      <PhotoView
        photo={selectedPhoto}
        onClose={handleClosePhoto}
      />

      <GalleryHeader
        title="Galeria de Evolução"
        photoCount={photos.length}
        onAddPhoto={handleAddPhotoClick}
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
