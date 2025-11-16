'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
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
      className="fixed top-0 left-0 w-full z-10 p-4"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-primary/10 bg-background/60 p-2 px-4 shadow-lg backdrop-blur-xl">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground -mt-1">{photoCount} fotos</p>
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onAddPhoto}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  );
}
