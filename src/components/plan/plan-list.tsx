'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, PlusCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/types";


export default function PlanList({ plans, selectedPlanId, onSelectPlan, onCreatePlan }: { plans: Plan[], selectedPlanId: string, onSelectPlan: (plan: Plan) => void, onCreatePlan: () => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                    <FileText className="text-primary"/>
                    Meus Planos
                </h2>
                <Button variant="ghost" size="sm" onClick={onCreatePlan}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar
                </Button>
            </div>
             <p className="text-sm text-muted-foreground">
                Gira os teus planos de dieta. O plano ativo ditará as tuas metas.
            </p>
            <ul className="space-y-3">
                {plans.map((plan) => (
                    <li key={plan.id}>
                        <button
                            onClick={() => onSelectPlan(plan)}
                            className={cn(
                                "w-full text-left p-4 rounded-lg border-2 transition-all glass-card",
                                selectedPlanId === plan.id 
                                    ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10" 
                                    : "bg-muted/20 border-transparent hover:bg-muted/40 hover:border-primary/20"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <p className="font-semibold text-lg">{plan.name}</p>
                                {plan.isActive && (
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Ativo</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                            <div className="flex items-center gap-2 text-sm text-amber-400 font-semibold mt-3 pt-3 border-t border-white/5">
                                <Flame className="w-4 h-4"/>
                                <span>{plan.targets.calories} kcal</span>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}