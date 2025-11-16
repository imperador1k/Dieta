'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Salt } from 'lucide-react';

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
};

const micronutrientsData: Micronutrient[] = [
  { name: 'Sódio', consumed: 1800, goal: 2300, unit: 'mg', icon: Salt },
  { name: 'Potássio', consumed: 3000, goal: 3500, unit: 'mg', icon: PotassiumIcon },
  { name: 'Vitamina D', consumed: 15, goal: 20, unit: 'µg', icon: VitaminDIcon },
  { name: 'Cálcio', consumed: 800, goal: 1000, unit: 'mg', icon: CalciumIcon },
];

export default function MicronutrientsWidget() {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline">Micronutrientes Chave</CardTitle>
                <CardDescription>Resumo do consumo diário</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
                {micronutrientsData.map((micro) => {
                    const percentage = (micro.consumed / micro.goal) * 100;
                    
                    return (
                        <div key={micro.name} className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <micro.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-medium">{micro.name}</p>
                                    <p className="text-sm text-muted-foreground">{micro.consumed} / {micro.goal} {micro.unit}</p>
                                </div>
                                <Progress value={percentage > 100 ? 100 : percentage} className="h-2" />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
