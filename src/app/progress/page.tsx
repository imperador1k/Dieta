import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function ProgressPage() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Card className="glass-card max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-center gap-2">
                           <BarChart2 />
                            Galeria da Evolução
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta secção está em desenvolvimento. Em breve, poderá visualizar gráficos detalhados do seu progresso
                            e carregar fotos para a sua galeria de evolução.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
