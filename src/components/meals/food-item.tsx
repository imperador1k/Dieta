
'use client';

import type { FoodItemData } from '@/lib/types';
import { Trash2, Fish, Wheat, Droplet, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FoodItem({ 
    item, 
    onRemove,
    onEdit,
    onToggleEaten,
}: { 
    item: FoodItemData, 
    onRemove: () => void,
    onEdit: () => void,
    onToggleEaten: () => void,
}) {

    const servingMultiplier = item.servingSize / 100;
    const { nutrients } = item;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
            className={cn(
                "flex items-center gap-2 p-1 pr-2 rounded-md bg-background/50 group transition-opacity",
                item.eaten && "opacity-50"
            )}
        >
            <button onClick={onToggleEaten} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
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
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
        </motion.div>
    );
}
