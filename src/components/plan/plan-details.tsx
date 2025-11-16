
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, CheckCircle, Repeat } from "lucide-react";
import PlanDayVariation from "./plan-day-variation";
import type { Plan, Variation } from "@/lib/types";
import { motion } from "framer-motion";


const MacroStat = ({ label, value, unit, color }: { label: string, value: number, unit: string, color: string }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold" style={{ color }}>{value}{unit}</p>
    </div>
);

interface PlanDetailsProps {
    plan: Plan;
    onSetActive: (planId: string) => void;
    onVariationsChange: (variations: Variation[]) => void;
}

export default function PlanDetails({ plan, onSetActive, onVariationsChange }: PlanDetailsProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="glass-card h-full">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                {plan.isActive ? (
                                    <Badge variant="default" className="bg-primary/20 text-primary border-primary/40">
                                        <CheckCircle className="w-3 h-3 mr-1.5" />
                                        Ativo
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Inativo</Badge>
                                )}
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                        </div>
                         {!plan.isActive && (
                            <Button onClick={() => onSetActive(plan.id)}>Ativar Plano</Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-primary"/> Metas Nutricionais</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10 text-primary-foreground col-span-2 md:col-span-1">
                                <p className="text-sm text-primary">Calorias</p>
                                <p className="text-4xl font-bold text-primary">{plan.targets.calories}</p>
                                <p className="text-sm text-primary">kcal</p>
                            </div>
                            <MacroStat label="Proteína" value={plan.targets.protein} unit="g" color="hsl(var(--chart-1))" />
                            <MacroStat label="Hidratos" value={plan.targets.carbs} unit="g" color="hsl(var(--chart-2))" />
                            <MacroStat label="Gordura" value={plan.targets.fat} unit="g" color="hsl(var(--chart-3))" />
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Repeat className="w-5 h-5 text-primary"/> Variações do Dia</h3>
                        <PlanDayVariation 
                            variations={plan.variations} 
                            onVariationsChange={onVariationsChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
