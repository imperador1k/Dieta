'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, Weight } from 'lucide-react';
import { Button } from '../ui/button';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

// Mock data, in a real app this would come from user data
const evolutionData = [
    { date: '2024-01-15T00:00:00.000Z', weight: 80, photoId: 'evo-1' },
    { date: '2024-02-15T00:00:00.000Z', weight: 78.5, photoId: 'evo-2' },
    { date: '2024-03-15T00:00:00.000Z', weight: 77, photoId: 'evo-3' },
    { date: '2024-04-15T00:00:00.000Z', weight: 76, photoId: 'evo-4' },
    { date: '2024-05-15T00:00:00.000Z', weight: 75, photoId: 'evo-5' },
    { date: '2024-06-15T00:00:00.000Z', weight: 74, photoId: 'evo-6' },
];

export const EvolutionGallery = () => {
    
    const photosWithData = evolutionData.map(data => {
        const photo = PlaceHolderImages.find(p => p.id === data.photoId);
        return {
            ...data,
            imageUrl: photo?.imageUrl,
            imageHint: photo?.imageHint,
            description: photo?.description
        };
    }).filter(item => item.imageUrl);


    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Camera />
                        Galeria de Evolução
                    </CardTitle>
                    <CardDescription>Acompanhe visualmente o seu progresso.</CardDescription>
                </div>
                <Button variant="outline">
                    Adicionar Foto
                </Button>
            </CardHeader>
            <CardContent>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {photosWithData.map((photo, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg group">
                                        <Image
                                            src={photo.imageUrl || ''}
                                            alt={photo.description || 'Foto de progresso'}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint={photo.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-4 text-white">
                                            <p className="font-bold text-lg">
                                                {format(parseISO(photo.date), "d 'de' MMMM, yyyy", { locale: pt })}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm opacity-90">
                                                <Weight className="w-4 h-4" />
                                                <span>{photo.weight} kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12"/>
                </Carousel>
            </CardContent>
        </Card>
    );
};
