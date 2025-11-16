'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, BarChart3, Target, Weight, Percent } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

// Mock Data
const bodyTrendsData = [
  { date: "2024-01-15", weight: 80, bodyFat: 20 },
  { date: "2024-02-01", weight: 79.5, bodyFat: 19.8 },
  { date: "2024-02-15", weight: 78.5, bodyFat: 19.2 },
  { date: "2024-03-01", weight: 78, bodyFat: 18.9 },
  { date: "2024-03-15", weight: 77, bodyFat: 18.5 },
  { date: "2024-04-01", weight: 76.8, bodyFat: 18.2 },
  { date: "2024-04-15", weight: 76, bodyFat: 17.8 },
  { date: "2024-05-01", weight: 75.5, bodyFat: 17.5 },
];

const adherenceData = [
  { date: "2024-05-01", calories: 2250, target: 2200 },
  { date: "2024-05-02", calories: 2180, target: 2200 },
  { date: "2024-05-03", calories: 2350, target: 2200 },
  { date: "2024-05-04", calories: 2100, target: 2200 },
  { date: "2024-05-05", calories: 2210, target: 2200 },
  { date: "2024-05-06", calories: 2050, target: 2200 },
  { date: "2024-05-07", calories: 2450, target: 2200 },
];

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
}


export default function ProgressCharts() {
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
              <YAxis yAxisId="weight" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} />
              <YAxis yAxisId="bodyFat" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} />
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
                                        <span>{value} kcal</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Meta: </span>
                                        <span>{payload.target} kcal</span>
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
        </CardContent>
      </Card>
    </div>
  );
}
