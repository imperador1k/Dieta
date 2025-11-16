
'use client';

import type { FoodItemData } from '@/lib/types';
import { Trash2, Fish, Wheat, Droplet } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export default function FoodItem({ 
    item, 
    onRemove,
    onEdit 
}: { 
    item: FoodItemData, 
    onRemove: () => void,
    onEdit: () => void 
}) {

    const servingMultiplier = item.servingSize / 100;
    const { nutrients } = item;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
            className="flex items-center gap-2 p-1 pr-2 rounded-md bg-background/50 group"
        >
            <button onClick={onEdit} className="flex-1 flex items-center text-left gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                    <p className="font-medium text-sm capitalize">{item.description.toLowerCase()}</p>
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
