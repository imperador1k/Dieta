
'use client';

import { useState } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import VariationTotalsWidget from "@/components/meals/variation-totals-widget";
import MealCategoriesWidget from "@/components/meals/meal-categories-widget";
import type { Meal, Variation } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data, in a real app this would come from the active plan
const initialVariations: Variation[] = [
    { id: "descanso", name: "Dia de Descanso" },
    { id: "treino-a", name: "Dia de Treino A" },
    { id: "treino-b", name: "Dia de Treino B" },
];

type MealsByVariation = {
    [variationId: string]: Meal[];
}

export default function MealsPage() {
    const activePlan = "Plano de Emagrecimento Intensivo";

    // State to hold all meals for all variations
    const [mealsByVariation, setMealsByVariation] = useState<MealsByVariation>({});
    const [activeVariationId, setActiveVariationId] = useState(initialVariations[0]?.id);

    // Get the meals for the currently selected variation
    const currentMeals = mealsByVariation[activeVariationId] || [];

    const handleMealsChange = (newMeals: Meal[]) => {
        setMealsByVariation(prev => ({
            ...prev,
            [activeVariationId]: newMeals
        }));
    };

    return (
        <AppShell>
            <div className="flex flex-col items-center w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Calendário de Refeições</h1>
                    <p className="mt-2 text-sm text-primary">
                        Plano ativo: <span className="font-semibold">{activePlan}</span>
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-foreground">Variação do Dia</h2>
                        <Select value={activeVariationId} onValueChange={setActiveVariationId}>
                            <SelectTrigger className="w-full sm:w-[220px]">
                                <SelectValue placeholder="Selecione a variação" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialVariations.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <VariationTotalsWidget meals={currentMeals} />
                    
                    <MealCategoriesWidget 
                        key={activeVariationId} // Force re-render on variation change
                        meals={currentMeals}
                        onMealsChange={handleMealsChange}
                    />
                </div>
            </div>
        </AppShell>
    );
}
