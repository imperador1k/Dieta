'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Drumstick, Wheat, Droplet, Flame } from "lucide-react";
import { motion } from 'framer-motion';

const totalCalories = { consumed: 120 * 4 + 250 * 4 + 60 * 9, goal: 2500 };
const macros = {
    protein: { consumed: 120, goal: 180, color: "hsl(var(--chart-1))", icon: Drumstick },
    carbs: { consumed: 250, goal: 300, color: "hsl(var(--chart-2))", icon: Wheat },
    fat: { consumed: 60, goal: 70, color: "hsl(var(--chart-4))", icon: Droplet },
};

const CalorieCircularProgress = ({
  consumed,
  goal,
  delay = 0,
}: {
  consumed: number;
  goal: number;
  delay?: number;
}) => {
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / goal, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
      <svg className="w-full h-full" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted) / 0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="url(#calorieGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "circOut", delay }}
        />
        <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" />
            </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-5xl font-bold text-foreground tracking-tighter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
              {Math.round(consumed)}
          </motion.span>
          <span className="text-sm text-muted-foreground">/ {goal} kcal</span>
        </div>
    </div>
  );
};


const MacroLinearProgress = ({
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
    const percentage = (consumed / goal) * 100;
    return (
        <motion.div 
            className="flex flex-col items-center gap-2 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" style={{ color }} />
                <p className="font-semibold text-md text-foreground">{label}</p>
            </div>
            <p className="text-sm text-muted-foreground">{consumed} / {goal}g</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20 mt-1">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.3 }}
                />
            </div>
        </motion.div>
    )
}


export default function DailyEnergyWidget() {
  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-primary"/>Energia Diária</CardTitle>
        <CardDescription>O seu balanço de calorias e macronutrientes.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-10 md:gap-12 py-6">
        <CalorieCircularProgress
            consumed={totalCalories.consumed}
            goal={totalCalories.goal}
        />
        <div className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-lg">
            <MacroLinearProgress 
                label="Proteína"
                consumed={macros.protein.consumed}
                goal={macros.protein.goal}
                color={macros.protein.color}
                Icon={macros.protein.icon}
                delay={0.2}
            />
            <MacroLinearProgress 
                label="Carbs"
                consumed={macros.carbs.consumed}
                goal={macros.carbs.goal}
                color={macros.carbs.color}
                Icon={macros.carbs.icon}
                delay={0.4}
            />
            <MacroLinearProgress 
                label="Gordura"
                consumed={macros.fat.consumed}
                goal={macros.fat.goal}
                color={macros.fat.color}
                Icon={macros.fat.icon}
                delay={0.6}
            />
        </div>
      </CardContent>
    </Card>
  );
}
