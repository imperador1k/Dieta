'use client';

import { AppShell } from "@/components/layout/app-shell";
import ProgressCharts from "@/components/progress/progress-charts";
import { Button } from "@/components/ui/button";
import { PlusCircle, History, Loader2 } from "lucide-react";
import { useState } from "react";
import { MeasurementForm } from "@/components/profile/measurement-form";
import MeasurementHistory from "@/components/progress/measurement-history";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/app/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
    const { profile, isProfileLoading, measurements, isMeasurementsLoading, saveMeasurement } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSave = (measurement: any) => {
        saveMeasurement(measurement);
        setIsFormOpen(false);
    }
    
    const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const userProfileForCalculations = profile ? { height: profile.height, gender: profile.gender } : null;

    const isLoading = isProfileLoading || isMeasurementsLoading;

    if (isLoading && !profile) {
        return (
            <AppShell>
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            {userProfileForCalculations && (
                <MeasurementForm 
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    onSave={handleSave}
                    latestMeasurement={latestMeasurement}
                    userProfile={userProfileForCalculations}
                />
            )}
            <div className="space-y-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Sua Evolução</h1>
                        <p className="mt-2 text-muted-foreground max-w-2xl">
                            Visualize o seu progresso com gráficos detalhados e adicione novas medições.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsFormOpen(true)} disabled={!userProfileForCalculations}>
                            <PlusCircle className="mr-2" />
                            Adicionar Medição
                        </Button>
                    </div>
                </header>
                
                {isLoading ? <Skeleton className="h-80 w-full" /> : <ProgressCharts measurements={measurements} />}

                <Separator />
                
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3 mb-4">
                        <History />
                        Histórico de Medições
                    </h2>
                    {isLoading && !userProfileForCalculations ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                        </div>
                    ) : userProfileForCalculations ? (
                        <MeasurementHistory measurements={measurements} userProfile={userProfileForCalculations} />
                    ) : null}
                </div>
            </div>
        </AppShell>
    );
}
