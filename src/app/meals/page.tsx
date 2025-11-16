'use client';

import { AppShell } from "@/components/layout/app-shell";
import VariationTotalsWidget from "@/components/meals/variation-totals-widget";
import MealCategoriesWidget from "@/components/meals/meal-categories-widget";
import type { Meal } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/app/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from "react";

export default function MealsPage() {
    const { 
        activePlan, 
        isPlansLoading,
        dishes,
        todaysMeals,
        setMealsForVariation,
        activeVariationId,
        setActiveVariationId,
    } = useAppContext();

    const currentVariations = activePlan?.variations || [];
    
    // Effect to ensure activeVariationId is valid when component mounts or plan changes
    useEffect(() => {
        if (activePlan && !activePlan.variations.find(v => v.id === activeVariationId)) {
            setActiveVariationId(activePlan.variations[0]?.id);
        }
    }, [activePlan, activeVariationId, setActiveVariationId]);

    const handleMealsChange = (newMeals: Meal[]) => {
        if (!activeVariationId) return;
        setMealsForVariation(activeVariationId, newMeals);
    };

    if (isPlansLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AppShell>
        );
    }

    if (!activePlan) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-full">
                     <Card className="glass-card max-w-md text-center">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center justify-center gap-2">
                                <FileWarning />
                                Nenhum Plano Ativo
                            </CardTitle>
                             <CardDescription>
                                É necessário ter um plano de dieta ativo para gerir as refeições.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Link href="/plan" className='text-primary font-bold underline'>
                                Ative um plano agora
                           </Link>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="flex flex-col items-center w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Calendário de Refeições</h1>
                    <p className="mt-2 text-sm text-primary">
                        Plano ativo: <span className="font-semibold">{activePlan.name}</span>
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto space-y-6">
                    {currentVariations.length > 0 && activeVariationId && (
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-foreground">Variação do Dia</h2>
                            <Select value={activeVariationId} onValueChange={setActiveVariationId}>
                                <SelectTrigger className="w-full sm:w-[220px]">
                                    <SelectValue placeholder="Selecione a variação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentVariations.map(v => (
                                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <VariationTotalsWidget meals={todaysMeals} planTargets={activePlan.targets} />
                    
                    <MealCategoriesWidget 
                        key={activeVariationId} // Force re-render on variation change
                        meals={todaysMeals}
                        onMealsChange={handleMealsChange}
                        savedDishes={dishes}
                    />
                </div>
            </div>
        </AppShell>
    );
}
