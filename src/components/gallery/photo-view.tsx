'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { EvolutionPhoto } from '@/lib/types';
import { Weight, Calendar } from 'lucide-react';

interface PhotoViewProps {
  photo: EvolutionPhoto | null;
  onClose: () => void;
}

export default function PhotoView({ photo, onClose }: PhotoViewProps) {
  return (
    <Dialog open={!!photo} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AnimatePresence>
        {photo && (
          <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-4xl w-full">
            <motion.div
              layoutId={`photo-${photo.id}`}
              className="relative w-full h-auto"
            >
              <Image
                src={photo.imageUrl}
                alt={`Evolução em ${photo.date}`}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-contain rounded-xl shadow-2xl"
                data-ai-hint={photo.imageHint}
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/50 backdrop-blur-md rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">
                      {format(new Date(photo.date), "PPP", { locale: pt })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    <span className="font-semibold">{photo.weight} kg</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
