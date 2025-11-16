
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, PlusCircle, Utensils } from "lucide-react";

const variations = [
    { id: "descanso", label: "Dia de Descanso" },
    { id: "treino-a", label: "Dia de Treino A" },
    { id: "treino-b", label: "Dia de Treino B" },
];

export default function MealCategoriesWidget() {
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Categorias do Dia</CardTitle>
                        <CardDescription>Edite as categorias da sua variação ou marque as que já comeu.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Categoria
                        </Button>
                        
                        <Select defaultValue="descanso">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione a variação" />
                            </SelectTrigger>
                            <SelectContent>
                                {variations.map(v => (
                                    <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar Variações</DropdownMenuItem>
                                <DropdownMenuItem>Limpar Seleções</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-20 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center">
                    <Utensils className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">O seu dia está vazio</h3>
                    <p className="mt-2 text-sm max-w-sm">Adicione categorias como "Pequeno-almoço" ou "Almoço" para começar a organizar as suas refeições.</p>
                </div>
            </CardContent>
        </Card>
    )
}
