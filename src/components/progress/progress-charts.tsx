'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, BarChart3, Weight, Percent } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { BodyMeasurement } from "@/lib/types";
import { useMemo, useEffect, useState } from "react";
import { useAppContext } from "@/app/context/AppContext";
import { useUser } from "@/firebase";

const bodyTrendsConfig = {
  weight: { label: "Peso", color: "hsl(var(--chart-1))", icon: Weight },
  bodyFat: { label: "% Gordura", color: "hsl(var(--chart-2))", icon: Percent },
};

const adherenceConfig = {
  calories: { label: "Calorias Consumidas", color: "hsl(var(--primary))" },
  target: { label: "Meta de Calorias", color: "hsl(var(--muted-foreground))" },
};

const formatDate = (dateString: string) => format(new Date(dateString), "d MMM", { locale: pt });

const getBarColor = (value: number, target: number) => {
  const overage = value - target;
  if (overage <= 0) return "hsl(var(--primary))"; // At or below target
  
  const percentageOver = Math.min(overage / (target * 0.25), 1); // Cap at 25% overage for full color change
  
  // HSL interpolation from primary (258) to destructive (0)
  const hue = 258 - (258 * percentageOver);
  const saturation = 100 - (37 * percentageOver); // From 100% to 63%
  const lightness = 80 - (49 * percentageOver); // From 80% to 31%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function ProgressCharts({ measurements }: { measurements: BodyMeasurement[] }) {
  const { activePlan, consumedTotals } = useAppContext();
  const { user } = useUser();
  const [adherenceData, setAdherenceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate body fat for each measurement
  const bodyTrendsData = useMemo(() => measurements.map(m => {
    // A real implementation would get gender and height from user profile
    const heightInMeters = 180 / 100;
    let bodyFat = 0;
    if (m.neck && m.waist && heightInMeters) {
      // Simplified US Navy formula for demonstration
       bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(m.waist - m.neck) + 0.15456 * Math.log10(heightInMeters * 100)) - 450;
    }

    return {
      date: m.date,
      weight: m.weight,
      bodyFat: bodyFat > 0 ? bodyFat : undefined,
    }
  }), [measurements]);

  // Create adherence data based on today's consumption
  const todayAdherenceData = useMemo(() => {
    if (!activePlan) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    return [{
      date: today,
      calories: consumedTotals.calories,
      target: activePlan.targets.calories,
      protein: consumedTotals.protein,
      carbs: consumedTotals.carbs,
      fat: consumedTotals.fat
    }];
  }, [activePlan, consumedTotals]);

  // For now, we'll use today's data until we implement historical data fetching
  useEffect(() => {
    setAdherenceData(todayAdherenceData);
  }, [todayAdherenceData]);

  if (measurements.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-muted-foreground/20 rounded-lg">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Dados Insuficientes</h3>
        <p className="mt-2 text-sm text-muted-foreground">Adicione pelo menos duas medições para ver os seus gráficos de progresso.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp /> Tendências Corporais</CardTitle>
          <CardDescription>Evolução do seu peso e percentagem de gordura corporal.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={bodyTrendsConfig} className="h-64 w-full">
            <AreaChart data={bodyTrendsData} margin={{ left: -15, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillBodyFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-bodyFat)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-bodyFat)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" tickFormatter={formatDate} tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis yAxisId="weight" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']}/>
              <YAxis yAxisId="bodyFat" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']}/>
              <ChartTooltip cursor={{ stroke: "hsl(var(--border))" }} content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="weight" type="natural" fill="url(#fillWeight)" stroke="var(--color-weight)" strokeWidth={2.5} yAxisId="weight" name="Peso (kg)" dot={false} />
              <Area dataKey="bodyFat" type="natural" fill="url(#fillBodyFat)" stroke="var(--color-bodyFat)" strokeWidth={2} yAxisId="bodyFat" name="% Gordura" dot={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 /> Adesão ao Plano</CardTitle>
          <CardDescription>Consistência diária em relação à sua meta de calorias.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ChartContainer config={adherenceConfig} className="h-64 w-full">
              <BarChart data={adherenceData} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="date" tickFormatter={formatDate} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip 
                  cursor={{ fill: "hsl(var(--muted)/0.5)" }} 
                  content={<ChartTooltipContent
                      formatter={(value, name, props) => {
                          const { payload } = props;
                          if (name === 'calories') {
                              return (
                                  <>
                                      <div>
                                          <span className="font-semibold">Consumido: </span>
                                          <span>{Math.round(value as number)} kcal</span>
                                      </div>
                                      <div>
                                          <span className="font-semibold">Meta: </span>
                                          <span>{payload.target} kcal</span>
                                      </div>
                                      <div className="mt-1">
                                          <span className="font-semibold">Diferença: </span>
                                          <span>{Math.round((value as number) - payload.target)} kcal</span>
                                      </div>
                                  </>
                              )
                          }
                          return null
                      }}
                  />} 
                />
                <Bar
                  dataKey="calories"
                  name="calorias"
                  radius={[8, 8, 0, 0]}
                  barSize={30}
                >
                  {adherenceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={getBarColor(entry.calories, entry.target)}
                      className="transition-opacity"
                      opacity={0.8}
                      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}