'use client';

import { useState, useRef, ChangeEvent } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { EvolutionPhoto } from '@/lib/types';
import GalleryHeader from '@/components/gallery/gallery-header';
import GalleryGrid from '@/components/gallery/gallery-grid';
import PhotoView from '@/components/gallery/photo-view';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const initialPhotos: EvolutionPhoto[] = PlaceHolderImages.map((p, index) => ({
  id: p.id,
  date: new Date(2024, 4, 15 + index * 5).toISOString(),
  imageUrl: p.imageUrl,
  imageHint: p.imageHint,
  weight: 80 - index * 0.5,
  width: 1080,
  height: 1350,
}));

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop
): Promise<{ url: string; width: number; height: number; } | null> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        resolve(null);
        return;
      }
      resolve({
        url: window.URL.createObjectURL(blob),
        width: cropWidth,
        height: cropHeight,
      });
    }, 'image/jpeg', 0.9);
  });
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<EvolutionPhoto[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto | null>(null);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

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
      setCrop(undefined); // Reset crop on new image
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropModalOpen(true);
      if (e.target) { // Reset file input to allow re-uploading the same file
        e.target.value = "";
      }
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = width > height ? 1080 / 1350 : 1; // Default to portrait or free crop
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      if (croppedImage) {
        const newPhoto: EvolutionPhoto = {
          id: `new-${Date.now()}`,
          date: new Date().toISOString(),
          imageUrl: croppedImage.url,
          width: croppedImage.width,
          height: croppedImage.height,
          // In a real app, you might ask for the weight or fetch the latest one
          weight: photos[photos.length-1]?.weight ? photos[photos.length-1].weight! - 0.3 : 75,
        };
        
        // Add to the beginning of the array
        setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);

        toast({
          title: "Foto Adicionada!",
          description: "A sua nova foto de evolução foi guardada.",
        });
      }
      setIsCropModalOpen(false);
      setImgSrc('');
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

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Recortar Foto</DialogTitle>
            </DialogHeader>
            {imgSrc && (
                <div className="flex justify-center my-4">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={1080 / 1350} // Portrait aspect ratio
                    >
                        <img
                            ref={imgRef}
                            alt="Recortar imagem"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            className="max-h-[60vh]"
                        />
                    </ReactCrop>
                </div>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleCropComplete}>Adicionar à Galeria</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
