'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Drumstick, Wheat, Droplet, Zap } from "lucide-react";
import { motion } from 'framer-motion';

const chartConfig = {
  calories: { label: "Calorias", color: "hsl(var(--primary))", icon: Zap },
  protein: { label: "Proteína", color: "hsl(var(--chart-2))", icon: Drumstick },
  carbs: { label: "Carbs", color: "hsl(var(--chart-3))", icon: Wheat },
  fat: { label: "Gordura", color: "hsl(var(--chart-4))", icon: Droplet },
};

const totalCalories = 2250;
const goalCalories = 2500;

const macros = {
    protein: { consumed: 120, goal: 180 },
    carbs: { consumed: 250, goal: 300 },
    fat: { consumed: 60, goal: 70 },
};

const CircleProgress = ({
  progress,
  radius,
  strokeWidth,
  color,
  className,
  delay = 0,
}: {
  progress: number;
  radius: number;
  strokeWidth: number;
  color: string;
  className?: string;
  delay?: number;
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.circle
      cx={radius}
      cy={radius}
      r={radius - strokeWidth / 2}
      fill="transparent"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={circumference}
      strokeLinecap="round"
      transform={`rotate(-90 ${radius} ${radius})`}
      className={className}
      initial={{ strokeDashoffset: circumference }}
      animate={{ strokeDashoffset }}
      transition={{ duration: 1.2, ease: "circOut", delay }}
    />
  );
};

export default function DailyEnergyWidget() {
  const size = 300;
  const center = size / 2;
  const strokeWidth = 12;

  const rings = [
    {
      key: 'calories',
      data: { consumed: totalCalories, goal: goalCalories },
      radius: center - strokeWidth * 1,
      stroke: 14
    },
    {
      key: 'protein',
      data: macros.protein,
      radius: center - strokeWidth * 3,
      stroke: 10
    },
    {
      key: 'carbs',
      data: macros.carbs,
      radius: center - strokeWidth * 5,
      stroke: 8
    },
    {
      key: 'fat',
      data: macros.fat,
      radius: center - strokeWidth * 7,
      stroke: 6
    },
  ];

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Energia Diária</CardTitle>
        <CardDescription>Resumo de Calorias e Macros</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 md:gap-8 pb-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Rings */}
            {rings.map((ring) => (
              <circle
                key={`bg-${ring.key}`}
                cx={center}
                cy={center}
                r={ring.radius - ring.stroke / 2}
                fill="transparent"
                stroke="hsl(var(--muted) / 0.2)"
                strokeWidth={ring.stroke}
              />
            ))}
            
            {/* Progress Rings */}
            {rings.map((ring, index) => (
              <CircleProgress
                key={ring.key}
                progress={(ring.data.consumed / ring.data.goal) * 100}
                radius={ring.radius}
                strokeWidth={ring.stroke}
                color={`hsl(var(--${ring.key === 'calories' ? 'primary' : `chart-${index}`}))`}
                className={ring.key === 'calories' ? 'chart-glow' : ''}
                delay={index * 0.2}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-bold text-foreground tracking-tighter">
                {totalCalories}
            </span>
            <span className="text-sm text-muted-foreground">/ {goalCalories} kcal</span>
          </div>
        </div>
        
        <div className="flex flex-row xl:flex-col justify-around w-full max-w-sm xl:max-w-none xl:w-auto xl:gap-4">
          {Object.entries(macros).map(([key, { consumed, goal }], index) => {
            const config = chartConfig[key as keyof typeof chartConfig];
            return (
              <div key={key} className="flex flex-col xl:flex-row items-center gap-2 text-center xl:text-left p-2 rounded-lg">
                <div className="relative p-2 bg-muted/30 rounded-full">
                  <config.icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <p className="font-bold text-base tracking-tight">{consumed}g</p>
                  <p className="text-xs text-muted-foreground">/ {goal}g {config.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
