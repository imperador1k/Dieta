'use client';

import { useState, useRef, ChangeEvent, useMemo } from 'react';
import type { EvolutionPhoto } from '@/lib/types';
import GalleryHeader from '@/components/gallery/gallery-header';
import GalleryGrid from '@/components/gallery/gallery-grid';
import PhotoView from '@/components/gallery/photo-view';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/app/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, Search, X, Upload, CheckCircle, CloudUpload } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryPage() {
  const { photos, addPhoto, deletePhoto } = useAppContext();
  const [selectedPhoto, setSelectedPhoto] = useState<EvolutionPhoto | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'weight'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [weightFilter, setWeightFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<{ file: File; uploadResult: any } | null>(null);
  const [weightInput, setWeightInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSelectPhoto = (photo: EvolutionPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoId: string, publicId?: string) => {
    try {
      // Delete from Cloudinary via API route if publicId exists
      if (publicId) {
        const response = await fetch('/api/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete image from Cloudinary');
        }
      }
      
      // Delete from Firestore
      await deletePhoto(photoId, publicId);
      
      toast({
        title: "Foto Eliminada!",
        description: "A sua foto foi removida com sucesso.",
      });
      
      // Close the photo view if it's open
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Erro ao eliminar foto",
        description: "Ocorreu um erro ao eliminar a sua foto. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  }

  const onFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      try {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Show loading state
        toast({
          title: "A carregar foto...",
          description: "A sua foto está a ser carregada para a nuvem.",
        });
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);
        
        // Upload to Cloudinary via API route
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        // Complete the progress
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadResult = await response.json();
        
        // Set the pending photo and open weight modal
        setPendingPhoto({ file, uploadResult });
        // Set default weight to last photo weight
        const defaultWeight = photos[0]?.weight || '';
        setWeightInput(defaultWeight ? defaultWeight.toString() : '');
        setIsWeightModalOpen(true);
        
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: "Erro ao carregar foto",
          description: "Ocorreu um erro ao carregar a sua foto. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        
        // Reset file input to allow re-uploading the same file
        if (e.target) { 
          e.target.value = "";
        }
      }
    }
  };

  const handleWeightSubmit = () => {
    if (!pendingPhoto) return;
    
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Peso inválido",
        description: "Por favor, introduza um peso válido.",
        variant: "destructive",
      });
      return;
    }
    
    const newPhoto: EvolutionPhoto = {
      id: `photo-${Date.now()}`,
      date: new Date().toISOString(),
      imageUrl: pendingPhoto.uploadResult.secure_url,
      width: pendingPhoto.uploadResult.width,
      height: pendingPhoto.uploadResult.height,
      weight: weight,
      publicId: pendingPhoto.uploadResult.public_id,
    };
    
    // Add the new photo
    addPhoto(newPhoto);
    
    // Close the modal and reset state
    setIsWeightModalOpen(false);
    setPendingPhoto(null);
    setWeightInput('');
    
    toast({
      title: "Foto Adicionada!",
      description: "A sua nova foto de evolução foi guardada na nuvem.",
    });
  };

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    let result = [...photos];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(photo => 
        photo.weight?.toString().includes(query) ||
        format(parseISO(photo.date), 'dd MMM yyyy', { locale: pt }).toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (dateFilter && dateFilter !== 'all') {
      result = result.filter(photo => 
        format(parseISO(photo.date), 'yyyy-MM').includes(dateFilter)
      );
    }
    
    // Apply weight filter
    if (weightFilter) {
      const weightValue = parseFloat(weightFilter);
      if (!isNaN(weightValue)) {
        result = result.filter(photo => 
          photo.weight && Math.abs(photo.weight - weightValue) < 1
        );
      }
    }
    
    // Sort photos
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'weight' && a.weight !== undefined && b.weight !== undefined) {
        comparison = a.weight - b.weight;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [photos, searchQuery, dateFilter, weightFilter, sortBy, sortOrder]);

  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    photos.forEach(photo => {
      months.add(format(parseISO(photo.date), 'yyyy-MM'));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [photos]);

  const uniqueWeights = useMemo(() => {
    const weights = new Set<number>();
    photos.forEach(photo => {
      if (photo.weight) {
        weights.add(photo.weight);
      }
    });
    return Array.from(weights).sort((a, b) => a - b);
  }, [photos]);

  // Check if any filters are active
  const hasActiveFilters = searchQuery || dateFilter !== 'all' || weightFilter;

  return (
    <div className="bg-background min-h-screen">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
        accept="image/*"
        disabled={isUploading}
      />
      
      <PhotoView
        photo={selectedPhoto}
        onClose={handleClosePhoto}
        onDelete={handleDeletePhoto}
      />

      <GalleryHeader
        title="Galeria de Evolução"
        photoCount={photos.length}
        onAddPhoto={handleAddPhotoClick}
      />
      
      {/* Animated Upload Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-gradient-to-br from-background to-muted p-6 sm:p-8 rounded-2xl shadow-2xl border border-border max-w-md w-full mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative bg-primary/10 p-5 sm:p-6 rounded-full inline-flex"
                >
                  <CloudUpload className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                </motion.div>
              </motion.div>
              
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold text-foreground mb-2"
              >
                A carregar foto...
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 text-sm sm:text-base"
              >
                A sua foto está a ser carregada para a nuvem
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-muted rounded-full h-2.5 sm:h-3 mb-4 overflow-hidden"
              >
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </motion.div>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground"
              >
                {uploadProgress}% concluído
              </motion.p>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex justify-center"
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Weight Input Modal */}
      <Dialog open={isWeightModalOpen} onOpenChange={(open) => {
        setIsWeightModalOpen(open);
        if (!open) {
          // Reset state when closing the modal
          setPendingPhoto(null);
          setWeightInput('');
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Qual é o seu peso nesta foto?</DialogTitle>
            <DialogDescription>
              Introduza o seu peso na data desta foto para melhorar o acompanhamento da sua evolução.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Peso
              </Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder="Peso"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="col-span-2"
                min="0"
                step="0.1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleWeightSubmit();
                  }
                }}
              />
              <span className="text-sm font-medium">kg</span>
            </div>
            {photos.length > 0 && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Dica:</p>
                <p>O peso da sua última foto foi <span className="font-semibold">{photos[0].weight} kg</span></p>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Por favor, introduza o seu peso real nesta data para um acompanhamento preciso.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsWeightModalOpen(false);
                setPendingPhoto(null);
                setWeightInput('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleWeightSubmit}
              disabled={!weightInput || parseFloat(weightInput) <= 0}
            >
              Guardar Foto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Filters Section - More mobile-friendly */}
      <div className="pt-20 pb-4 px-2 sm:px-4">
        <div className="container mx-auto">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full max-w-xs"
              />
            </div>
            
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Filtros</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setDateFilter('all');
                        setWeightFilter('');
                        setSortBy('date');
                        setSortOrder('desc');
                      }}
                    >
                      Limpar tudo
                    </Button>
                  </SheetTitle>
                  <SheetDescription>
                    Refine os resultados da sua galeria
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Sort Options */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Ordenação</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={sortBy} onValueChange={(value: 'date' | 'weight') => setSortBy(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Data</SelectItem>
                          <SelectItem value="weight">Peso</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ordem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Decrescente</SelectItem>
                          <SelectItem value="asc">Crescente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Date Filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Data</h3>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <SelectValue placeholder="Mês" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os meses</SelectItem>
                        {uniqueMonths.map(month => (
                          <SelectItem key={month} value={month}>
                            {format(parseISO(`${month}-01`), 'MMMM yyyy', { locale: pt })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Weight Filter */}
                  {uniqueWeights.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Peso (kg)</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={weightFilter ? "outline" : "default"}
                          size="sm"
                          onClick={() => setWeightFilter('')}
                          className="h-8"
                        >
                          Todos
                        </Button>
                        {uniqueWeights.map(weight => (
                          <Button
                            key={weight}
                            variant={weightFilter === weight.toString() ? "default" : "outline"}
                            size="sm"
                            onClick={() => setWeightFilter(weightFilter === weight.toString() ? '' : weight.toString())}
                            className="h-8"
                          >
                            {weight}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('all');
                  setWeightFilter('');
                }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
          
          {/* Mobile Filters - More compact and touch-friendly */}
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full text-sm"
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      <span>Filtros</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setDateFilter('all');
                          setWeightFilter('');
                          setSortBy('date');
                          setSortOrder('desc');
                        }}
                      >
                        Limpar tudo
                      </Button>
                    </SheetTitle>
                    <SheetDescription>
                      Refine os resultados da sua galeria
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Sort Options */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Ordenação</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={sortBy} onValueChange={(value: 'date' | 'weight') => setSortBy(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ordenar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="weight">Peso</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ordem" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desc">Decrescente</SelectItem>
                            <SelectItem value="asc">Crescente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Date Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Data</h3>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <SelectValue placeholder="Mês" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os meses</SelectItem>
                          {uniqueMonths.map(month => (
                            <SelectItem key={month} value={month}>
                              {format(parseISO(`${month}-01`), 'MMMM yyyy', { locale: pt })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Weight Filter */}
                    {uniqueWeights.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium">Peso (kg)</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={weightFilter ? "outline" : "default"}
                            size="sm"
                            onClick={() => setWeightFilter('')}
                            className="h-8"
                          >
                            Todos
                          </Button>
                          {uniqueWeights.map(weight => (
                            <Button
                              key={weight}
                              variant={weightFilter === weight.toString() ? "default" : "outline"}
                              size="sm"
                              onClick={() => setWeightFilter(weightFilter === weight.toString() ? '' : weight.toString())}
                              className="h-8"
                            >
                              {weight}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                    <span>Pesquisa: {searchQuery}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {dateFilter !== 'all' && (
                  <div className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                    <span>Mês: {format(parseISO(`${dateFilter}-01`), 'MMM yyyy', { locale: pt })}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0"
                      onClick={() => setDateFilter('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {weightFilter && (
                  <div className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                    <span>Peso: {weightFilter}kg</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0"
                      onClick={() => setWeightFilter('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <main className="pb-8">
        <div className="container mx-auto px-1 sm:px-2 md:px-4">
          {filteredAndSortedPhotos.length > 0 ? (
            <GalleryGrid
              photos={filteredAndSortedPhotos}
              onPhotoSelect={handleSelectPhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <div className="text-4xl sm:text-6xl mb-4">📸</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhuma foto encontrada</h3>
                <p className="mb-4 text-sm sm:text-base">
                  {photos.length === 0 
                    ? "Ainda não adicionou nenhuma foto à sua galeria de evolução." 
                    : "Nenhuma foto corresponde aos filtros selecionados."}
                </p>
                <Button onClick={handleAddPhotoClick} size="sm" className="sm:text-base">
                  Adicionar Primeira Foto
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}