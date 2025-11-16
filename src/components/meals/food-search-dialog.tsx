
'use client';

import React, { useState, useTransition, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFoodDetails, searchFood } from '@/app/log/actions';
import type { FoodSearchResult, FoodDetails } from '@/services/usda';
import type { FoodItemData } from '@/lib/types';
import { Loader2, Plus, PlusCircle, Scale, Utensils, Flame, Fish, Wheat, Droplet, Pencil, Search, CircleDashed } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

const suggestionChips = ["Frango", "Arroz", "Maçã", "Salmão", "Ovo", "Batata doce"];

const SearchResultItem = ({
    result,
    onSelect,
}: {
    result: FoodSearchResult;
    onSelect: (result: FoodSearchResult) => void;
}) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
    >
        <button
            onClick={() => onSelect(result)}
            className="w-full text-left p-3 rounded-lg hover:bg-muted/80 transition-colors flex flex-col gap-2 border bg-muted/40"
        >
            <div className="flex items-center justify-between">
                <div className='flex-1'>
                    <p className="font-semibold text-sm capitalize">{result.description.toLowerCase()}</p>
                    {result.brandOwner && <p className="text-xs text-muted-foreground">{result.brandOwner}</p>}
                </div>
                <PlusCircle className="w-5 h-5 text-muted-foreground ml-4" />
            </div>
            <div className="flex items-center justify-start gap-4 text-xs text-muted-foreground border-t border-dashed pt-2 mt-2">
                <div className="flex items-center gap-1.5 text-primary">
                    <Flame className="w-3.5 h-3.5" />
                    <span className='font-semibold'>{result.nutrients.calories.toFixed(0)}kcal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Fish className="w-3.5 h-3.5 text-chart-1" />
                    <span>P: {result.nutrients.protein.toFixed(1)}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5 text-chart-2" />
                    <span>H: {result.nutrients.carbohydrates.toFixed(1)}g</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-chart-3" />
                    <span>G: {result.nutrients.fat.toFixed(1)}g</span>
                </div>
            </div>
            <p className='text-xs text-muted-foreground/50 text-right w-full'>Valores por 100g</p>
        </button>
    </motion.div>
);

