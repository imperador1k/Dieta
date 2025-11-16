
'use client';

import type { FoodItemData, Dish, MealItem } from '@/lib/types';
import { Trash2, Fish, Wheat, Droplet, Circle, CheckCircle2, CookingPot, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const SingleFoodItem = ({ 
    item, 
    onRemove,
    onEdit,
    onToggleEaten,
}: { 
    item: FoodItemData, 
    onRemove: () => void,
    onEdit: () => void,
    onToggleEaten: (newState: boolean) => void,
}) => {
    const servingMultiplier = item.servingSize / 100;
    const { nutrients } = item;

    return (
        <div
            className={cn(
                "flex items-center gap-2 p-1 pr-2 rounded-md bg-background/50 group transition-opacity",
                item.eaten && "opacity-50"
            )}
        >
            <button onClick={() => onToggleEaten(!item.eaten)} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={item.eaten ? 'eaten' : 'uneaten'}
                        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                        transition={{ duration: 0.2 }}
                    >
                        {item.eaten ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/50" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </button>

            <button onClick={onEdit} className="flex-1 flex items-center text-left gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                    <p className={cn("font-medium text-sm capitalize", item.eaten && "line-through")}>
                        {item.description.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {item.servingSize}g &bull;{' '}
                        <span className="text-primary font-semibold">{(nutrients.calories * servingMultiplier).toFixed(0)} kcal</span>
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 text-chart-1">
                        <Fish className="w-3.5 h-3.5" />
                        <span>{(nutrients.protein * servingMultiplier).toFixed(1)}g</span>
                    </div>
                    <div className="flex items-center gap-1 text-chart-2">
                        <Wheat className="w-3.5 h-3.5" />
                        <span>{(nutrients.carbohydrates * servingMultiplier).toFixed(1)}g</span>
                    </div>
                    <div className="flex items-center gap-1 text-chart-3">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>{(nutrients.fat * servingMultiplier).toFixed(1)}g</span>
                    </div>
                </div>
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive shrink-0" onClick={onRemove}>
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
};

const DishItem = ({
    item,
    onRemove,
    onToggleEaten,
    onToggleIngredient,
}: {
    item: Dish & { eaten?: boolean },
    onRemove: () => void,
    onToggleEaten: (newState: boolean) => void,
    onToggleIngredient: (ingredientId: string) => void,
}) => {

    const totals = item.ingredients.reduce((acc, ing) => {
        const multiplier = ing.servingSize / 100;
        acc.calories += ing.nutrients.calories * multiplier;
        acc.protein += ing.nutrients.protein * multiplier;
        acc.carbs += ing.nutrients.carbohydrates * multiplier;
        acc.fat += ing.nutrients.fat * multiplier;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={item.id} className="border-0">
                 <div className={cn("flex items-center gap-2 p-1 pr-2 rounded-md bg-muted/60 group transition-opacity", item.eaten && "opacity-50")}>
                     <button onClick={() => onToggleEaten(!item.eaten)} className="p-2 rounded-full hover:bg-background/50 transition-colors">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={item.eaten ? 'eaten' : 'uneaten'}
                                initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.eaten ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground/50" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                    
                    <AccordionTrigger className="flex-1 p-2 hover:no-underline hover:bg-background/50 rounded-md">
                        <div className="flex-1 flex items-center text-left gap-3">
                            <CookingPot className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                                <p className={cn("font-semibold text-sm", item.eaten && "line-through")}>{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-primary font-semibold">{totals.calories.toFixed(0)} kcal</span>
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 text-chart-1"><Fish className="w-3.5 h-3.5" /><span>{totals.protein.toFixed(1)}g</span></div>
                                <div className="flex items-center gap-1 text-chart-2"><Wheat className="w-3.5 h-3.5" /><span>{totals.carbs.toFixed(1)}g</span></div>
                                <div className="flex items-center gap-1 text-chart-3"><Droplet className="w-3.5 h-3.5" /><span>{totals.fat.toFixed(1)}g</span></div>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive shrink-0" onClick={onRemove}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
                <AccordionContent className="pl-8 pr-2 pt-2 space-y-1">
                     {item.ingredients.map(ingredient => (
                        <div key={ingredient.id} className={cn("flex items-center gap-2 p-1 pr-2 rounded-md bg-background/50 group transition-opacity", ingredient.eaten && "opacity-50")}>
                            <button onClick={() => onToggleIngredient(ingredient.id)} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                                <AnimatePresence mode="wait">
                                     <motion.div
                                        key={ingredient.eaten ? 'eaten' : 'uneaten'}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {ingredient.eaten ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/50" />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>
                            <div className="flex-1">
                                <p className={cn("font-medium text-xs capitalize", ingredient.eaten && "line-through")}>
                                    {ingredient.description.toLowerCase()} ({ingredient.servingSize}g)
                                </p>
                            </div>
                        </div>
                     ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default function FoodItem({
    item, 
    onRemove,
    onEdit,
    onToggleEaten,
    onToggleIngredient,
}: { 
    item: MealItem, 
    onRemove: () => void,
    onEdit: () => void,
    onToggleEaten: (newState: boolean) => void,
    onToggleIngredient: (ingredientId: string) => void,
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
        >
            {item.type === 'food' ? (
                <SingleFoodItem 
                    item={item} 
                    onRemove={onRemove}
                    onEdit={onEdit}
                    onToggleEaten={onToggleEaten}
                />
            ) : (
                <DishItem 
                    item={item}
                    onRemove={onRemove}
                    onToggleEaten={onToggleEaten}
                    onToggleIngredient={onToggleIngredient}
                />
            )}
        </motion.div>
    );
}

    