
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/app/context/AppContext";

export default function TodaysMealsWidget() {
    const { todaysMeals, toggleMealItemEaten } = useAppContext();

    const toggleMeal = (mealId: string) => {
        const meal = todaysMeals.find(m => m.id === mealId);
        if (!meal) return;
        
        // If all items are already eaten, mark all as not eaten. Otherwise, mark all as eaten.
        const allCurrentlyEaten = meal.items.every(item => item.eaten);
        const newEatenState = !allCurrentlyEaten;
        
        meal.items.forEach(item => {
            toggleMealItemEaten(mealId, item.id, newEatenState);
        });
    };

    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        Refeições do Dia
                    </CardTitle>
                    <CardDescription>Registe e acompanhe as suas refeições.</CardDescription>
                </div>
                <Link href="/log">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary -mt-1 -mr-2">
                        <Plus className="h-5 w-5" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {todaysMeals.length === 0 ? (
                     <div className="text-center text-muted-foreground py-8">
                        <UtensilsCrossed className="mx-auto h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-md font-semibold">Sem refeições hoje.</h3>
                        <p className="mt-1 text-sm">Vá à página <Link href="/meals" className="text-primary underline">Refeições</Link> para planear o seu dia.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        <AnimatePresence>
                            {todaysMeals.map((meal, index) => {
                                const isCompleted = meal.items.length > 0 && meal.items.every(i => i.eaten);
                                return (
                                <motion.li 
                                    key={meal.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <button onClick={() => toggleMeal(meal.id)} className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left">
                                        <div className="flex items-center justify-center h-8 w-8 shrink-0">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={isCompleted ? 'completed' : 'pending'}
                                                    initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {isCompleted ? (
                                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                                    ) : (
                                                    <Circle className="h-6 w-6 text-muted-foreground/50" />
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{meal.name}</p>
                                            <p className="text-sm text-muted-foreground">{meal.totalCalories.toFixed(0)} kcal</p>
                                        </div>
                                        <AnimatePresence>
                                        {isCompleted &&
                                            <motion.div
                                                className="w-1 h-8 bg-primary rounded-full chart-glow"
                                                initial={{ opacity: 0, scaleY: 0 }}
                                                animate={{ opacity: 1, scaleY: 1 }}
                                                exit={{ opacity: 0, scaleY: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ originY: 0 }}
                                            />
                                        }
                                        </AnimatePresence>
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
