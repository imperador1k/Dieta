
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, PlusCircle, Utensils, Grape, Flame, Fish, Wheat, Droplet, StickyNote, Save, CookingPot, CheckCircle2, Circle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { FoodSearchDialog } from "./food-search-dialog";
import type { FoodItemData, Meal, MealItem, Dish } from "@/lib/types";
import FoodItem from "./food-item";

const MacroBadge = ({ Icon, value, unit, className }: { Icon: React.ElementType, value: number, unit: string, className?: string }) => (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
        <Icon className="w-3.5 h-3.5" />
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

interface MealCategoriesWidgetProps {
    meals: Meal[];
    onMealsChange: (meals: Meal[]) => void;
    savedDishes: Dish[];
}

export default function MealCategoriesWidget({ meals, onMealsChange, savedDishes }: MealCategoriesWidgetProps) {
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
        onMealsChange([...meals, newMeal]);
    };
    
    const handleSaveNote = (mealId: string, newNote: string) => {
        const updatedMeals = meals.map(m => m.id === mealId ? { ...m, note: newNote } : m);
        onMealsChange(updatedMeals);
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

    const confirmItemInMeal = (item: MealItem) => {
        if (!activeMealId) return;

        const updatedMeals = meals.map(meal => {
            if (meal.id === activeMealId) {
                const isDish = 'ingredients' in item;
                const itemToAdd: MealItem = isDish ? { ...item, type: 'dish', eaten: false, ingredients: item.ingredients.map(i => ({...i, eaten: false})) } : { ...item, type: 'food', eaten: false };

                const existingItemIndex = meal.items.findIndex(i => i.id === item.id);
                
                let updatedItems;
                if (existingItemIndex > -1) {
                    const currentItem = meal.items[existingItemIndex];
                    updatedItems = [...meal.items];
                    // Retain the 'eaten' status of the top-level item and its ingredients
                    const newEatenState = currentItem.eaten;
                    const newIngredientsState = currentItem.type === 'dish' ? currentItem.ingredients.map(ing => ({...ing})) : undefined;

                    updatedItems[existingItemIndex] = { 
                        ...itemToAdd, 
                        eaten: newEatenState,
                    };
                    if (updatedItems[existingItemIndex].type === 'dish' && newIngredientsState) {
                        (updatedItems[existingItemIndex] as Dish & {type: 'dish'}).ingredients = (itemToAdd as Dish & {type: 'dish'}).ingredients.map(newIng => {
                           const oldIng = newIngredientsState.find(old => old.id === newIng.id);
                           return oldIng ? {...newIng, eaten: oldIng.eaten} : {...newIng, eaten: false};
                        });
                    }

                } else {
                    updatedItems = [...meal.items, itemToAdd];
                }

                return { ...meal, items: updatedItems };
            }
            return meal;
        });

        onMealsChange(recalculateAllTotals(updatedMeals));
    };

    const recalculateAllTotals = (mealsToRecalculate: Meal[]): Meal[] => {
        return mealsToRecalculate.map(meal => {
            const totals = meal.items.reduce((acc, item) => {
                let itemTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
                if (item.type === 'food') {
                    const multiplier = item.servingSize / 100;
                    itemTotals = {
                        calories: item.nutrients.calories * multiplier,
                        protein: item.nutrients.protein * multiplier,
                        carbs: item.nutrients.carbohydrates * multiplier,
                        fat: item.nutrients.fat * multiplier,
                    }
                } else if (item.type === 'dish') {
                    item.ingredients.forEach(ingredient => {
                         const multiplier = ingredient.servingSize / 100;
                         itemTotals.calories += ingredient.nutrients.calories * multiplier;
                         itemTotals.protein += ingredient.nutrients.protein * multiplier;
                         itemTotals.carbs += ingredient.nutrients.carbohydrates * multiplier;
                         itemTotals.fat += ingredient.nutrients.fat * multiplier;
                    });
                }
                acc.totalCalories += itemTotals.calories;
                acc.protein += itemTotals.protein;
                acc.carbs += itemTotals.carbs;
                acc.fat += itemTotals.fat;
                return acc;
            }, { totalCalories: 0, protein: 0, carbs: 0, fat: 0 });

            return { ...meal, ...totals };
        });
    }
    
    const removeItemFromMeal = (mealId: string, itemId: string) => {
        const updatedMeals = meals.map(meal => {
            if (meal.id === mealId) {
                const updatedItems = meal.items.filter(item => item.id !== itemId);
                return { ...meal, items: updatedItems };
            }
            return meal;
        });
        onMealsChange(recalculateAllTotals(updatedMeals));
    }

    const toggleItemEaten = (mealId: string, itemId: string, newEatenState: boolean) => {
        const updatedMeals = meals.map(meal => {
            if (meal.id === mealId) {
                const updatedItems = meal.items.map(item => {
                    if (item.id === itemId) {
                        const updatedItem = { ...item, eaten: newEatenState };
                        if (updatedItem.type === 'dish') {
                            updatedItem.ingredients = updatedItem.ingredients.map(ing => ({...ing, eaten: newEatenState}));
                        }
                        return updatedItem;
                    }
                    return item;
                });
                return { ...meal, items: updatedItems };
            }
            return meal;
        });
        onMealsChange(updatedMeals);
    };

    const toggleDishIngredientEaten = (mealId: string, dishId: string, ingredientId: string) => {
        const updatedMeals = meals.map(meal => {
            if (meal.id === mealId) {
                const updatedItems = meal.items.map(item => {
                    if (item.id === dishId && item.type === 'dish') {
                        let allEaten = true;
                        const updatedIngredients = item.ingredients.map(ing => {
                            let updatedIng = ing;
                            if (ing.id === ingredientId) {
                                updatedIng = {...ing, eaten: !ing.eaten};
                            }
                            if (!updatedIng.eaten) allEaten = false;
                            return updatedIng;
                        });
                        return { ...item, ingredients: updatedIngredients, eaten: allEaten };
                    }
                    return item;
                });
                return { ...meal, items: updatedItems };
            }
            return meal;
        });
        onMealsChange(updatedMeals);
    }
    
    const toggleMealEaten = (mealId: string) => {
        const meal = meals.find(m => m.id === mealId);
        if (!meal) return;

        const allCurrentlyEaten = meal.items.length > 0 && meal.items.every(item => item.eaten);
        const newEatenState = !allCurrentlyEaten;

        const updatedMeals = meals.map(m => {
            if (m.id === mealId) {
                return {
                    ...m,
                    items: m.items.map(item => {
                        const updatedItem = { ...item, eaten: newEatenState };
                        if (updatedItem.type === 'dish') {
                            updatedItem.ingredients = updatedItem.ingredients.map(ing => ({...ing, eaten: newEatenState}));
                        }
                        return updatedItem;
                    })
                };
            }
            return m;
        });

        onMealsChange(updatedMeals);
    }

    return (
        <>
            <FoodSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onConfirm={confirmItemInMeal}
                foodToEdit={foodToEdit}
                savedDishes={savedDishes}
            />
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-grow">
                            <CardTitle>Estrutura do Dia</CardTitle>
                            <CardDescription>Adicione e organize as suas refeições para a variação selecionada.</CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={addMealCategory}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Refeição
                            </Button>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Copiar dia de outro plano</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onMealsChange([])}>Limpar Refeições</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {meals.length === 0 ? (
                        <div className="text-center text-muted-foreground py-20 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center">
                            <Utensils className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">Dia por preencher</h3>
                            <p className="mt-2 text-sm max-w-sm">Adicione uma refeição como "Pequeno-almoço" para começar a estruturar este dia.</p>
                        </div>
                    ) : (
                        <Accordion type="multiple" defaultValue={meals.map(m => m.id)} className="space-y-4">
                            <AnimatePresence>
                                {meals.map((meal) => {
                                    const isAllEaten = meal.items.length > 0 && meal.items.every(item => item.eaten);
                                    return (
                                    <motion.div
                                        key={meal.id}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        <AccordionItem value={meal.id} className="border-b-0">
                                            <Card className="bg-muted/30">
                                                <div className="flex items-center p-3 sm:p-4">
                                                    <button onClick={() => toggleMealEaten(meal.id)} className="p-2 rounded-full hover:bg-background/50 transition-colors">
                                                        <AnimatePresence mode="wait">
                                                            <motion.div
                                                                key={isAllEaten ? 'eaten' : 'uneaten'}
                                                                initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                                exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {isAllEaten ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6 text-muted-foreground/50" />}
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    </button>
                                                    <AccordionTrigger className="p-0 pl-2 text-lg font-semibold hover:no-underline flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1 w-full">
                                                            <div className="flex items-center gap-3">
                                                                <Grape className="w-6 h-6 text-primary" />
                                                                <span className="truncate">{meal.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground sm:ml-auto pl-9 sm:pl-0 mt-1 sm:mt-0">
                                                                <MacroBadge Icon={Flame} value={meal.totalCalories} unit="kcal" className="text-foreground font-semibold" />
                                                                <MacroBadge Icon={Fish} value={meal.protein} unit="g" className="text-chart-1" />
                                                                <MacroBadge Icon={Wheat} value={meal.carbs} unit="g" className="text-chart-2" />
                                                                <MacroBadge Icon={Droplet} value={meal.fat} unit="g" className="text-chart-3" />
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                </div>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="border-t border-muted-foreground/20 pt-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <AnimatePresence>
                                                                {meal.items.map(item => (
                                                                    <FoodItem
                                                                        key={item.id}
                                                                        item={item}
                                                                        onRemove={() => removeItemFromMeal(meal.id, item.id)}
                                                                        onEdit={() => { if (item.type === 'food') openFoodEditor(meal.id, item) }}
                                                                        onToggleEaten={(newState) => toggleItemEaten(meal.id, item.id, newState)}
                                                                        onToggleIngredient={(ingredientId) => {
                                                                            if (item.type === 'dish') {
                                                                                toggleDishIngredientEaten(meal.id, item.id, ingredientId);
                                                                            }
                                                                        }}
                                                                    />
                                                                ))}
                                                            </AnimatePresence>
                                                        </div>
                                                        <Button variant="outline" className="w-full" onClick={() => openFoodSearch(meal.id)}>
                                                            <PlusCircle className="mr-2 h-4 w-4" />
                                                            Adicionar Alimento ou Prato
                                                        </Button>
                                                        <MealNoteEditor note={meal.note} onSave={(newNote) => handleSaveNote(meal.id, newNote)} />
                                                    </div>
                                                </AccordionContent>
                                            </Card>
                                        </AccordionItem>
                                    </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
