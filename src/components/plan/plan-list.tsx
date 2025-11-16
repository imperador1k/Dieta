'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "./types";


export default function PlanList({ plans, selectedPlanId, onSelectPlan }: { plans: Plan[], selectedPlanId: string, onSelectPlan: (plan: Plan) => void }) {
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText />
                        Meus Planos
                    </CardTitle>
                    <Button variant="ghost" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Criar
                    </Button>
                </div>
                <CardDescription>
                    Gira os teus planos de dieta. O plano ativo ditará as tuas metas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {plans.map((plan) => (
                        <li key={plan.id}>
                            <button
                                onClick={() => onSelectPlan(plan)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all",
                                    selectedPlanId === plan.id 
                                        ? "bg-primary/10 border-primary/50 shadow-inner" 
                                        : "bg-muted/30 border-transparent hover:bg-muted/60"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{plan.name}</p>
                                    {plan.isActive && <CheckCircle className="w-5 h-5 text-primary" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
