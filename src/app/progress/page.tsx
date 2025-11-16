
'use client';

import { AppShell } from "@/components/layout/app-shell";
import ProgressCharts from "@/components/progress/progress-charts";
import { Button } from "@/components/ui/button";
import { PlusCircle, History } from "lucide-react";
import { useState } from "react";
import { MeasurementForm } from "@/components/profile/measurement-form";
import MeasurementHistory from "@/components/progress/measurement-history";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/app/context/AppContext";

export default function ProgressPage() {
    const { profile, measurements, saveMeasurement } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = (measurement: any) => {
        saveMeasurement(measurement);
        setIsFormOpen(false);
    }
    
    const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const userProfileForCalculations = { height: profile.height, gender: profile.gender };

    return (
        <AppShell>
            <MeasurementForm 
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleSave}
                latestMeasurement={latestMeasurement}
                userProfile={userProfileForCalculations}
            />
            <div className="space-y-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Sua Evolução</h1>
                        <p className="mt-2 text-muted-foreground max-w-2xl">
                            Visualize o seu progresso com gráficos detalhados e adicione novas medições.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsFormOpen(true)}>
                            <PlusCircle className="mr-2" />
                            Adicionar Medição
                        </Button>
                    </div>
                </header>
                
                <ProgressCharts measurements={measurements} />

                <Separator />
                
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 mb-4">
                        <History />
                        Histórico de Medições
                    </h2>
                    <MeasurementHistory measurements={measurements} userProfile={userProfileForCalculations} />
                </div>
            </div>
        </AppShell>
    );
}
