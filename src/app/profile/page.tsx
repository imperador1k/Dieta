'use client';

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, UserCircle, Ruler, Beef } from "lucide-react";
import type { UserProfile } from "@/lib/types";

// Mock data, in a real app this would come from a user session/database
const initialProfile: UserProfile = {
    name: 'Utilizador DietaS',
    email: 'user@dietas.app',
    age: 30,
    height: 180,
    weight: 75,
    gender: 'male',
    measurements: {
        neck: 38,
        waist: 85,
    }
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    }
    
    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ 
            ...prev, 
            measurements: {
                ...prev.measurements,
                [name]: value
            }
        }));
    }

    const handleGenderChange = (value: 'male' | 'female') => {
         setProfile(prev => ({ ...prev, gender: value }));
    }

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Perfil & Medidas</h1>
                    <p className="mt-2 text-muted-foreground">
                        Mantenha os seus dados biológicos e medidas atualizados para cálculos precisos.
                    </p>
                </header>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserCircle/> Dados Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Ruler/> Dados Biométricos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label>Género</Label>
                            <RadioGroup value={profile.gender} onValueChange={handleGenderChange} className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Masculino</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Feminino</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="age">Idade</Label>
                            <Input id="age" name="age" type="number" value={profile.age} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="height">Altura (cm)</Label>
                            <Input id="height" name="height" type="number" value={profile.height} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" name="weight" type="number" value={profile.weight} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Beef/> Medidas Corporais (cm)</CardTitle>
                        <CardDescription>Usado para calcular a gordura corporal (método da Marinha dos EUA).</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="neck">Pescoço</Label>
                            <Input id="neck" name="neck" type="number" value={profile.measurements.neck} onChange={handleMeasurementChange} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="waist">Cintura</Label>
                            <Input id="waist" name="waist" type="number" value={profile.measurements.waist} onChange={handleMeasurementChange} />
                        </div>
                        {profile.gender === 'female' && (
                             <div className="space-y-1">
                                <Label htmlFor="hips">Anca</Label>
                                <Input id="hips" name="hips" type="number" value={profile.measurements.hips || ''} onChange={handleMeasurementChange} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button><Save className="mr-2"/> Guardar Alterações</Button>
                </div>
            </div>
        </AppShell>
    );
}