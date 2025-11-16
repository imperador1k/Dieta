'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const meals = [
    { name: "Pequeno-almoço", calories: 450, completed: true },
    { name: "Almoço", calories: 800, completed: true },
    { name: "Lanche", calories: 300, completed: false },
    { name: "Jantar", calories: 700, completed: false },
];

export default function TodaysMealsWidget() {
    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        Refeições do Dia
                    </CardTitle>
                    <CardDescription>Registe e acompanhe as suas refeições.</CardDescription>
                </div>
                <Link href="/log" passHref legacyBehavior>
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary -mt-1 -mr-2">
                        <Plus className="h-5 w-5" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {meals.map((meal, index) => (
                        <motion.li 
                            key={meal.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <button className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 text-left">
                                <div className="flex items-center justify-center h-8 w-8 shrink-0">
                                    {meal.completed ? (
                                      <CheckCircle2 className="h-6 w-6 text-primary" />
                                    ) : (
                                      <Circle className="h-6 w-6 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{meal.name}</p>
                                    <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                                </div>
                                {meal.completed &&
                                  <div className="w-1 h-8 bg-primary rounded-full chart-glow" />
                                }
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
