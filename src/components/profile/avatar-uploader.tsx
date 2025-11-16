'use client';

import { useState, useRef, ChangeEvent } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Camera, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AvatarUploaderProps {
    name: string;
    email: string;
    avatarUrl?: string;
    onAvatarChange: (newAvatarUrl: string) => void;
    onNameChange: (newName: string) => void;
    onEmailChange: (newEmail: string) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

// This function is what we are fixing
async function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error('Failed to get 2d context');
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;
  
  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  // 2) Scale the image
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error("Canvas is empty");
            return;
        }
        resolve(window.URL.createObjectURL(blob));
    }, 'image/png', 1);
  });
}


export function AvatarUploader({ name, email, avatarUrl, onAvatarChange, onNameChange, onEmailChange }: AvatarUploaderProps) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Reset crop on new image
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setIsCropModalOpen(true);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    };

    const handleCrop = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop, "new-avatar.png");
            onAvatarChange(croppedImageUrl);
            setIsCropModalOpen(false);
        }
    };
    

    return (
        <>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCircle/> Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <Avatar className="w-28 h-28 border-4 border-muted group-hover:border-primary transition-colors">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback>
                                <UserCircle className="w-16 h-16" />
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="default"
                            size="icon"
                            className="absolute bottom-1 right-1 rounded-full h-8 w-8 group-hover:opacity-100 opacity-70"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-4 h-4" />
                            <span className="sr-only">Alterar foto</span>
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="space-y-4 flex-1 w-full">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" value={name} onChange={(e) => onNameChange(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Recortar Imagem</DialogTitle>
                    </DialogHeader>
                    {imgSrc && (
                        <div className="flex justify-center">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
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
                        <Button onClick={handleCrop}>Aplicar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
