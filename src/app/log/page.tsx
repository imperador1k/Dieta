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
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
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
                                        return (
                                            <button key={dish.id} onClick={() => openEditDishEditor(dish)} className="p-4 rounded-lg bg-muted/40 text-left hover:bg-muted/80 transition-colors">
                                                <h3 className="font-semibold">{dish.name}</h3>
                                                <p className="text-sm text-muted-foreground">{dish.description}</p>
                                                <div className="flex items-center gap-4 text-xs mt-2 text-muted-foreground">
                                                    <span>{totals.calories.toFixed(0)} kcal</span>
                                                    <span>P: {totals.protein.toFixed(1)}g</span>
                                                    <span>H: {totals.carbs.toFixed(1)}g</span>
                                                    <span>G: {totals.fat.toFixed(1)}g</span>
                                                </div>
                                            </button>
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
