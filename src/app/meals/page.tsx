
'use client';

import { AppShell } from "@/components/layout/app-shell";
import DailyBalanceWidget from "@/components/meals/daily-balance-widget";
import MealCategoriesWidget from "@/components/meals/meal-categories-widget";

export default function MealsPage() {
    const activePlan = "Plano de Emagrecimento Intensivo";

    return (
        <AppShell>
            <div className="flex flex-col items-center w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Refeições do Dia</h1>
                    <p className="mt-2 text-sm text-primary">
                        Plano ativo: <span className="font-semibold">{activePlan}</span>
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto space-y-6">
                    <DailyBalanceWidget />
                    <MealCategoriesWidget />
                </div>
            </div>
        </AppShell>
    );
}
