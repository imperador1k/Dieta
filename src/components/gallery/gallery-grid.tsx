'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { EvolutionPhoto } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  photos: EvolutionPhoto[];
  onPhotoSelect: (photo: EvolutionPhoto) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function GalleryGrid({ photos, onPhotoSelect }: GalleryGridProps) {
  return (
    <motion.div
      className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          className="mb-3 break-inside-avoid relative group overflow-hidden rounded-xl shadow-md"
          variants={itemVariants}
          onClick={() => onPhotoSelect(photo)}
          layoutId={`photo-${photo.id}`}
        >
          <Image
            src={photo.imageUrl}
            alt={`Evolução em ${photo.date}`}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
            data-ai-hint={photo.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 p-3 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white font-bold text-sm">
              {format(new Date(photo.date), 'd MMM yyyy', { locale: pt })}
            </p>
            <p className="text-white/80 text-xs">{photo.weight} kg</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
