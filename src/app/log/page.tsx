import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCopy, PlusCircle, Search } from "lucide-react";

export default function LogPage() {
    return (
        <AppShell>
            <div className="max-w-4xl mx-auto">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2"><BookCopy /> Livro de Receitas</CardTitle>
                            <CardDescription>Crie, edite e gira os seus pratos e receitas personalizadas.</CardDescription>
                        </div>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Criar Prato
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Procurar nos seus pratos..." className="pl-10" />
                            </div>
                            <div className="text-center text-muted-foreground py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                                <BookCopy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold">Ainda não tem pratos</h3>
                                <p className="mt-2 text-sm">Comece por criar o seu primeiro prato ou receita.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
