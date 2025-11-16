'use client';

import { AppShell } from "@/components/layout/app-shell";
import ProgressCharts from "@/components/progress/progress-charts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { MeasurementForm } from "@/components/profile/measurement-form";
import type { BodyMeasurement } from "@/lib/types";

// Mock data, in a real app this would be fetched
const mockInitialMeasurements: BodyMeasurement[] = [
    { date: "2024-01-15", weight: 80, neck: 40, waist: 90, hips: 100 },
    { date: "2024-02-15", weight: 78.5, neck: 39.5, waist: 88, hips: 98 },
    { date: "2024-03-15", weight: 77, neck: 39, waist: 86, hips: 96 },
    { date: "2024-05-01", weight: 75.5, neck: 38, waist: 85, hips: 95 },
];


export default function ProgressPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [measurements, setMeasurements] = useState<BodyMeasurement[]>(mockInitialMeasurements);

    const handleSaveMeasurement = (measurement: BodyMeasurement) => {
        // Add or update measurement based on date
        const existingIndex = measurements.findIndex(m => new Date(m.date).toDateString() === new Date(measurement.date).toDateString());
        
        let newMeasurements;
        if (existingIndex > -1) {
            newMeasurements = [...measurements];
            newMeasurements[existingIndex] = measurement;
        } else {
            newMeasurements = [...measurements, measurement];
        }
        
        // Sort measurements by date
        newMeasurements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setMeasurements(newMeasurements);
        setIsFormOpen(false);
    }
    
    const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

    return (
        <AppShell>
            <MeasurementForm 
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleSaveMeasurement}
                latestMeasurement={latestMeasurement}
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
            </div>
        </AppShell>
    );
}
