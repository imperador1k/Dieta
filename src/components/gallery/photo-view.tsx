'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { EvolutionPhoto } from '@/lib/types';
import { Weight, Calendar, X, Trash2, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface PhotoViewProps {
  photo: EvolutionPhoto | null;
  onClose: () => void;
  onDelete?: (photoId: string, publicId?: string) => void;
}

export default function PhotoView({ photo, onClose, onDelete }: PhotoViewProps) {
  return (
    <Dialog open={!!photo} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AnimatePresence>
        {photo && (
          <DialogContent className="p-0 sm:p-4 border-0 bg-transparent shadow-none w-full max-w-full h-full max-h-full flex flex-col items-center justify-center [&>button]:hidden">
            {/* Hidden title for accessibility */}
            <VisuallyHidden>
              <DialogTitle>Detalhes da foto de evolução</DialogTitle>
            </VisuallyHidden>
            
            <motion.div
              layoutId={`photo-${photo.id}`}
              className="relative w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Action Buttons - Desktop */}
              <div className="absolute top-4 right-4 z-20 flex gap-2 hidden sm:flex">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
                {onDelete && (
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-red-50 hover:text-red-500" 
                    onClick={() => onDelete(photo.id, photo.publicId)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                )}
              </div>
              
              {/* Action Buttons - Mobile */}
              <div className="absolute top-4 right-4 z-20 flex gap-2 sm:hidden">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Main Image Area - Improved for any photo size */}
              <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-6">
                <div className="relative w-auto h-auto max-w-full max-h-full flex items-center justify-center">
                  <Image
                    src={photo.imageUrl}
                    alt={`Evolução em ${photo.date}`}
                    width={photo.width}
                    height={photo.height}
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    data-ai-hint={photo.imageHint}
                    priority
                  />
                </div>
              </div>

              {/* Photo Information Panel - Minimalist version */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="flex-shrink-0 w-full max-w-2xl p-3 sm:p-4"
              >
                <Card className="bg-background/90 backdrop-blur-xl border-border shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(parseISO(photo.date), "d MMM yyyy", { locale: pt })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{photo.weight} kg</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span className="text-xs">
                          {photo.width} × {photo.height}px
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mobile Action Buttons */}
                {onDelete && (
                  <div className="mt-3 sm:hidden">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja eliminar esta foto?')) {
                          onDelete(photo.id, photo.publicId);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Foto
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}