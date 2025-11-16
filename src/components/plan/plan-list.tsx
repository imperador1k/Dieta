'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "./types";


export default function PlanList({ plans, selectedPlanId, onSelectPlan }: { plans: Plan[], selectedPlanId: string, onSelectPlan: (plan: Plan) => void }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                    <FileText className="text-primary"/>
                    Meus Planos
                </h2>
                <Button variant="ghost" size="sm">
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
                                "w-full text-left p-4 rounded-lg border transition-all glass-card",
                                selectedPlanId === plan.id 
                                    ? "bg-primary/20 border-primary/60 shadow-lg shadow-primary/10" 
                                    : "bg-muted/30 border-transparent hover:bg-muted/60 hover:border-primary/20"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-lg">{plan.name}</p>
                                {plan.isActive && <CheckCircle className="w-5 h-5 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
