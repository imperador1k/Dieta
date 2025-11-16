'use client';

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { MoreVertical, PlusCircle, Trash2 } from "lucide-react";

type Variation = {
    id: string;
    name: string;
};

export default function PlanDayVariation({ variations }: { variations: Variation[] }) {

    return (
        <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-3">
                <div className="flex flex-col gap-2">
                    {variations.map(v => (
                        <div key={v.id} className="flex items-center justify-between p-2 rounded-md bg-background/50">
                            <span className="font-medium text-sm">{v.name}</span>
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Variação
                </Button>
            </CardContent>
        </Card>
    );
}
