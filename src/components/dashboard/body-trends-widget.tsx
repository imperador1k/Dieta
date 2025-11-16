
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Weight, Percent, TrendingUp } from 'lucide-react';
import { useAppContext } from "@/app/context/AppContext";
import { useMemo } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Skeleton } from "../ui/skeleton";
import { calculateBodyComposition } from "@/lib/body-composition";

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

const formatDate = (dateString: string) => format(new Date(dateString), "d MMM", { locale: pt });

export default function BodyTrendsWidget() {
  const { measurements, isMeasurementsLoading, profile, isProfileLoading } = useAppContext();

  const chartData = useMemo(() => {
    if (!measurements || !profile) return [];
    
    return measurements.map(m => {
        const composition = calculateBodyComposition({
            gender: profile.gender,
            height: profile.height,
            weight: m.weight,
            neck: m.neck,
            waist: m.waist,
            hips: m.hips,
        });

        return {
            date: m.date,
            weight: m.weight,
            fat: composition?.bodyFatPercentage,
        }
    }).slice(-15); // Show last 15 measurements
  }, [measurements, profile]);

  const isLoading = isMeasurementsLoading || isProfileLoading;

  if (isLoading) {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-5 h-5 text-primary"/>Tendências Corporais
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="w-5 h-5 text-primary"/>Tendências Corporais</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length < 2 ? (
          <div className="h-[200px] w-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <TrendingUp className="w-10 h-10 mb-4"/>
            <h3 className="font-semibold">Dados insuficientes</h3>
            <p className="text-sm">Adicione mais medições para ver as suas tendências.</p>
          </div>
        ) : (
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
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={formatDate}
                className="text-xs"
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={<ChartTooltipContent 
                  indicator="dot"
                  formatter={(value, name) => {
                      if (typeof value !== 'number') return null;
                      return (
                          <div className="flex items-center gap-2">
                              <span className="font-semibold capitalize" style={{ color: chartConfig[name as keyof typeof chartConfig].color }}>
                                  {chartConfig[name as keyof typeof chartConfig].label}
                              </span>
                              <span>{value.toFixed(1)}{name === 'weight' ? ' kg' : '%'}</span>
                          </div>
                      );
                  }}
                  labelFormatter={(label) => format(new Date(label), "d MMM yyyy", { locale: pt })}
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
        )}
      </CardContent>
    </Card>
  );
}
