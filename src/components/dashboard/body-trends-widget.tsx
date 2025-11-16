'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const chartData = [
  { month: "Jan", weight: 80, fat: 20 },
  { month: "Feb", weight: 79, fat: 19.5 },
  { month: "Mar", weight: 78.5, fat: 19 },
  { month: "Apr", weight: 77, fat: 18 },
  { month: "May", weight: 76.5, fat: 17.5 },
  { month: "Jun", weight: 76, fat: 17 },
];

const chartConfig = {
  weight: {
    label: "Peso (kg)",
    color: "hsl(var(--primary))",
  },
  fat: {
    label: "% Gordura",
    color: "hsl(var(--accent))",
  },
};

export default function BodyTrendsWidget() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline">Tendências Corporais</CardTitle>
        <Tabs defaultValue="3m" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="1m" className="text-xs h-6">1M</TabsTrigger>
                <TabsTrigger value="3m" className="text-xs h-6">3M</TabsTrigger>
                <TabsTrigger value="6m" className="text-xs h-6">6M</TabsTrigger>
            </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 4 }}
          >
            <defs>
              <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillFat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-fat)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-fat)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted-foreground/30"/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="weight"
              type="natural"
              fill="url(#fillWeight)"
              stroke="var(--color-weight)"
              strokeWidth={2}
            />
             <Area
              dataKey="fat"
              type="natural"
              fill="url(#fillFat)"
              stroke="var(--color-fat)"
              strokeWidth={2}
              className="chart-glow"
            />
             <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
