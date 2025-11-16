'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import Link from "next/link";

const meals = [
    { name: "Pequeno-almoço", calories: 450, completed: true },
    { name: "Almoço", calories: 800, completed: true },
    { name: "Lanche", calories: 300, completed: false },
    { name: "Jantar", calories: 700, completed: false },
];

export default function TodaysMealsWidget() {
    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Refeições do Dia</CardTitle>
                    <CardDescription>Registe as suas refeições</CardDescription>
                </div>
                <Link href="/log" passHref legacyBehavior>
                    <Button variant="ghost" size="icon">
                        <Plus className="h-5 w-5" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {meals.map((meal) => (
                        <li key={meal.name} className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-primary/5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                {meal.completed ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                            </Button>
                            <div className="flex-1">
                                <p className="font-semibold">{meal.name}</p>
                                <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
