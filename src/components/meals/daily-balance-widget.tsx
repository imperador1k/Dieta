
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fish, Wheat, Droplet, Zap } from "lucide-react";
import { motion } from 'framer-motion';

const totalCalories = { consumed: 0, goal: 2500 };
const macros = {
    protein: { consumed: 0, goal: 180, color: "hsl(var(--chart-1))", icon: Fish },
    carbs: { consumed: 0, goal: 250, color: "hsl(var(--chart-2))", icon: Wheat },
    fat: { consumed: 0, goal: 80, color: "hsl(var(--chart-3))", icon: Droplet },
};

const CalorieCircularProgress = ({
  consumed,
  goal,
}: {
  consumed: number;
  goal: number;
}) => {
  const radius = 55;
  const strokeWidth = 10;
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
          stroke="url(#balanceGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
        <defs>
            <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(258 90% 60%)" />
            </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-3xl font-bold text-foreground tracking-tighter"
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
    const percentage = goal > 0 ? (consumed / goal) * 100 : 0;
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <Icon className="w-4 h-4" style={{ color }} />
                    <p className="font-semibold text-sm text-foreground">{label}</p>
                </div>
                <p className="text-sm text-muted-foreground">{consumed}g / {goal}g</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30 mt-1">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay }}
                />
            </div>
        </div>
    )
}

export default function DailyBalanceWidget() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary"/>Balanço Diário</CardTitle>
        <CardDescription>O seu progresso de hoje em relação às metas do plano.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex justify-center">
                <CalorieCircularProgress
                    consumed={totalCalories.consumed}
                    goal={totalCalories.goal}
                />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4">
                <MacroLinearProgress 
                    label="Proteína"
                    consumed={macros.protein.consumed}
                    goal={macros.protein.goal}
                    color={macros.protein.color}
                    Icon={macros.protein.icon}
                    delay={0.1}
                />
                <MacroLinearProgress 
                    label="Hidratos"
                    consumed={macros.carbs.consumed}
                    goal={macros.carbs.goal}
                    color={macros.carbs.color}
                    Icon={macros.carbs.icon}
                    delay={0.2}
                />
                <MacroLinearProgress 
                    label="Gordura"
                    consumed={macros.fat.consumed}
                    goal={macros.fat.goal}
                    color={macros.fat.color}
                    Icon={macros.fat.icon}
                    delay={0.3}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
