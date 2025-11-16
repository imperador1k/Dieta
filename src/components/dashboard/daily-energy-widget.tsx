
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drumstick, Wheat, Droplet, Flame } from "lucide-react";
import { motion } from 'framer-motion';
import { useAppContext } from '@/app/context/AppContext';

const CalorieCircularProgress = ({
  consumed,
  goal,
}: {
  consumed: number;
  goal: number;
}) => {
  const radius = 65;
  const strokeWidth = 12;
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
          stroke="url(#calorieGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth/2} ${radius + strokeWidth/2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "circOut", delay: 0.2 }}
        />
        <defs>
            <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
            transition={{ duration: 0.5, delay: 0.4 }}
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
                <p className="text-sm text-muted-foreground">{Math.round(consumed)}g / {goal}g</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30 mt-1">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: delay + 0.3 }}
                />
            </div>
        </div>
    )
}

const macrosConfig = {
    protein: { color: "hsl(var(--chart-1))", icon: Drumstick },
    carbs: { color: "hsl(var(--chart-2))", icon: Wheat },
    fat: { color: "hsl(var(--chart-3))", icon: Droplet },
};


export default function DailyEnergyWidget() {
  const { activePlan, consumedTotals } = useAppContext();
  
  const targets = activePlan?.targets || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <Card className="glass-card flex flex-col h-full border border-primary/20 shadow-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Flame className="w-5 h-5 text-primary"/>Energia Diária</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center gap-6 py-6">
        <CalorieCircularProgress
            consumed={consumedTotals.calories}
            goal={targets.calories}
        />
        <div className="grid grid-cols-1 gap-4 w-full px-4">
            <MacroLinearProgress 
                label="Proteína"
                consumed={consumedTotals.protein}
                goal={targets.protein}
                color={macrosConfig.protein.color}
                Icon={macrosConfig.protein.icon}
                delay={0.4}
            />
            <MacroLinearProgress 
                label="Carboidratos"
                consumed={consumedTotals.carbs}
                goal={targets.carbs}
                color={macrosConfig.carbs.color}
                Icon={macrosConfig.carbs.icon}
                delay={0.6}
            />
            <MacroLinearProgress 
                label="Gordura"
                consumed={consumedTotals.fat}
                goal={targets.fat}
                color={macrosConfig.fat.color}
                Icon={macrosConfig.fat.icon}
                delay={0.8}
            />
        </div>
      </CardContent>
    </Card>
  );
}
