'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Weight, Percent, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
    color: "hsl(var(--chart-1))",
    icon: Weight,
  },
  fat: {
    label: "% Gordura",
    color: "hsl(var(--chart-2))",
    icon: Percent,
  },
};

export default function BodyTrendsWidget() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="w-5 h-5 text-primary"/>Tendências Corporais</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 4, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillFat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-fat)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-fat)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20"/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs"
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent 
                indicator="dot"
                formatter={(value, name) => (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize" style={{ color: chartConfig[name as keyof typeof chartConfig].color }}>
                      {chartConfig[name as keyof typeof chartConfig].label}
                    </span>
                    <span>{value}{name === 'weight' ? ' kg' : '%'}</span>
                  </div>
                )}
                labelFormatter={(label) => `Mês: ${label}`}
              />}
            />
            <Area
              dataKey="weight"
              type="natural"
              fill="url(#fillWeight)"
              stroke="var(--color-weight)"
              strokeWidth={2.5}
              stackId="a"
              dot={false}
              activeDot={{ r: 5, className: 'chart-glow' }}
            />
             <Area
              dataKey="fat"
              type="natural"
              fill="url(#fillFat)"
              stroke="var(--color-fat)"
              strokeWidth={2}
              stackId="b"
              dot={false}
              activeDot={{ r: 5, className: 'chart-glow' }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
