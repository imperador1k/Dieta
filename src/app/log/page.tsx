import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ScanLine, Search } from "lucide-react";
import { AiLoggerForm } from "@/components/log/ai-logger-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogPage() {
    return (
        <AppShell>
            <div className="max-w-3xl mx-auto">
                <Tabs defaultValue="ai" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4" /> IA Logger</TabsTrigger>
                        <TabsTrigger value="search" disabled><Search className="mr-2 h-4 w-4" /> Manual</TabsTrigger>
                        <TabsTrigger value="scan" disabled><ScanLine className="mr-2 h-4 w-4" /> Scanner</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ai" className="mt-6">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Registo Rápido com IA</CardTitle>
                                <CardDescription>Descreva a sua refeição em linguagem natural e deixe a IA fazer o resto.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AiLoggerForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="search" className="mt-6">
                         <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Pesquisa Manual</CardTitle>
                                <CardDescription>Procure na sua lista de alimentos ou na base de dados.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground py-8">Funcionalidade de pesquisa em desenvolvimento.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="scan" className="mt-6">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Scanner de Código de Barras</CardTitle>
                                <CardDescription>Aponte a câmara para um código de barras para um registo instantâneo.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8 gap-4">
                                <ScanLine className="w-16 h-16 text-muted-foreground" />
                                <p className="text-center text-muted-foreground">Scanner em desenvolvimento.</p>
                                <Button disabled>Abrir Câmara</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppShell>
    );
}
