'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { EvolutionPhoto } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, Weight, TrendingUp, Trash2, Eye } from 'lucide-react';
import { useState, useRef } from 'react';

interface GalleryGridProps {
  photos: EvolutionPhoto[];
  onPhotoSelect: (photo: EvolutionPhoto) => void;
  onDeletePhoto?: (photoId: string, publicId?: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export default function GalleryGrid({ photos, onPhotoSelect, onDeletePhoto }: GalleryGridProps) {
  const [pressedPhotoId, setPressedPhotoId] = useState<string | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  // Calculate weight trend
  const getWeightTrend = (index: number) => {
    if (index === 0 || !photos[index].weight || !photos[index - 1].weight) return null;
    const current = photos[index].weight;
    const previous = photos[index - 1].weight;
    return current - previous;
  };

  // Handle press start (for long press)
  const handlePressStart = (photoId: string) => {
    setIsPressing(true);

    pressTimer.current = setTimeout(() => {
      setPressedPhotoId(photoId);
      setIsPressing(false);
    }, 500); // 500ms for long press
  };

  // Handle press end/cancel
  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false);
  };

  // Handle click (short press)
  const handleClick = (photo: EvolutionPhoto, e: React.MouseEvent) => {
    e.stopPropagation();

    // If we were showing action buttons, hide them
    if (pressedPhotoId === photo.id) {
      setPressedPhotoId(null);
      return;
    }

    // Otherwise, select the photo
    onPhotoSelect(photo);
  };

  return (
    <motion.div
      className="columns-2 xs:columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-1.5 xs:gap-2 sm:gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {photos.map((photo, index) => {
        const weightTrend = getWeightTrend(index);
        const isPressed = pressedPhotoId === photo.id;

        return (
          <motion.div
            key={photo.id}
            className="mb-1.5 xs:mb-2 sm:mb-3 break-inside-avoid relative group overflow-hidden rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            variants={itemVariants}
            layoutId={`photo-${photo.id}`}
            transition={{ duration: 0.2 }}
          >
            {/* Photo */}
            <div
              className="relative overflow-hidden cursor-pointer"
              onClick={(e) => handleClick(photo, e)}
              onMouseDown={() => handlePressStart(photo.id)}
              onMouseUp={() => handlePressEnd()}
              onMouseLeave={() => handlePressEnd()}
              onTouchStart={() => handlePressStart(photo.id)}
              onTouchEnd={() => handlePressEnd()}
              onTouchCancel={() => handlePressEnd()}
            >
              {/* Remove fixed aspect ratio to accommodate any photo size */}
              <div className="relative">
                <Image
                  src={photo.imageUrl}
                  alt={`Evolução em ${photo.date}`}
                  width={photo.width}
                  height={photo.height}
                  className={cn(
                    "object-cover transition-transform duration-500 ease-in-out w-full h-auto",
                    isPressing ? "scale-95" : "group-hover:scale-105"
                  )}
                  sizes="(max-width: 320px) 50vw, (max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, (max-width: 1536px) 14vw, 12vw"
                  data-ai-hint={photo.imageHint}
                />
              </div>

              {/* Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300",
                isPressed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />

              {/* Action Buttons - Visible on long press */}
              <div className={cn(
                "absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex gap-1 transition-all duration-200",
                isPressed ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              )}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPhotoSelect(photo);
                  }}
                  className="p-1 sm:p-1.5 bg-black/50 backdrop-blur-sm rounded-md text-white hover:bg-black/70 transition-colors"
                  aria-label="Ver foto"
                >
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
                {onDeletePhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Tem certeza que deseja eliminar esta foto?')) {
                        onDeletePhoto(photo.id, photo.publicId);
                        setPressedPhotoId(null); // Close the action buttons after delete
                      }
                    }}
                    className="p-1 sm:p-1.5 bg-red-500/80 backdrop-blur-sm rounded-md text-white hover:bg-red-600 transition-colors"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                )}
              </div>

              {/* Date Badge */}
              <div className={cn(
                "absolute top-1 left-1 sm:top-1.5 sm:left-1.5 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-1 transition-opacity duration-300",
                isPressed ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <div className="flex items-center gap-1 text-white text-[9px] sm:text-[10px] font-medium">
                  <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                  <span>{format(parseISO(photo.date), 'd MMM', { locale: pt })}</span>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/80 to-transparent transition-transform duration-300",
              isPressed ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white text-xs font-medium">
                  <Weight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>{photo.weight} kg</span>
                </div>

                {weightTrend !== null && (
                  <div className={cn(
                    "flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    weightTrend < 0 ? "bg-green-500/20 text-green-400" :
                      weightTrend > 0 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                  )}>
                    <TrendingUp className={cn(
                      "h-2 w-2 sm:h-2.5 sm:w-2.5",
                      weightTrend < 0 ? "rotate-180" : ""
                    )} />
                    <span>{Math.abs(weightTrend).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}