'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Drumstick, Wheat, Droplet } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  calories: { label: "Calories", color: "hsl(var(--primary))" },
  protein: { label: "Proteína", color: "hsl(var(--chart-2))", icon: Drumstick },
  carbs: { label: "Carbs", color: "hsl(var(--chart-3))", icon: Wheat },
  fat: { label: "Gordura", color: "hsl(var(--chart-4))", icon: Droplet },
};

export default function DailyEnergyWidget() {
  const totalCalories = 2250;
  const goalCalories = 2500;

  const macros = {
      protein: { consumed: 120, goal: 180 },
      carbs: { consumed: 250, goal: 300 },
      fat: { consumed: 60, goal: 70 },
  }

  const chartData = [
    { name: 'calories', value: (totalCalories / goalCalories) * 100, fill: 'var(--color-calories)' },
    { name: 'protein', value: (macros.protein.consumed / macros.protein.goal) * 100, fill: 'var(--color-protein)' },
    { name: 'carbs', value: (macros.carbs.consumed / macros.carbs.goal) * 100, fill: 'var(--color-carbs)' },
    { name: 'fat', value: (macros.fat.consumed / macros.fat.goal) * 100, fill: 'var(--color-fat)' },
  ];

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-headline">Energia Diária</CardTitle>
        <CardDescription>Consumo vs. Meta</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px] lg:max-w-[300px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="30%"
            outerRadius="100%"
            barSize={10}
            barGap={4}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
            <RadialBar
              background={{ fill: "hsl(var(--primary) / 0.1)" }}
              dataKey="value"
              cornerRadius={6}
            />
            <g className="fill-foreground text-5xl font-bold font-headline" style={{ filter: "drop-shadow(0 4px 8px hsl(var(--primary) / 0.5))" }}>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    {totalCalories}
                </text>
                 <text x="50%" y="50%" dy="1.6em" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-lg font-sans">
                    / {goalCalories} kcal
                </text>
            </g>
             <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => {
                    const config = chartConfig[name as keyof typeof chartConfig];
                    if (!config) return null;

                    const dataKey = name as keyof typeof macros;

                    if(name === 'calories') {
                         return (
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-semibold" style={{ color: config.color }}>Calorias</span>
                                <span className="text-sm">{totalCalories.toFixed(0)} / {goalCalories.toFixed(0)} kcal</span>
                            </div>
                        )
                    }

                    if (dataKey in macros) {
                        const macro = macros[dataKey];
                        return (
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-semibold" style={{ color: config.color }}>{config.label}</span>
                                <span className="text-sm">{macro.consumed.toFixed(0)} / {macro.goal.toFixed(0)} g</span>
                            </div>
                        )
                    }
                    return null;
                  }}
                />
              }
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-sm text-center">
            {Object.entries(macros).map(([key, { consumed, goal }]) => {
                const macroInfo = chartConfig[key as keyof typeof chartConfig];
                const MacroIcon = macroInfo.icon;
                const color = macroInfo.color;
                return (
                    <div key={key} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="relative">
                            <MacroIcon className="w-6 h-6" style={{ color }} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: color, filter: `drop-shadow(0 0 4px ${color})`}}></div>
                        </div>
                        <span className="font-semibold text-xl">{consumed}g</span>
                        <span className="text-xs text-muted-foreground">/ {goal}g</span>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}