'use client';

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCopy, PlusCircle, Search } from "lucide-react";
import { DishEditor } from "@/components/dishes/dish-editor";
import { Dish, FoodItemData } from "@/lib/types";
import { useAppContext } from "@/app/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CookingPot, Flame, Fish, Utensils, Wheat, Droplet, ChevronRight } from "lucide-react";

export default function LogPage() {
    const { dishes, isDishesLoading } = useAppContext();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [dishToEdit, setDishToEdit] = useState<Dish | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const openNewDishEditor = () => {
        setDishToEdit(null);
        setIsEditorOpen(true);
    }
    
    const openEditDishEditor = (dish: Dish) => {
        setDishToEdit(dish);
        setIsEditorOpen(true);
    }

    const calculateDishTotals = (items: FoodItemData[]) => {
        return items.reduce((totals, item) => {
            const servingMultiplier = item.servingSize / 100;
            totals.calories += item.nutrients.calories * servingMultiplier;
            totals.protein += item.nutrients.protein * servingMultiplier;
            totals.carbs += item.nutrients.carbohydrates * servingMultiplier;
            totals.fat += item.nutrients.fat * servingMultiplier;
            return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    const filteredDishes = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isLoading = isDishesLoading && dishes.length === 0;

    return (
        <AppShell>
            <DishEditor
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                dish={dishToEdit}
            />
            <div className="max-w-4xl mx-auto">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2"><BookCopy /> Livro de Receitas</CardTitle>
                            <CardDescription>Crie, edite e gira os seus pratos e receitas personalizadas.</CardDescription>
                        </div>
                        <Button onClick={openNewDishEditor}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Criar Prato
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Procurar nos seus pratos..." 
                                    className="pl-10" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                    <Skeleton className="h-32 w-full rounded-xl" />
                                </div>
                            ) : filteredDishes.length === 0 ? (
                                <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                                    <BookCopy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-lg font-semibold">
                                        {searchTerm ? "Nenhum prato encontrado" : "Ainda não tem pratos"}
                                    </h3>
                                    <p className="mt-2 text-sm">
                                        {searchTerm ? "Tente uma pesquisa diferente." : "Comece por criar o seu primeiro prato ou receita."}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredDishes.map(dish => {
                                        const totals = calculateDishTotals(dish.ingredients);
                                        const ingredientCount = dish.ingredients.length;
                                        
                                        return (
                                            <motion.div
                                                key={dish.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ y: -5 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                className="group relative"
                                            >
                                                <button 
                                                    onClick={() => openEditDishEditor(dish)}
                                                    className="w-full h-full text-left rounded-xl bg-gradient-to-br from-background/80 to-muted/40 border border-muted/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                                                >
                                                    {/* Header with dish name and icon */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                                <CookingPot className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                                    {dish.name}
                                                                </h3>
                                                                {dish.description && (
                                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                        {dish.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Stats section */}
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Flame className="h-4 w-4 text-orange-500" />
                                                                <span className="font-semibold">{totals.calories.toFixed(0)}</span>
                                                                <span className="text-muted-foreground">kcal</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Fish className="h-4 w-4 text-blue-500" />
                                                                <span className="font-semibold">{totals.protein.toFixed(1)}</span>
                                                                <span className="text-muted-foreground">g</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Utensils className="h-4 w-4" />
                                                            <span>{ingredientCount} {ingredientCount === 1 ? 'ingrediente' : 'ingredientes'}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Macro details */}
                                                    <div className="mt-3 flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-chart-2">
                                                                <Wheat className="h-3.5 w-3.5" />
                                                                <span>{totals.carbs.toFixed(1)}g</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-chart-3">
                                                                <Droplet className="h-3.5 w-3.5" />
                                                                <span>{totals.fat.toFixed(1)}g</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
