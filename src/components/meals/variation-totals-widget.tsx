
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fish, Wheat, Droplet, Flame, Check, AlertTriangle } from "lucide-react";
import type { Meal } from '@/lib/types';
import { motion } from 'framer-motion';

// Mock targets, in a real app this would come from the active plan
const planTargets = {
    calories: 2200,
    protein: 180,
    carbs: 200,
    fat: 70
};

const CalorieCircularProgress = ({
  consumed,
  goal,
}: {
  consumed: number;
  goal: number;
}) => {
  const radius = 60;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
      <svg className="w-full h-full" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted) / 0.3)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="url(#calorieGradientWidget)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
        <defs>
            <linearGradient id="calorieGradientWidget" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(258 90% 60%)" />
            </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-4xl font-bold text-foreground tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
              {Math.round(consumed)}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-1">/ {goal} kcal</span>
        </div>
    </div>
  );
};


const TotalMacroBar = ({
  label,
  value,
  goal,
  color,
  Icon,
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
  Icon: React.ElementType;
}) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const isOver = percentage > 100;
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color }} />
                    <span className="font-semibold text-sm">{label}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">{Math.round(value)}g</span> / {goal}g
                </div>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2.5 relative">
                <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                        width: `${Math.min(percentage, 100)}%`, 
                        backgroundColor: color 
                    }}
                />
                 {isOver && (
                    <div className="absolute top-0 h-full rounded-full bg-destructive" style={{ width: `${Math.min(percentage - 100, 100)}%`, left: '100%' }} />
                )}
            </div>
        </div>
    )
}

export default function VariationTotalsWidget({ meals }: { meals: Meal[] }) {

  const totals = meals.reduce((acc, meal) => {
    acc.calories += meal.totalCalories;
    acc.protein += meal.protein;
    acc.carbs += meal.carbs;
    acc.fat += meal.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const calorieDiff = totals.calories - planTargets.calories;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Totais da Variação</CardTitle>
        <CardDescription>Soma de todas as refeições planeadas para este modelo de dia.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-lg bg-muted/40">
                <CalorieCircularProgress consumed={totals.calories} goal={planTargets.calories} />

                <div className={`flex items-center gap-2 text-sm font-semibold ${calorieDiff === 0 ? 'text-muted-foreground' : calorieDiff > 0 ? 'text-destructive' : 'text-green-400'}`}>
                    {calorieDiff !== 0 && (calorieDiff > 0 ? <AlertTriangle className="w-4 h-4"/> : <Check className="w-4 h-4"/>)}
                    <span>
                        {calorieDiff > 0 ? `+${Math.round(calorieDiff)}` : Math.round(calorieDiff)} kcal do alvo
                    </span>
                </div>
            </div>
            <div className="space-y-4">
                <TotalMacroBar label="Proteína" value={totals.protein} goal={planTargets.protein} color="hsl(var(--chart-1))" Icon={Fish} />
                <TotalMacroBar label="Hidratos" value={totals.carbs} goal={planTargets.carbs} color="hsl(var(--chart-2))" Icon={Wheat} />
                <TotalMacroBar label="Gordura" value={totals.fat} goal={planTargets.fat} color="hsl(var(--chart-3))" Icon={Droplet} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
