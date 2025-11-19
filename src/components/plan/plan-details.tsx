'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, CheckCircle, Repeat, Fish, Wheat, Droplet, Pencil, Save, X } from "lucide-react";
import PlanDayVariation from "./plan-day-variation";
import type { Plan, Variation } from "@/lib/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/app/context/AppContext";


const MacroStat = ({ label, value, unit, color, Icon }: { label: string, value: number, unit: string, color: string, Icon: React.ElementType }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
        <Icon className="w-6 h-6 mb-2" style={{ color }}/>
        <p className="text-2xl font-bold">{value}{unit}</p>
        <p className="text-sm text-muted-foreground -mt-1">{label}</p>
    </div>
);

interface PlanDetailsProps {
    plan: Plan;
    onSetActive: (planId: string) => void;
    onVariationsChange: (variations: Variation[]) => void;
}

export default function PlanDetails({ plan, onSetActive, onVariationsChange }: PlanDetailsProps) {
    const { updatePlan } = useAppContext();
    const { toast } = useToast();
    
    // Editing states
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState({...plan});
    const [isSaving, setIsSaving] = useState(false);
    
    // Update editedPlan when plan prop changes
    useEffect(() => {
        setEditedPlan({...plan});
    }, [plan]);
    
    // Handle input changes
    const handleInputChange = (field: string, value: string | number) => {
        setEditedPlan(prev => ({
            ...prev,
            [field]: value
        }));
    };
    
    // Handle target changes
    const handleTargetChange = (target: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedPlan(prev => ({
            ...prev,
            targets: {
                ...prev.targets,
                [target]: numValue
            }
        }));
    };
    
    // Start editing
    const handleEdit = () => {
        setEditedPlan({...plan});
        setIsEditing(true);
    };
    
    // Cancel editing
    const handleCancel = () => {
        setEditedPlan({...plan});
        setIsEditing(false);
    };
    
    // Save changes
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePlan(plan.id, editedPlan);
            
            toast({
                title: "Plano atualizado",
                description: "As alterações ao plano foram guardadas com sucesso.",
            });
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating plan:', error);
            toast({
                title: "Erro ao atualizar",
                description: "Ocorreu um erro ao guardar as alterações. Por favor, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="glass-card border-0 shadow-lg">
                <CardHeader className="border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                            {isEditing ? (
                                <div className="space-y-4 w-full">
                                    <Input
                                        value={editedPlan.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="text-2xl font-bold w-full"
                                        placeholder="Nome do plano"
                                    />
                                    <Textarea
                                        value={editedPlan.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="text-muted-foreground w-full min-h-[100px]"
                                        placeholder="Descrição do plano"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
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
                                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {!plan.isActive && (
                                <Button onClick={() => onSetActive(plan.id)} size="sm">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Ativar Plano
                                </Button>
                            )}
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave} disabled={isSaving} size="sm">
                                        {isSaving ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin">
                                                    <div className="h-full w-full rounded-full border-2 border-current border-t-transparent"></div>
                                                </div>
                                                A guardar...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Guardar
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel} size="sm">
                                        <X className="w-4 h-4 mr-2" />
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" onClick={handleEdit} size="sm">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="bg-muted/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary"/> 
                            Metas Nutricionais
                        </h3>
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="calories">Calorias (kcal)</Label>
                                    <Input
                                        id="calories"
                                        type="number"
                                        value={editedPlan.targets?.calories || 0}
                                        onChange={(e) => handleTargetChange('calories', e.target.value)}
                                        className="text-2xl font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="protein">Proteína (g)</Label>
                                    <Input
                                        id="protein"
                                        type="number"
                                        value={editedPlan.targets?.protein || 0}
                                        onChange={(e) => handleTargetChange('protein', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carbs">Hidratos (g)</Label>
                                    <Input
                                        id="carbs"
                                        type="number"
                                        value={editedPlan.targets?.carbs || 0}
                                        onChange={(e) => handleTargetChange('carbs', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fat">Gordura (g)</Label>
                                    <Input
                                        id="fat"
                                        type="number"
                                        value={editedPlan.targets?.fat || 0}
                                        onChange={(e) => handleTargetChange('fat', e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10 text-primary">
                                    <Flame className="w-8 h-8 mb-1"/>
                                    <p className="text-2xl font-bold">{plan.targets.calories}</p>
                                    <p className="text-sm -mt-1">kcal</p>
                                </div>
                                <MacroStat label="Proteína" value={plan.targets.protein} unit="g" color="hsl(var(--chart-1))" Icon={Fish} />
                                <MacroStat label="Hidratos" value={plan.targets.carbs} unit="g" color="hsl(var(--chart-2))" Icon={Wheat} />
                                <MacroStat label="Gordura" value={plan.targets.fat} unit="g" color="hsl(var(--chart-3))" Icon={Droplet} />
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Repeat className="w-5 h-5 text-primary"/> 
                            Variações do Dia
                        </h3>
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