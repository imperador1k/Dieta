'use client';

import { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import PlanList from '@/components/plan/plan-list';
import PlanDetails from '@/components/plan/plan-details';
import type { Plan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';


export default function PlanPage() {
    const { plans, isPlansLoading, setActivePlan, updatePlanVariations } = useAppContext();
    const activePlan = plans.find(p => p.isActive);
    
    // The selected plan for viewing, defaults to active plan, but can be changed
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        if (!isPlansLoading && plans.length > 0) {
            // Set initial selected plan to the active one, or the first one.
            if (!selectedPlan) {
                setSelectedPlan(activePlan || plans[0]);
            }
        }
    }, [plans, isPlansLoading, activePlan, selectedPlan]);

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
    
    const isLoading = isPlansLoading && plans.length === 0;

    if (isLoading) {
        return (
             <AppShell>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-3">
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-[500px] w-full" />
                    </div>
                </div>
            </AppShell>
        );
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
