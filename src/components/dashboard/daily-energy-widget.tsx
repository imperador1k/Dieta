'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { Drumstick, Wheat, Droplet } from "lucide-react";
import { RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  calories: { label: "Calories", color: "hsl(var(--primary))" },
  protein: { label: "Proteína", color: "hsl(var(--chart-2))", icon: Drumstick },
  carbs: { label: "Carbs", color: "hsl(var(--chart-3))", icon: Wheat },
  fat: { label: "Gordura", color: "hsl(var(--chart-4))", icon: Droplet },
};

export default function DailyEnergyWidget() {
  const totalCalories = 2250;
  const goalCalories = 2500;
  const progress = (totalCalories / goalCalories) * 100;

  const macros = {
      protein: { consumed: 120, goal: 180 },
      carbs: { consumed: 250, goal: 300 },
      fat: { consumed: 60, goal: 70 },
  }

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Energia Diária</CardTitle>
        <CardDescription>Consumo vs. Meta</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={[{ name: "calories", value: progress, fill: "hsl(var(--primary))" }]}
            startAngle={90}
            endAngle={-270}
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
            style={{ filter: "drop-shadow(0 4px 8px hsl(var(--primary) / 0.5))" }}
          >
            <RadialBar
              background={{ fill: "hsl(var(--primary) / 0.1)" }}
              dataKey="value"
              cornerRadius={6}
            />
            <g>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-5xl font-bold font-headline">
                    {totalCalories}
                </text>
                 <text x="50%" y="50%" dy="1.6em" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-lg">
                    / {goalCalories} kcal
                </text>
            </g>
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-sm text-center">
            {Object.entries(macros).map(([key, { consumed, goal }]) => {
                const macroInfo = chartConfig[key as keyof typeof chartConfig];
                const MacroIcon = macroInfo.icon;
                const color = macroInfo.color;
                return (
                    <div key={key} className="flex flex-col items-center gap-1">
                        <MacroIcon className="w-5 h-5" style={{ color }} />
                        <span className="font-semibold text-lg">{consumed}g</span>
                        <span className="text-xs text-muted-foreground">/ {goal}g</span>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
