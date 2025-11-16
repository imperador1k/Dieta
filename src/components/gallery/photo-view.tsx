'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { EvolutionPhoto } from '@/lib/types';
import { Weight, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';

interface PhotoViewProps {
  photo: EvolutionPhoto | null;
  onClose: () => void;
}

export default function PhotoView({ photo, onClose }: PhotoViewProps) {
  return (
    <Dialog open={!!photo} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AnimatePresence>
        {photo && (
          <DialogContent className="p-0 sm:p-4 border-0 bg-transparent shadow-none w-full h-full sm:max-w-4xl flex flex-col items-center justify-center">
            <motion.div
              layoutId={`photo-${photo.id}`}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white" onClick={onClose}>
                    <X className="h-6 w-6"/>
                    <span className="sr-only">Fechar</span>
                </Button>
                
                <div className="w-full h-full flex items-center justify-center overflow-auto">
                    <div className="relative w-auto h-auto max-w-full max-h-full flex-shrink-0">
                        <Image
                          src={photo.imageUrl}
                          alt={`Evolução em ${photo.date}`}
                          width={photo.width}
                          height={photo.height}
                          className="w-auto h-auto max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-none sm:rounded-xl shadow-2xl"
                          data-ai-hint={photo.imageHint}
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white sm:rounded-b-xl">
                  <div className="flex items-center justify-between max-w-md mx-auto">
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
