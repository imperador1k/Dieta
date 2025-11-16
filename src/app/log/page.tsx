import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ScanLine, BookCopy, PlusCircle } from "lucide-react";
import { AiLoggerForm } from "@/components/log/ai-logger-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogPage() {
    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="ai" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4" /> IA Logger</TabsTrigger>
                        <TabsTrigger value="dishes"><BookCopy className="mr-2 h-4 w-4" /> Pratos</TabsTrigger>
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

                    <TabsContent value="dishes" className="mt-6">
                         <Card className="glass-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Livro de Receitas</CardTitle>
                                    <CardDescription>Crie, edite e gira os seus pratos e receitas personalizadas.</CardDescription>
                                </div>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Criar Prato
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                                    <BookCopy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-lg font-semibold">Ainda não tem pratos</h3>
                                    <p className="mt-2 text-sm">Comece por criar o seu primeiro prato ou receita.</p>
                                </div>
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
