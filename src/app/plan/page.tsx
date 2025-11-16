import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function PlanPage() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Card className="glass-card max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center justify-center gap-2">
                            <FileText />
                            Arquiteto da Dieta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Esta secção está em desenvolvimento. Em breve, poderá definir as suas metas globais, 
                            configurar micronutrientes e construir a sua própria base de dados de alimentos.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
