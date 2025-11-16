'use client';

import { AppShell } from "@/components/layout/app-shell";
import { EvolutionGallery } from "@/components/progress/evolution-gallery";
import ProgressCharts from "@/components/progress/progress-charts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProgressPage() {
    return (
        <AppShell>
            <div className="space-y-8">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Sua Evolução</h1>
                        <p className="mt-2 text-muted-foreground max-w-2xl">
                            Visualize o seu progresso com gráficos detalhados e uma galeria de fotos da sua evolução.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button>
                            <PlusCircle className="mr-2" />
                            Adicionar Medição
                        </Button>
                    </div>
                </header>
                
                <EvolutionGallery />

                <ProgressCharts />
            </div>
        </AppShell>
    );
}
