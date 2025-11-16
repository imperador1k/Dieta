'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Drumstick, Wheat, Droplet } from "lucide-react";
import { motion } from 'framer-motion';

const chartConfig = {
  protein: { label: "Proteína", color: "hsl(var(--chart-1))", icon: Drumstick },
  carbs: { label: "Carbs", color: "hsl(var(--chart-2))", icon: Wheat },
  fat: { label: "Gordura", color: "hsl(var(--chart-4))", icon: Droplet },
};

const macros = {
    protein: { consumed: 120, goal: 180 },
    carbs: { consumed: 250, goal: 300 },
    fat: { consumed: 60, goal: 70 },
};

const MacroCircularProgress = ({
  label,
  consumed,
  goal,
  color,
  Icon,
  delay = 0,
}: {
  label: string;
  consumed: number;
  goal: number;
  color: string;
  Icon: React.ElementType;
  delay?: number;
}) => {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / goal, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-semibold text-sm" style={{ color }}>{label}</p>
      <div className="relative" style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
        <svg className="w-full h-full" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="hsl(var(--muted) / 0.2)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "circOut", delay }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-foreground tracking-tighter">
                {consumed}
            </span>
            <span className="text-xs text-muted-foreground">/ {goal}g</span>
          </div>
      </div>
    </div>
  );
};

export default function DailyEnergyWidget() {
  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader>
        <CardTitle>Resumo de Macros</CardTitle>
        <CardDescription>O seu consumo diário de macronutrientes.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-lg">
            <MacroCircularProgress 
                label="Proteína"
                consumed={macros.protein.consumed}
                goal={macros.protein.goal}
                color={chartConfig.protein.color}
                Icon={Drumstick}
                delay={0}
            />
            <MacroCircularProgress 
                label="Carbs"
                consumed={macros.carbs.consumed}
                goal={macros.carbs.goal}
                color={chartConfig.carbs.color}
                Icon={Wheat}
                delay={0.2}
            />
            <MacroCircularProgress 
                label="Gordura"
                consumed={macros.fat.consumed}
                goal={macros.fat.goal}
                color={chartConfig.fat.color}
                Icon={Droplet}
                delay={0.4}
            />
        </div>
      </CardContent>
    </Card>
  );
}