const AddOrEditFoodDetails = ({
    food,
    onConfirm,
    onBack,
    isEditing,
    originalId
}: {
    food: FoodDetails,
    onConfirm: (food: FoodItemData) => void,
    onBack: () => void,
    isEditing: boolean,
    originalId?: string,
}) => {
    const [servingSize, setServingSize] = useState('servingSize' in food ? (food as any).servingSize : 100);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const servingMultiplier = servingSize / 100;
    const { nutrients } = food;

    const handleConfirm = () => {
        setIsSubmitting(true);
        const foodToConfirm: FoodItemData = {
            id: originalId || `${food.fdcId}-${Date.now()}`,
            fdcId: food.fdcId,
            description: food.description,
            servingSize: servingSize,
            nutrients: nutrients,
        };
        onConfirm(foodToConfirm);
    };

    const handlePortionChange = (portionGramWeight: string) => {
        setServingSize(Number(portionGramWeight));
    }

    const portions = 'portions' in food ? food.portions : [];

    return (
        <motion.div 
            className="p-1 space-y-6"
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
        >
             <div>
                <h3 className="font-semibold capitalize text-lg">{food.description.toLowerCase()}</h3>
                <p className="text-sm text-muted-foreground">Ajuste a porção e {isEditing ? 'atualize' : 'adicione'} o alimento.</p>
            </div>

            <div className='space-y-4'>
                {portions && portions.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor="portions" className='flex items-center gap-2'><Utensils className='w-4 h-4'/>Porções Comuns</Label>
                        <Select onValueChange={handlePortionChange} defaultValue={String(servingSize)}>
                            <SelectTrigger id="portions">
                                <SelectValue placeholder="Selecionar porção" />
                            </SelectTrigger>
                            <SelectContent>
                                {portions.map((p, index) => (
                                    <SelectItem key={`${p.id}-${index}`} value={String(p.gramWeight)}>
                                        {p.portionDescription} ({p.gramWeight}g)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="serving-size" className='flex items-center gap-2'><Scale className='w-4 h-4' />Peso (em gramas)</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id='serving-size'
                            type="number"
                            value={servingSize}
                            onChange={e => setServingSize(Number(e.target.value))}
                            className="w-full bg-background/80"
                        />
                        <span className="text-muted-foreground">g</span>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center gap-1">
                    <Flame className='w-5 h-5 text-primary'/>
                    <p className="text-xs text-muted-foreground">Calorias</p>
                    <p className="font-bold text-lg text-primary">
                        {(nutrients.calories * servingMultiplier).toFixed(0)}
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center gap-1">
                    <Fish className='w-5 h-5 text-chart-1' />
                    <p className="text-xs text-muted-foreground">Proteína</p>
                    <p className="font-bold text-lg">
                        {(nutrients.protein * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center gap-1">
                    <Wheat className='w-5 h-5 text-chart-2'/>
                    <p className="text-xs text-muted-foreground">Hidratos</p>
                    <p className="font-bold text-lg">
                        {(nutrients.carbohydrates * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg flex flex-col items-center gap-1">
                     <Droplet className='w-5 h-5 text-chart-3' />
                    <p className="text-xs text-muted-foreground">Gordura</p>
                    <p className="font-bold text-lg">
                        {(nutrients.fat * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
            </div>

            <DialogFooter className='!mt-6 !flex-row'>
                {!isEditing && <Button variant="ghost" onClick={onBack}>Voltar</Button>}
                <Button onClick={handleConfirm} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" /> 
                    ) : isEditing ? (
                        <><Pencil className="mr-2"/> Atualizar Alimento</>
                    ) : (
                        <><Plus className="mr-2"/> Adicionar à Refeição</>
                    )}
                </Button>
            </DialogFooter>
        </motion.div>
    )
}

const SearchSkeleton = () => (
    <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg flex flex-col gap-2 border bg-muted/20">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-3/5" />
                    <CircleDashed className="w-5 h-5 text-muted-foreground/30 animate-spin" />
                </div>
                 <div className="flex items-center justify-start gap-4 text-xs text-muted-foreground border-t border-dashed pt-2 mt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        ))}
    </div>
)


export function FoodSearchDialog({
    open,
    onOpenChange,
    onFoodConfirm,
    foodToEdit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFoodConfirm: (food: FoodItemData) => void;
    foodToEdit: FoodItemData | null;
}) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState<FoodSearchResult[]>([]);
    const [isSearching, startSearchTransition] = useTransition();
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodDetails | null>(null);
    
    // This state will hold the full details of the food being edited.
    const [editingFoodDetails, setEditingFoodDetails] = useState<FoodDetails | null>(null);
    const isEditing = !!foodToEdit;

    useEffect(() => {
        if (open && foodToEdit) {
            setIsLoadingDetails(true);
            getFoodDetails(foodToEdit.fdcId).then(details => {
                if (details) {
                    const detailsWithServing = { ...details, servingSize: foodToEdit.servingSize };
                    setEditingFoodDetails(detailsWithServing);
                }
                setIsLoadingDetails(false);
            });
        } else {
            setEditingFoodDetails(null);
        }
    }, [open, foodToEdit]);


    const handleSearch = useCallback((searchTerm: string) => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }
        startSearchTransition(async () => {
            const foodResults = await searchFood(searchTerm);
            setResults(foodResults);
        });
    }, []);

    useEffect(() => {
        if (!isEditing) {
            handleSearch(debouncedQuery);
        }
    }, [debouncedQuery, handleSearch, isEditing]);

    const handleSelectResult = (result: FoodSearchResult) => {
        setIsLoadingDetails(true);
        getFoodDetails(result.fdcId).then(details => {
            if(details) {
                setSelectedFood(details);
            }
            setIsLoadingDetails(false);
        });
    }

    const handleConfirmFood = (food: FoodItemData) => {
        onFoodConfirm(food);
        resetAndClose();
    };
    
    const resetAndClose = () => {
        setQuery('');
        setResults([]);
        setSelectedFood(null);
        setEditingFoodDetails(null);
        onOpenChange(false);
    }
    
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetAndClose();
        } else {
            onOpenChange(true);
        }
    }

    const isPending = isSearching || isLoadingDetails;

    const currentView = editingFoodDetails ? 'details' : selectedFood ? 'details' : 'search';
    const foodForDetails = editingFoodDetails || selectedFood;
    
    const hasSearchQuery = debouncedQuery.length > 1;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg p-0">
                {!isEditing && (
                    <div className='p-6 space-y-4'>
                        <DialogHeader className='text-left'>
                            <DialogTitle className='text-2xl text-primary font-bold'>Descobrir Alimentos</DialogTitle>
                            <DialogDescription>
                                Encontre alimentos na nossa base de dados e adicione-os às suas refeições
                            </DialogDescription>
                        </DialogHeader>

                        <Separator />

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Procure por alimentos (ex: frango, arroz, maçã...)"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className='h-12 pl-11 text-base border-2 border-muted focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-4'
                            />
                        </div>
                    </div>
                )}
                
                <AnimatePresence mode="wait">
                   {isPending && !foodForDetails ? (
                        <div className="px-6 pb-6">
                            <SearchSkeleton />
                        </div>
                   ) : currentView === 'details' && foodForDetails ? (
                        <div className='p-6 pt-0'>
                             {isLoadingDetails ? (
                                <div className="flex justify-center items-center h-96">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                             ) : (
                                <AddOrEditFoodDetails
                                    key={isEditing ? foodToEdit?.id : 'add'}
                                    food={foodForDetails}
                                    onConfirm={handleConfirmFood}
                                    onBack={() => setSelectedFood(null)}
                                    isEditing={isEditing}
                                    originalId={foodToEdit?.id}
                                />
                             )}
                        </div>
                   ) : (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 pb-6 space-y-4"
                        >
                            <ScrollArea className="h-96 -mx-6">
                                <div className="px-6">
                                    {isSearching ? (
                                        <SearchSkeleton />
                                    ) : hasSearchQuery ? (
                                        <>
                                            {results.length === 0 && (
                                                <p className="text-center text-sm text-muted-foreground p-8">
                                                    Nenhum resultado encontrado para "{debouncedQuery}".
                                                </p>
                                            )}
                                            <div className="space-y-2">
                                                <AnimatePresence>
                                                    {results.map(result => (
                                                        <SearchResultItem
                                                            key={result.fdcId}
                                                            result={result}
                                                            onSelect={handleSelectResult}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-center h-full pt-16'>
                                            <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                                                <Search className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-lg">Procure por alimentos</h3>
                                            <p className='text-muted-foreground text-sm max-w-xs'>Comece a digitar para encontrar alimentos na nossa base de dados</p>
                                            <div className='flex flex-wrap gap-2 justify-center mt-6'>
                                                {suggestionChips.map(chip => (
                                                    <Button key={chip} variant="outline" size="sm" onClick={() => setQuery(chip)}>
                                                        {chip}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>

            </DialogContent>
        </Dialog>
    );
}
