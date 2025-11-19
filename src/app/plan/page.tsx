'use client';

import { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import PlanList from '@/components/plan/plan-list';
import PlanDetails from '@/components/plan/plan-details';
import type { Plan, Variation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';


export default function PlanPage() {
    const { plans, isPlansLoading, setActivePlan, updatePlanVariations, profile } = useAppContext();
    const { firestore, user } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();
    const activePlan = plans.find(p => p.isActive);
    
    // The selected plan for viewing, defaults to active plan, but can be changed
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        if (!isPlansLoading && plans.length > 0) {
            // Set initial selected plan to the active one, or the first one.
            if (!selectedPlan) {
                setSelectedPlan(activePlan || plans[0]);
            } else {
                // Update selectedPlan if it has been updated in the plans array
                const updatedPlan = plans.find(p => p.id === selectedPlan.id);
                if (updatedPlan && JSON.stringify(updatedPlan) !== JSON.stringify(selectedPlan)) {
                    setSelectedPlan(updatedPlan);
                }
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
    
    const handleCreatePlan = async () => {
        if (!user) {
            toast({
                title: "Erro",
                description: "Precisa de estar autenticado para criar um plano.",
                variant: "destructive",
            });
            return;
        }

        try {
            // Create a default plan structure
            const defaultVariation: Variation = {
                id: 'default',
                name: 'Plano Base'
            };

            const newPlan = {
                name: 'Novo Plano de Dieta',
                description: 'Descrição do seu novo plano',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                isActive: plans.length === 0, // Make it active if it's the first plan
                targets: {
                    calories: profile?.age && profile?.height && profile?.gender 
                        ? Math.round(calculateCalories(profile.age, profile.height, profile.gender)) 
                        : 2000,
                    protein: 150,
                    carbohydrates: 250,
                    fat: 70
                },
                variations: [defaultVariation]
            };

            // Add the new plan to Firestore
            const plansRef = collection(firestore, `users/${user.uid}/userGoals`);
            await addDocumentNonBlocking(plansRef, newPlan);
            
            toast({
                title: "Plano criado",
                description: "O seu novo plano foi criado com sucesso.",
            });
        } catch (error) {
            console.error('Error creating plan:', error);
            toast({
                title: "Erro ao criar plano",
                description: "Ocorreu um erro ao criar o plano. Por favor, tente novamente.",
                variant: "destructive",
            });
        }
    };
    
    // Simple calorie calculation based on profile
    const calculateCalories = (age: number, height: number, gender: 'male' | 'female'): number => {
        // Basic Harris-Benedict equation (simplified)
        let bmr = 0;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * 70) + (4.799 * height) - (5.677 * age); // Assuming 70kg default weight
        } else {
            bmr = 447.593 + (9.247 * 70) + (3.098 * height) - (4.330 * age); // Assuming 70kg default weight
        }
        
        // Multiply by activity factor (sedentary = 1.2)
        return bmr * 1.2;
    };
    
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

    if (!selectedPlan && plans.length === 0) {
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
                            <p className="text-muted-foreground mb-6">
                                Ainda não tem nenhum plano de dieta. Comece por criar um.
                            </p>
                            <Button onClick={handleCreatePlan} className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Criar Primeiro Plano
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestão de Planos</h1>
                        <p className="text-muted-foreground">Crie e gerencie seus planos de dieta personalizados</p>
                    </div>
                    <Button onClick={handleCreatePlan} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Plano
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="glass-card border-0 shadow-lg">
                            <CardHeader className="border-b border-white/10">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="text-primary" />
                                    Meus Planos
                                </CardTitle>
                                <CardDescription>
                                    Selecione um plano para ver detalhes ou criar um novo
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <PlanList 
                                    plans={plans}
                                    selectedPlanId={selectedPlan?.id || ''}
                                    onSelectPlan={handleSelectPlan}
                                    onCreatePlan={handleCreatePlan}
                                />
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="lg:col-span-2">
                        {selectedPlan ? (
                            <PlanDetails 
                                key={selectedPlan.id}
                                plan={selectedPlan}
                                onSetActive={handleSetActivePlan}
                                onVariationsChange={(newVariations) => updatePlanVariations(selectedPlan.id, newVariations)}
                            />
                        ) : (
                            <Card className="glass-card border-0 shadow-lg h-full flex items-center justify-center">
                                <CardContent className="text-center py-12">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Nenhum plano selecionado</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Selecione um plano da lista ou crie um novo para começar
                                    </p>
                                    <Button onClick={handleCreatePlan}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Criar Primeiro Plano
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}