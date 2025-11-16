
'use client';

import { useState } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import PlanList from '@/components/plan/plan-list';
import PlanDetails from '@/components/plan/plan-details';
import type { Plan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';


export default function PlanPage() {
    const { plans, setActivePlan, updatePlanVariations } = useAppContext();
    const activePlan = plans.find(p => p.isActive);
    
    // The selected plan for viewing, defaults to active plan, but can be changed
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(activePlan ?? plans[0] ?? null);

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
    }
    
    // When the active plan is changed, also update the selected plan to match
    const handleSetActivePlan = (planId: string) => {
        setActivePlan(planId);
        const newActivePlan = plans.find(p => p.id === planId);
        if (newActivePlan) {
            setSelectedPlan(newActivePlan);
        }
    }
    
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                   <PlanList 
                        plans={plans}
                        selectedPlanId={selectedPlan.id}
                        onSelectPlan={handleSelectPlan}
                   />
                </div>
                <div className="lg:col-span-2">
                    <PlanDetails 
                        key={selectedPlan.id}
                        plan={selectedPlan}
                        onSetActive={handleSetActivePlan}
                        onVariationsChange={(newVariations) => updatePlanVariations(selectedPlan.id, newVariations)}
                    />
                </div>
            </div>
        </AppShell>
    );
}
