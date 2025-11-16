
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, PlusCircle, Utensils, Grape, Flame } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

const variations = [
    { id: "descanso", label: "Dia de Descanso" },
    { id: "treino-a", label: "Dia de Treino A" },
    { id: "treino-b", label: "Dia de Treino B" },
];

type Meal = {
    id: string;
    name: string;
    items: any[]; // Replace 'any' with your food/dish type later
    totalCalories: number;
};

const initialMeals: Meal[] = [];

export default function MealCategoriesWidget() {
    const [meals, setMeals] = useState<Meal[]>(initialMeals);

    const addMealCategory = () => {
        const newMeal: Meal = {
            id: `meal-${Date.now()}`,
            name: `Refeição ${meals.length + 1}`,
            items: [],
            totalCalories: 0,
        };
        setMeals([...meals, newMeal]);
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Calendário do Dia</CardTitle>
                        <CardDescription>Adicione e organize as suas refeições para o dia selecionado.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={addMealCategory}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Calendário
                        </Button>
                        
                        <Select defaultValue="descanso">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione a variação" />
                            </SelectTrigger>
                            <SelectContent>
                                {variations.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar Variações</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMeals([])}>Limpar Calendários</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {meals.length === 0 ? (
                    <div className="text-center text-muted-foreground py-20 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center">
                        <Utensils className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">O seu dia está vazio</h3>
                        <p className="mt-2 text-sm max-w-sm">Adicione um "calendário" como "Pequeno-almoço" para começar a organizar as suas refeições.</p>
                    </div>
                ) : (
                    <Accordion type="multiple" defaultValue={meals.map(m => m.id)} className="space-y-4">
                        <AnimatePresence>
                            {meals.map((meal) => (
                                <motion.div
                                    key={meal.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    <AccordionItem value={meal.id} className="border-b-0">
                                        <Card className="bg-muted/30">
                                            <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                                                <div className="flex items-center gap-4">
                                                    <Grape className="w-6 h-6 text-primary" />
                                                    <span>{meal.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground pr-2">
                                                    <Flame className="w-4 h-4" />
                                                    <span>{meal.totalCalories} kcal</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4 pt-0">
                                                <div className="border-t border-muted-foreground/20 pt-4">
                                                    {meal.items.length === 0 ? (
                                                        <div className="text-center text-sm text-muted-foreground py-4">
                                                            <p>Este calendário está vazio.</p>
                                                            <Button variant="link" className="mt-2">
                                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                                Adicionar Alimento
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div>{/* List of foods will go here */}</div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </Card>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Accordion>
                )}
            </CardContent>
        </Card>
    )
}
