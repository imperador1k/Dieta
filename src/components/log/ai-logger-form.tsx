'use client';

import { useActionState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getNutritionalInfo, type AiLoggerState } from '@/app/log/actions';
import { Bot, Loader2, Plus, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialState: AiLoggerState = {
  timestamp: Date.now(),
};

export function AiLoggerForm() {
  const [state, formAction, isPending] = useActionState(getNutritionalInfo, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: state.error,
      });
    }
  }, [state.error, state.timestamp, toast]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <Textarea
          name="foodDescription"
          placeholder="Ex: comi 150g de frango com batata doce e um fio de azeite"
          rows={3}
          className="bg-background/80 text-base"
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analisar com IA
        </Button>
      </form>

      {isPending && (
        <Card className="animate-pulse">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5" /> Analisando...</CardTitle>
                <CardDescription>A nossa IA está a calcular os valores nutricionais...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
                <div className="h-4 bg-muted/50 rounded-md w-1/2"></div>
            </CardContent>
        </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
            <CardDescription>Confirme os alimentos encontrados antes de adicionar ao seu diário.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Alimento</TableHead>
                          <TableHead className="text-right">Calorias</TableHead>
                          <TableHead className="text-right">Proteína</TableHead>
                          <TableHead className="text-right">Carbs</TableHead>
                          <TableHead className="text-right">Gordura</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {Object.entries(state.result.estimatedNutritionalValues).map(([food, values]) => (
                          <TableRow key={food}>
                              <TableCell className="font-medium capitalize">{food}</TableCell>
                              <TableCell className="text-right">{values.calories?.toFixed(0) ?? '-'}</TableCell>
                              <TableCell className="text-right">{values.protein?.toFixed(1) ?? '-'}g</TableCell>
                              <TableCell className="text-right">{values.carbohydrates?.toFixed(1) ?? '-'}g</TableCell>
                              <TableCell className="text-right">{values.fat?.toFixed(1) ?? '-'}g</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><Plus className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive"></Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </div>
            <Button className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar todos ao diário
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
