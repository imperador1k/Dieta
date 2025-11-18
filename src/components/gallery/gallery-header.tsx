'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryHeaderProps {
  title: string;
  photoCount: number;
  onAddPhoto: () => void;
}

export default function GalleryHeader({ title, photoCount, onAddPhoto }: GalleryHeaderProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      className="fixed top-0 left-0 w-full z-10 p-3 sm:p-4"
    >
      <div className="mx-auto flex h-12 sm:h-14 max-w-7xl items-center justify-between rounded-xl border border-primary/10 bg-background/60 p-2 px-3 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg sm:h-9 sm:w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Camera className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                {photoCount} {photoCount === 1 ? 'foto' : 'fotos'}
              </p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="default" 
          size="sm" 
          className="h-8 rounded-lg px-2.5 text-xs sm:h-9 sm:rounded-lg sm:px-3 sm:text-sm font-medium"
          onClick={onAddPhoto}
        >
          <Plus className="h-4 w-4 mr-1 sm:mr-1.5" />
          <span className="hidden xs:inline">Adicionar</span>
        </Button>
      </div>
    </motion.header>
  );
}