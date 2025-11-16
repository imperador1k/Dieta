
'use client';

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { MoreVertical, PlusCircle, Trash2 } from "lucide-react";
import type { Variation } from "@/lib/types";
import { useState } from "react";

type PlanDayVariationProps = {
    variations: Variation[];
    onVariationsChange: (variations: Variation[]) => void;
};

export default function PlanDayVariation({ variations, onVariationsChange }: PlanDayVariationProps) {
    const [newVariationName, setNewVariationName] = useState("");

    const addVariation = () => {
        if (newVariationName.trim() === "") return;
        const newVariation: Variation = {
            id: `var-${Date.now()}`,
            name: newVariationName,
        };
        onVariationsChange([...variations, newVariation]);
        setNewVariationName("");
    };

    const removeVariation = (id: string) => {
        onVariationsChange(variations.filter(v => v.id !== id));
    };

    return (
        <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-3">
                <div className="flex flex-col gap-2">
                    {variations.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-2 rounded-md bg-background/50">
                            <span className="font-medium text-sm">{v.name}</span>
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={() => removeVariation(v.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Nome da nova variação" 
                        value={newVariationName}
                        onChange={(e) => setNewVariationName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addVariation()}
                    />
                    <Button onClick={addVariation}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
