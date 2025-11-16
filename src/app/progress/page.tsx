'use client';

import { AppShell } from "@/components/layout/app-shell";
import ProgressCharts from "@/components/progress/progress-charts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { MeasurementForm } from "@/components/profile/measurement-form";
import type { BodyMeasurement } from "@/lib/types";

// Mock data, in a real app this would be fetched
const mockLatestMeasurement: BodyMeasurement = {
    date: new Date().toISOString(),
    weight: 75.5,
    neck: 38,
    waist: 85,
    hips: 95,
}

export default function ProgressPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

    const handleSaveMeasurement = (measurement: BodyMeasurement) => {
        setMeasurements(prev => [...prev, measurement]);
        setIsFormOpen(false);
    }

    return (
        <AppShell>
            <MeasurementForm 
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleSaveMeasurement}
                latestMeasurement={mockLatestMeasurement}
            />
            <div className="space-y-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Sua Evolução</h1>
                        <p className="mt-2 text-muted-foreground max-w-2xl">
                            Visualize o seu progresso com gráficos detalhados.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsFormOpen(true)}>
                            <PlusCircle className="mr-2" />
                            Adicionar Medição
                        </Button>
                    </div>
                </header>
                
                <ProgressCharts />
            </div>
        </AppShell>
    );
}
