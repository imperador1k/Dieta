
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, PlusCircle, Utensils, Grape, Flame, Fish, Wheat, Droplet, StickyNote, Save } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { FoodSearchDialog } from "./food-search-dialog";
import type { FoodItemData } from "@/lib/types";
import FoodItem from "./food-item";

const variations = [
    { id: "descanso", label: "Dia de Descanso" },
    { id: "treino-a", label: "Dia de Treino A" },
    { id: "treino-b", label: "Dia de Treino B" },
];

type Meal = {
    id: string;
    name: string;
    items: FoodItemData[]; 
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    note?: string;
};

const initialMeals: Meal[] = [];

const MacroBadge = ({ Icon, value, unit, className }: { Icon: React.ElementType, value: number, unit: string, className?: string }) => (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
        <Icon className="w-3 h-3" />
        <span>{Math.round(value)}{unit}</span>
    </div>
);

const MealNoteEditor = ({ note, onSave }: { note?: string; onSave: (newNote: string) => void }) => {
    const [editingNote, setEditingNote] = useState(note || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onSave(editingNote);
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="space-y-2 mt-4">
                <Textarea 
                    value={editingNote} 
                    onChange={(e) => setEditingNote(e.target.value)}
                    placeholder="Ex: Em dias de menos treino come menos 10g de amendoins"
                    rows={2}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                    <Button size="sm" onClick={handleSave}><Save className="mr-2 h-4 w-4"/>Guardar</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-4">
            <button onClick={() => setIsEditing(true)} className="flex items-start text-left gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 w-full transition-colors">
                <StickyNote className="w-5 h-5 text-primary/80 mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold text-sm">Notas da Refeição</h4>
                    {note ? (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Adicionar uma nota...</p>
                    )}
                </div>
            </button>
        </div>
    )
}


export default function MealCategoriesWidget() {
    const [meals, setMeals] = useState<Meal[]>(initialMeals);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMealId, setActiveMealId] = useState<string | null>(null);
    const [foodToEdit, setFoodToEdit] = useState<FoodItemData | null>(null);


    const addMealCategory = () => {
        const newMeal: Meal = {
            id: `meal-${Date.now()}`,
            name: `Refeição ${meals.length + 1}`,
            items: [],
            totalCalories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            note: ""
        };
        setMeals([...meals, newMeal]);
    };
    
    const handleSaveNote = (mealId: string, newNote: string) => {
        setMeals(meals.map(m => m.id === mealId ? { ...m, note: newNote } : m));
    }

    const openFoodSearch = (mealId: string) => {
        setActiveMealId(mealId);
        setFoodToEdit(null);
        setIsSearchOpen(true);
    };

    const openFoodEditor = (mealId: string, food: FoodItemData) => {
        setActiveMealId(mealId);
        setFoodToEdit(food);
        setIsSearchOpen(true);
    }

    const confirmFoodInMeal = (foodData: FoodItemData) => {
        if (!activeMealId) return;

        setMeals(meals.map(meal => {
            if (meal.id === activeMealId) {
                const existingItemIndex = meal.items.findIndex(item => item.id === foodData.id);
                
                let updatedItems;
                if (existingItemIndex > -1) {
                    // Update existing item
                    updatedItems = [...meal.items];
                    updatedItems[existingItemIndex] = foodData;
                } else {
                    // Add new item
                    updatedItems = [...meal.items, foodData];
                }

                const newTotals = updatedItems.reduce((totals, item) => {
                    const servingMultiplier = item.servingSize / 100;
                    totals.totalCalories += item.nutrients.calories * servingMultiplier;
                    totals.protein += item.nutrients.protein * servingMultiplier;
                    totals.carbs += item.nutrients.carbohydrates * servingMultiplier;
                    totals.fat += item.nutrients.fat * servingMultiplier;
                    return totals;
                }, { totalCalories: 0, protein: 0, carbs: 0, fat: 0 });

                return { ...meal, items: updatedItems, ...newTotals };
            }
            return meal;
        }));
    };
    
    const removeFoodFromMeal = (mealId: string, foodId: string) => {
        setMeals(meals.map(meal => {
            if (meal.id === mealId) {
                const updatedItems = meal.items.filter(item => item.id !== foodId);
                const newTotals = updatedItems.reduce((totals, item) => {
                    const servingMultiplier = item.servingSize / 100;
                    totals.totalCalories += item.nutrients.calories * servingMultiplier;
                    totals.protein += item.nutrients.protein * servingMultiplier;
                    totals.carbs += item.nutrients.carbohydrates * servingMultiplier;
                    totals.fat += item.nutrients.fat * servingMultiplier;
                    return totals;
                }, { totalCalories: 0, protein: 0, carbs: 0, fat: 0 });

                return { ...meal, items: updatedItems, ...newTotals };
            }
            return meal;
        }))
    }

    return (
        <>
            <FoodSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onFoodConfirm={confirmFoodInMeal}
                foodToEdit={foodToEdit}
            />
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-grow">
                            <CardTitle>Calendário do Dia</CardTitle>
                            <CardDescription>Adicione e organize as suas refeições para o dia selecionado.</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={addMealCategory}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Calendário
                            </Button>
                            
                            <Select defaultValue="descanso">
                                <SelectTrigger className="w-full sm:w-[180px]">
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
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <Grape className="w-6 h-6 text-primary" />
                                                        <span className="truncate">{meal.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground pr-2">
                                                        <MacroBadge Icon={Flame} value={meal.totalCalories} unit="kcal" className="text-foreground font-semibold" />
                                                        <MacroBadge Icon={Fish} value={meal.protein} unit="g" className="text-chart-1" />
                                                        <MacroBadge Icon={Wheat} value={meal.carbs} unit="g" className="text-chart-2" />
                                                        <MacroBadge Icon={Droplet} value={meal.fat} unit="g" className="text-chart-3" />
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="border-t border-muted-foreground/20 pt-4 space-y-4">
                                                        <div className="space-y-2">
                                                            {meal.items.map(item => (
                                                                <FoodItem 
                                                                    key={item.id} 
                                                                    item={item} 
                                                                    onRemove={() => removeFoodFromMeal(meal.id, item.id)}
                                                                    onEdit={() => openFoodEditor(meal.id, item)}
                                                                />
                                                            ))}
                                                        </div>
                                                        {meal.items.length === 0 ? (
                                                            <div className="text-center text-sm text-muted-foreground py-4">
                                                                <p>Este calendário está vazio.</p>
                                                                <Button variant="link" className="mt-2" onClick={() => openFoodSearch(meal.id)}>
                                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                                    Adicionar Alimento
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button variant="outline" className="w-full" onClick={() => openFoodSearch(meal.id)}>
                                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                                Adicionar Alimento
                                                            </Button>
                                                        )}
                                                        <MealNoteEditor note={meal.note} onSave={(newNote) => handleSaveNote(meal.id, newNote)} />
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
        </>
    )
}
