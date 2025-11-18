'use client';

import { useState, useEffect, useTransition } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FoodSearchDialog } from "@/components/meals/food-search-dialog";
import FoodItem from "@/components/meals/food-item";
import { generateRecipe } from "@/app/log/actions";
import { PlusCircle, Sparkles, Loader2, Save, CookingPot, Pencil, Trash, Flame, Fish, Wheat, Droplet, X } from "lucide-react";
import type { Dish, FoodItemData, MealItem } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useAppContext } from "@/app/context/AppContext";

interface DishEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dish: Dish | null;
}

const MacroBadge = ({ Icon, value, unit, className }: { Icon: React.ElementType, value: number, unit: string, className?: string }) => (
    <div className={className}>
        <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
            <Icon className="w-5 h-5" />
            <div>
                <p className="text-sm font-bold">{Math.round(value)}{unit}</p>
            </div>
        </div>
    </div>
);


export function DishEditor({ open, onOpenChange, dish: initialDish }: DishEditorProps) {
    const { saveDish, deleteDish } = useAppContext();
    const [dish, setDish] = useState<Dish>(initialDish || { 
        id: `dish-${Date.now()}`, 
        name: '', 
        description: '', 
        ingredients: [], 
        instructions: '' 
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<FoodItemData | null>(null);
    const [isGenerating, startGenerating] = useTransition();

    useEffect(() => {
        if (open) {
            setDish(initialDish || {
                id: `dish-${Date.now()}`,
                name: '',
                description: '',
                ingredients: [],
                instructions: ''
            });
        }
    }, [open, initialDish]);

    const updateDishField = (field: keyof Dish, value: any) => {
        setDish(prev => ({ ...prev, [field]: value }));
    };

    const handleFoodConfirm = (item: MealItem) => {
        // Check if the item is a food item (not a dish)
        if (item.type === 'food') {
            const food = item as FoodItemData;
            const existingIndex = dish.ingredients.findIndex(ingredient => ingredient.id === food.id);
            let newIngredients;
            if (existingIndex > -1) {
                newIngredients = [...dish.ingredients];
                newIngredients[existingIndex] = food;
            } else {
                newIngredients = [...dish.ingredients, { ...food, eaten: undefined }]; // eaten is not relevant for dish ingredients
            }
            updateDishField('ingredients', newIngredients);
            setFoodToEdit(null);
        }
    };
    
    const handleRemoveFood = (foodId: string) => {
        updateDishField('ingredients', dish.ingredients.filter(item => item.id !== foodId));
    };

    const handleEditFood = (food: FoodItemData) => {
        setFoodToEdit(food);
        setIsSearchOpen(true);
    };
    
    const handleGenerateRecipe = () => {
        if (dish.ingredients.length === 0) return;
        startGenerating(async () => {
            const ingredientNames = dish.ingredients.map(i => `${i.description} (${i.servingSize}g)`);
            const instructions = await generateRecipe(dish.name, ingredientNames);
            updateDishField('instructions', instructions);
        });
    };

    const handleSave = () => {
        // Ensure the dish has a valid id
        let dishToSave = dish;
        if (!dish.id || dish.id.startsWith('dish-undefined')) {
            dishToSave = {
                ...dish,
                id: `dish-${Date.now()}`
            };
        }
        
        // Validate and clean the dish object to ensure no undefined values
        const cleanedDish: Dish = {
            id: dishToSave.id || `dish-${Date.now()}`,
            name: dishToSave.name || '',
            description: dishToSave.description || '',
            ingredients: dishToSave.ingredients.map(ingredient => ({
                id: ingredient.id,
                fdcId: ingredient.fdcId,
                description: ingredient.description || '',
                servingSize: ingredient.servingSize || 0,
                nutrients: {
                    calories: ingredient.nutrients.calories || 0,
                    protein: ingredient.nutrients.protein || 0,
                    fat: ingredient.nutrients.fat || 0,
                    carbohydrates: ingredient.nutrients.carbohydrates || 0
                }
            })),
            instructions: dishToSave.instructions || ''
        };
        
        saveDish(cleanedDish);
        onOpenChange(false);
    };
    
    const handleDelete = () => {
        if (initialDish) {
            deleteDish(initialDish.id);
            onOpenChange(false);
        }
    }

    const totals = dish.ingredients.reduce((acc, item) => {
        const multiplier = item.servingSize / 100;
        acc.calories += item.nutrients.calories * multiplier;
        acc.protein += item.nutrients.protein * multiplier;
        acc.carbs += item.nutrients.carbohydrates * multiplier;
        acc.fat += item.nutrients.fat * multiplier;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return (
        <>
            <FoodSearchDialog 
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onConfirm={handleFoodConfirm}
                foodToEdit={foodToEdit}
                savedDishes={[]}
                hideDishesTab={true}
            />
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-xl w-full flex flex-col p-0">
                    <SheetHeader className="p-6">
                        <SheetTitle className="text-2xl flex items-center gap-3">
                            {initialDish ? <Pencil /> : <CookingPot />}
                            {initialDish ? 'Editar Prato' : 'Criar Novo Prato'}
                        </SheetTitle>
                        <SheetDescription>
                            Construa uma receita guardada com ingredientes e instruções para usar mais tarde.
                        </SheetDescription>
                    </SheetHeader>
                    <Separator />
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="dish-name" className="text-base">Nome do Prato</Label>
                                <Input 
                                    id="dish-name" 
                                    placeholder="Ex: Bitoque"
                                    value={dish.name}
                                    onChange={e => updateDishField('name', e.target.value)}
                                    className="text-lg h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dish-description" className="text-base">Descrição Curta</Label>
                                <Input 
                                    id="dish-description" 
                                    placeholder="Ex: Prato tradicional português"
                                    value={dish.description}
                                    onChange={e => updateDishField('description', e.target.value)}
                                />
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Ingredientes</h3>
                                <div className="p-4 bg-muted/40 rounded-lg space-y-3">
                                    <div className="space-y-2">
                                        {dish.ingredients.map(item => (
                                            <FoodItem 
                                                key={item.id} 
                                                item={{...item, type: 'food'}}
                                                onRemove={() => handleRemoveFood(item.id)} 
                                                onEdit={() => handleEditFood(item)}
                                                onToggleEaten={() => {}} // Not used here
                                                onToggleIngredient={() => {}} // Not used here
                                            />
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={() => { setFoodToEdit(null); setIsSearchOpen(true); }}>
                                        <PlusCircle className="mr-2" /> Adicionar Ingrediente
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                <MacroBadge Icon={Flame} value={totals.calories} unit="kcal" className="text-primary" />
                                <MacroBadge Icon={Fish} value={totals.protein} unit="g" className="text-chart-1" />
                                <MacroBadge Icon={Wheat} value={totals.carbs} unit="g" className="text-chart-2" />
                                <MacroBadge Icon={Droplet} value={totals.fat} unit="g" className="text-chart-3" />
                            </div>

                            <Separator />

                             <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold">Instruções de Confeção</h3>
                                    <Button size="sm" variant="ghost" onClick={handleGenerateRecipe} disabled={isGenerating || dish.ingredients.length === 0}>
                                        {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                                        Gerar com IA
                                    </Button>
                                </div>
                                <Textarea 
                                    placeholder="Descreva os passos para preparar este prato, ou use a ajuda da IA..."
                                    value={dish.instructions}
                                    onChange={(e) => updateDishField('instructions', e.target.value)}
                                    rows={10}
                                    className="bg-muted/40"
                                />
                            </div>
                        </div>
                    </ScrollArea>
                    <Separator />
                    <SheetFooter className="p-6 bg-background/80 backdrop-blur-sm flex-row justify-end items-center">
                         {initialDish && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="mr-auto"><Trash className="mr-2"/> Apagar Prato</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isto irá apagar permanentemente o prato do seu livro de receitas.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         )}
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button onClick={handleSave}><Save className="mr-2"/> Guardar Prato</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}