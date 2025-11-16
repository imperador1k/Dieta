'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Beaker } from 'lucide-react';

const SaltIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 8.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2"/><path d="M10 11h4"/><path d="M10 14h4"/><path d="M10 17h4"/><path d="M14 22H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="m22 22-2-2"/>
    </svg>
)

const PotassiumIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.6 11.3 2 22l10.7-3.6" />
        <path d="m13.4 12.6 8.6-8.6L19 1l-8.6 8.6" />
        <path d="M11.3 5.6 22 2l-3.6 10.7" />
    </svg>
)

const VitaminDIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" /> <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" /> <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" /> <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" /> <path d="m19.07 4.93-1.41 1.41" />
    </svg>
)

const CalciumIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 2a10 10 0 0 0-10 10" />
        <path d="M12 12a5 5 0 0 0-5-5" />
    </svg>
)

type Micronutrient = {
  name: string;
  consumed: number;
  goal: number;
  unit: string;
  icon: React.ElementType;
  color: string;
};

const micronutrientsData: Micronutrient[] = [
  { name: 'Sódio', consumed: 1800, goal: 2300, unit: 'mg', icon: SaltIcon, color: 'hsl(var(--chart-1))' },
  { name: 'Potássio', consumed: 3000, goal: 3500, unit: 'mg', icon: PotassiumIcon, color: 'hsl(var(--chart-2))' },
  { name: 'Vitamina D', consumed: 15, goal: 20, unit: 'µg', icon: VitaminDIcon, color: 'hsl(var(--chart-3))' },
  { name: 'Cálcio', consumed: 800, goal: 1000, unit: 'mg', icon: CalciumIcon, color: 'hsl(var(--chart-4))' },
];

const ProgressBar = ({ value, color, delay }: { value: number; color: string; delay: number }) => {
    const safeValue = Math.max(0, Math.min(100, value));
    return (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted/30">
            <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${safeValue}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay }}
            />
        </div>
    );
};

export default function MicronutrientsWidget() {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Beaker className="w-5 h-5 text-primary"/>Micronutrientes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {micronutrientsData.map((micro, index) => {
                    const percentage = (micro.consumed / micro.goal) * 100;
                    
                    return (
                        <div key={micro.name} className="flex items-center gap-4">
                            <div className="bg-muted/30 p-2.5 rounded-lg">
                                <micro.icon className="h-5 w-5" style={{ color: micro.color }} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-medium text-foreground text-sm">{micro.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-semibold text-foreground">{micro.consumed}</span>
                                        /{micro.goal} {micro.unit}
                                    </p>
                                </div>
                                <ProgressBar value={percentage} color={micro.color} delay={index * 0.15} />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
