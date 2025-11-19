'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, PlusCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/types";


export default function PlanList({ plans, selectedPlanId, onSelectPlan, onCreatePlan }: { plans: Plan[], selectedPlanId: string, onSelectPlan: (plan: Plan) => void, onCreatePlan: () => void }) {
    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {plans.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Comece criando seu primeiro plano de dieta
                        </p>
                        <Button onClick={onCreatePlan} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Criar Primeiro Plano
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {plans.map((plan) => (
                            <Card 
                                key={plan.id}
                                onClick={() => onSelectPlan(plan)}
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-md",
                                    selectedPlanId === plan.id 
                                        ? "border-primary shadow-lg" 
                                        : "border-transparent hover:border-primary/30"
                                )}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-lg truncate">{plan.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
                                        </div>
                                        {plan.isActive && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full ml-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Ativo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-amber-500 font-semibold mt-3 pt-3 border-t border-white/5">
                                        <Flame className="w-4 h-4"/>
                                        <span>{plan.targets.calories} kcal</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}