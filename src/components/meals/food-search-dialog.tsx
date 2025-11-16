
'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFoodDetails, searchFood } from '@/app/log/actions';
import type { FoodSearchResult } from '@/services/usda';
import type { FoodItemData } from '@/lib/types';
import { Loader2, Plus, PlusCircle, Scale, Utensils } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';


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
            className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors flex items-center gap-4"
        >
            <div className="p-2 bg-muted/50 rounded-md">
                <Utensils className="w-5 h-5 text-primary"/>
            </div>
            <div className="flex-1">
                <p className="font-semibold text-sm capitalize">{result.description.toLowerCase()}</p>
                {result.brandOwner && <p className="text-xs text-muted-foreground">{result.brandOwner}</p>}
            </div>
            <PlusCircle className="w-5 h-5 text-muted-foreground" />
        </button>
    </motion.div>
);

const AddFoodDetails = ({
    food,
    onAdd,
    onBack,
}: {
    food: FoodSearchResult,
    onAdd: (food: FoodItemData) => void,
    onBack: () => void,
}) => {
    const [servingSize, setServingSize] = useState(100);
    const [isAdding, setIsAdding] = useState(false);
    const [details, setDetails] = useState<Awaited<ReturnType<typeof getFoodDetails>>>(null);

    useEffect(() => {
        getFoodDetails(food.fdcId).then(setDetails);
    }, [food.fdcId]);

    const handleAdd = () => {
        if (!details) return;
        setIsAdding(true);
        const foodToAdd: FoodItemData = {
            id: `${food.fdcId}-${Date.now()}`,
            fdcId: food.fdcId,
            description: food.description,
            servingSize: servingSize,
            nutrients: details.nutrients,
        };
        onAdd(foodToAdd);
    };

    if (!details) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    const servingMultiplier = servingSize / 100;
    const { nutrients } = details;

    return (
        <div className="p-1 space-y-4">
             <div>
                <h3 className="font-semibold capitalize text-lg">{food.description.toLowerCase()}</h3>
                <p className="text-sm text-muted-foreground">Ajuste a porção e adicione à sua refeição.</p>
            </div>
            <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-muted-foreground" />
                <Input
                    type="number"
                    value={servingSize}
                    onChange={e => setServingSize(Number(e.target.value))}
                    className="w-24"
                />
                <span className="text-muted-foreground">gramas</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Calorias</p>
                    <p className="font-bold text-lg text-primary">
                        {(nutrients.calories * servingMultiplier).toFixed(0)}
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Proteína</p>
                    <p className="font-bold text-lg">
                        {(nutrients.protein * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Hidratos</p>
                    <p className="font-bold text-lg">
                        {(nutrients.carbohydrates * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Gordura</p>
                    <p className="font-bold text-lg">
                        {(nutrients.fat * servingMultiplier).toFixed(1)}g
                    </p>
                </div>
            </div>

            <DialogFooter className='!mt-6 !flex-row'>
                <Button variant="ghost" onClick={onBack}>Voltar</Button>
                <Button onClick={handleAdd} disabled={isAdding} className="flex-1">
                    {isAdding ? <Loader2 className="animate-spin" /> : <Plus className="mr-2"/>}
                    Adicionar à Refeição
                </Button>
            </DialogFooter>
        </div>
    )
}

export function FoodSearchDialog({
    open,
    onOpenChange,
    onFoodSelected,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFoodSelected: (food: FoodItemData) => void;
}) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState<FoodSearchResult[]>([]);
    const [isPending, startTransition] = useTransition();
    const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);

    const handleSearch = useCallback((searchTerm: string) => {
        if (searchTerm.trim().length < 2) {
            setResults([]);
            return;
        }
        startTransition(async () => {
            const foodResults = await searchFood(searchTerm);
            setResults(foodResults);
        });
    }, []);

    useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    const handleAddFood = (food: FoodItemData) => {
        onFoodSelected(food);
        resetAndClose();
    };
    
    const resetAndClose = () => {
        setQuery('');
        setResults([]);
        setSelectedFood(null);
        onOpenChange(false);
    }
    
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetAndClose();
        } else {
            onOpenChange(true);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Adicionar Alimento</DialogTitle>
                     <DialogDescription>
                        {selectedFood ? 'Confirme a porção do alimento.' : 'Procure um alimento para adicionar à sua refeição.'}
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {selectedFood ? (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AddFoodDetails
                                food={selectedFood}
                                onAdd={handleAddFood}
                                onBack={() => setSelectedFood(null)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                             transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Ex: Frango grelhado"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <ScrollArea className="h-64">
                                <div className="pr-4">
                                    {isPending && (
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    )}
                                    {!isPending && results.length === 0 && debouncedQuery.length > 2 && (
                                        <p className="text-center text-sm text-muted-foreground p-4">
                                            Nenhum resultado encontrado.
                                        </p>
                                    )}
                                    <div className="space-y-1">
                                        <AnimatePresence>
                                            {results.map(result => (
                                                <SearchResultItem
                                                    key={result.fdcId}
                                                    result={result}
                                                    onSelect={setSelectedFood}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>

            </DialogContent>
        </Dialog>
    );
}
