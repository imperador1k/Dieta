'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const initialMeals = [
    { name: "Pequeno-almoço", calories: 450, completed: false },
    { name: "Almoço", calories: 800, completed: false },
    { name: "Lanche", calories: 300, completed: false },
    { name: "Jantar", calories: 700, completed: false },
];

export default function TodaysMealsWidget() {
    const [meals, setMeals] = useState(initialMeals);

    const toggleMeal = (mealName: string) => {
        setMeals(currentMeals => 
            currentMeals.map(meal => 
                meal.name === mealName ? { ...meal, completed: !meal.completed } : meal
            )
        );
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
                <ul className="space-y-3">
                    <AnimatePresence>
                        {meals.map((meal, index) => (
                            <motion.li 
                                key={meal.name}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <button onClick={() => toggleMeal(meal.name)} className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left">
                                    <div className="flex items-center justify-center h-8 w-8 shrink-0">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={meal.completed ? 'completed' : 'pending'}
                                                initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {meal.completed ? (
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                                ) : (
                                                <Circle className="h-6 w-6 text-muted-foreground/50" />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{meal.name}</p>
                                        <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                                    </div>
                                    <AnimatePresence>
                                    {meal.completed &&
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
                        ))}
                    </AnimatePresence>
                </ul>
            </CardContent>
        </Card>
    )
}
