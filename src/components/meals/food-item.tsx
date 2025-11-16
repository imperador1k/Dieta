
'use client';

import type { FoodItemData } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

export default function FoodItem({ item, onRemove }: { item: FoodItemData, onRemove: () => void }) {

    const servingMultiplier = item.servingSize / 100;
    const { nutrients } = item;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
            className="flex items-center gap-2 p-2 rounded-md bg-background/50"
        >
            <div className="flex-1">
                <p className="font-medium text-sm capitalize">{item.description.toLowerCase()}</p>
                <p className="text-xs text-muted-foreground">
                    {item.servingSize}g &bull;{' '}
                    <span className="text-primary font-semibold">{(nutrients.calories * servingMultiplier).toFixed(0)} kcal</span>
                </p>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
                <span>P: {(nutrients.protein * servingMultiplier).toFixed(1)}g</span>
                <span>H: {(nutrients.carbohydrates * servingMultiplier).toFixed(1)}g</span>
                <span>G: {(nutrients.fat * servingMultiplier).toFixed(1)}g</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={onRemove}>
                <Trash2 className="w-4 h-4" />
            </Button>
        </motion.div>
    );
}

