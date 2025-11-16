
'use client';

import { Card } from "@/components/ui/card";
import { BarChart3, Weight, Percent, ArrowUp, ArrowDown } from "lucide-react";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { BodyMeasurement, UserProfile } from "@/lib/types";
import { useMemo } from "react";
import { calculateBodyComposition } from "@/lib/body-composition";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string) => format(new Date(dateString), "d MMM yyyy", { locale: pt });

const TrendIndicator = ({ value, unit, positiveIsGood }: { value: number; unit: string; positiveIsGood?: boolean }) => {
    if (value === 0) {
        return <span className="text-muted-foreground font-medium text-xs">Sem Alteração</span>;
    }
    
    const isPositive = value > 0;
    const isGood = positiveIsGood ? isPositive : !isPositive;
    
    const Icon = isPositive ? ArrowUp : ArrowDown;
    const colorClass = isGood ? 'text-green-400' : 'text-destructive';

    return (
        <div className={cn("flex items-center gap-1 font-bold text-xs", colorClass)}>
            <Icon className="w-3.5 h-3.5" />
            <span>{Math.abs(value).toFixed(1)}{unit}</span>
        </div>
    );
};

interface MeasurementHistoryProps {
    measurements: BodyMeasurement[];
    userProfile: Pick<UserProfile, 'height' | 'gender'>;
}

export default function MeasurementHistory({ measurements, userProfile }: MeasurementHistoryProps) {
    
    const measurementsWithFat = useMemo(() => measurements.map(m => {
        const composition = calculateBodyComposition({ 
            gender: userProfile.gender, 
            height: userProfile.height, 
            weight: m.weight, 
            neck: m.neck, 
            waist: m.waist 
        });

        return {
            ...m,
            bodyFat: composition?.bodyFatPercentage,
        }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [measurements, userProfile]);


    if (measurements.length < 1) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Sem Histórico</h3>
                <p className="mt-2 text-sm text-muted-foreground">Adicione a sua primeira medição para começar a ver o histórico.</p>
            </div>
        )
    }

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.05 } }}
        >
            {measurementsWithFat.map((m, index) => {
                const prevMeasurement = measurementsWithFat[index + 1];
                const weightDiff = prevMeasurement?.weight && m.weight ? m.weight - prevMeasurement.weight : 0;
                const fatDiff = prevMeasurement?.bodyFat && m.bodyFat ? m.bodyFat - prevMeasurement.bodyFat : 0;

                return (
                    <motion.div
                        key={m.date}
                        layout
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 },
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="glass-card p-4 h-full flex flex-col justify-between">
                            <p className="text-sm font-semibold text-muted-foreground">{formatDate(m.date)}</p>
                            <div className="space-y-3 mt-3">
                                {m.weight && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Weight className="w-5 h-5 text-primary" />
                                            <span className="font-bold text-xl">{m.weight.toFixed(1)}kg</span>
                                        </div>
                                        <TrendIndicator value={weightDiff} unit="kg" positiveIsGood={false} />
                                    </div>
                                )}
                                 {m.bodyFat && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Percent className="w-5 h-5 text-chart-2" />
                                            <span className="font-bold text-xl">{m.bodyFat.toFixed(1)}%</span>
                                        </div>
                                         <TrendIndicator value={fatDiff} unit="%" positiveIsGood={false} />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )
            })}
        </motion.div>
    );
}
