'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus, UtensilsCrossed, Sun, Moon, Coffee, Apple, Beef, Candy } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/app/context/AppContext";
import { useMemo } from "react";

// Function to get the appropriate icon for a meal based on its name
const getMealIcon = (mealName: string) => {
  const name = mealName.toLowerCase();
  
  if (name.includes('pequeno') || name.includes('café') || name.includes('manhã')) {
    return Coffee;
  } else if (name.includes('almoço') || name.includes('almoco')) {
    return Sun;
  } else if (name.includes('jantar') || name.includes('noite')) {
    return Moon;
  } else if (name.includes('lanche') || name.includes('snack')) {
    return Apple;
  } else if (name.includes('treino') || name.includes('pré') || name.includes('pre')) {
    return Beef;
  } else if (name.includes('sobremesa') || name.includes('doce')) {
    return Candy;
  }
  
  return UtensilsCrossed;
};

// Function to get a vibrant color based on meal name
const getMealColor = (mealName: string) => {
  const name = mealName.toLowerCase();
  
  if (name.includes('pequeno') || name.includes('café') || name.includes('manhã')) {
    return 'from-amber-400 to-orange-500';
  } else if (name.includes('almoço') || name.includes('almoco')) {
    return 'from-green-400 to-emerald-500';
  } else if (name.includes('jantar') || name.includes('noite')) {
    return 'from-purple-400 to-indigo-500';
  } else if (name.includes('lanche') || name.includes('snack')) {
    return 'from-pink-400 to-rose-500';
  } else if (name.includes('treino') || name.includes('pré') || name.includes('pre')) {
    return 'from-red-400 to-orange-500';
  } else if (name.includes('sobremesa') || name.includes('doce')) {
    return 'from-yellow-400 to-amber-500';
  }
  
  return 'from-primary to-primary/80';
};

export default function TodaysMealsWidget() {
    const { todaysMeals, toggleAllMealItemsEaten, activePlan, activeVariationId } = useAppContext();

    const toggleMeal = (mealId: string) => {
        const meal = todaysMeals.find(m => m.id === mealId);
        if (!meal) return;
        
        // If all items are already eaten, mark all as not eaten. Otherwise, mark all as eaten.
        const allCurrentlyEaten = meal.items.length > 0 && meal.items.every(item => item.eaten);
        const newEatenState = !allCurrentlyEaten;
        
        // Use the new function to toggle all items at once
        toggleAllMealItemsEaten(mealId, newEatenState);
    };

    // Calculate progress for each meal
    const mealsWithProgress = useMemo(() => {
        return todaysMeals.map(meal => {
            const eatenItems = meal.items.filter(item => item.eaten).length;
            const totalItems = meal.items.length;
            const progress = totalItems > 0 ? (eatenItems / totalItems) * 100 : 0;
            
            return {
                ...meal,
                eatenItems,
                totalItems,
                progress,
                isCompleted: totalItems > 0 && eatenItems === totalItems
            };
        });
    }, [todaysMeals]);

    // Get the name of the active variation
    const activeVariationName = useMemo(() => {
        if (!activePlan || !activeVariationId) return 'Variação';
        const variation = activePlan.variations.find(v => v.id === activeVariationId);
        return variation ? variation.name : 'Variação';
    }, [activePlan, activeVariationId]);

    return (
        <Card className="glass-card border-0 shadow-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                        Refeições do Plano
                    </CardTitle>
                    <CardDescription>
                        {activePlan ? (
                            <span>Plano: <span className="font-semibold">{activePlan.name}</span> • Variação: <span className="font-semibold">{activeVariationName}</span></span>
                        ) : (
                            "Configure um plano ativo"
                        )}
                    </CardDescription>
                </div>
                <Link href="/meals">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary -mt-1 -mr-2">
                        <Plus className="h-5 w-5" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {!activePlan ? (
                    <div className="text-center text-muted-foreground py-8">
                        <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">Nenhum plano ativo</h3>
                        <p className="mt-1 text-sm">Ative um plano na página <Link href="/plan" className="text-primary underline">Planos</Link></p>
                    </div>
                ) : todaysMeals.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">Sem refeições planeadas</h3>
                        <p className="mt-1 text-sm">Vá à página <Link href="/meals" className="text-primary underline">Refeições</Link> para planear as suas refeições</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        <AnimatePresence>
                            {mealsWithProgress.map((meal, index) => {
                                const IconComponent = getMealIcon(meal.name);
                                const gradientColor = getMealColor(meal.name);
                                
                                return (
                                <motion.li 
                                    key={meal.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/5 rounded-xl blur-sm"></div>
                                    <button 
                                        onClick={() => toggleMeal(meal.id)} 
                                        className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-lg relative bg-background/50 backdrop-blur-sm border border-muted/30"
                                    >
                                        {/* Progress bar background */}
                                        <div className="absolute bottom-0 left-0 h-1 w-full bg-muted/30 rounded-b-xl"></div>
                                        
                                        {/* Progress bar fill */}
                                        <motion.div 
                                            className={`absolute bottom-0 left-0 h-1 rounded-b-xl bg-gradient-to-r ${gradientColor}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${meal.progress}%` }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        />
                                        
                                        <div className={`flex items-center justify-center h-12 w-12 shrink-0 rounded-full ${
                                            meal.isCompleted 
                                                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                                : 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
                                        }`}>
                                            <IconComponent className={`h-6 w-6 ${meal.isCompleted ? 'text-white' : 'text-primary'}`} />
                                        </div>
                                        
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center justify-between">
                                                <p className={`font-bold ${meal.isCompleted ? 'text-green-600 line-through' : 'text-foreground'}`}>
                                                    {meal.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-muted-foreground">
                                                        {meal.eatenItems}/{meal.totalItems}
                                                    </span>
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={meal.isCompleted ? 'completed' : 'pending'}
                                                            initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                            exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {meal.isCompleted ? (
                                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                                            ) : (
                                                            <Circle className="h-6 w-6 text-muted-foreground/50" />
                                                            )}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {meal.totalCalories.toFixed(0)} kcal
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {meal.items.length} {meal.items.length === 1 ? 'item' : 'itens'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </motion.li>
                                )
                            })}
                        </AnimatePresence>
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}