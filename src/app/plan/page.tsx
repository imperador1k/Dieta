'use client';

import { useState } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import PlanList from '@/components/plan/plan-list';
import PlanDetails from '@/components/plan/plan-details';
import type { Plan } from '@/components/plan/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const initialPlans: Plan[] = [
    {
        id: 'plan-1',
        name: 'Emagrecimento Intensivo',
        description: 'Focado na perda de gordura, mantendo a massa muscular.',
        isActive: true,
        targets: { calories: 2200, protein: 180, carbs: 200, fat: 70 },
        variations: [
            { id: 'var-1', name: 'Dia de Treino A (Cardio)' },
            { id: 'var-2', name: 'Dia de Treino B (Força)' },
            { id: 'var-3', name: 'Dia de Descanso' },
        ],
    },
    {
        id: 'plan-2',
        name: 'Manutenção Muscular',
        description: 'Plano para manter o peso atual e a composição corporal.',
        isActive: false,
        targets: { calories: 2800, protein: 200, carbs: 300, fat: 90 },
        variations: [
             { id: 'var-4', name: 'Dia Normal' },
        ],
    },
];


export default function PlanPage() {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans.find(p => p.isActive) ?? plans[0] ?? null);

    const setActivePlan = (planId: string) => {
        const newPlans = plans.map(p => ({ ...p, isActive: p.id === planId }));
        setPlans(newPlans);
        setSelectedPlan(newPlans.find(p => p.id === planId) ?? null);
    };
    
    if (!selectedPlan) {
        return (
             <AppShell>
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Card className="glass-card max-w-md">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center justify-center gap-2">
                                <FileText />
                                Arquiteto da Dieta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Ainda não tem nenhum plano de dieta. Comece por criar um.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                   <PlanList 
                        plans={plans}
                        selectedPlanId={selectedPlan.id}
                        onSelectPlan={setSelectedPlan}
                   />
                </div>
                <div className="lg:col-span-2">
                    <PlanDetails 
                        key={selectedPlan.id}
                        plan={selectedPlan}
                        onSetActive={setActivePlan}
                    />
                </div>
            </div>
        </AppShell>
    );
}
