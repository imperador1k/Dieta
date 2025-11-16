
'use client';

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Ruler } from "lucide-react";
import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { useAppContext } from "@/app/context/AppContext";

export default function ProfilePage() {
    const { profile, setProfile } = useAppContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Convert to number if the field is age or height
        const isNumeric = ['age', 'height'].includes(name);
        setProfile({ ...profile, [name]: isNumeric ? (value ? parseFloat(value) : 0) : value });
    }

    const handleGenderChange = (value: 'male' | 'female') => {
         setProfile({ ...profile, gender: value });
    }
    
    const handleAvatarChange = (newAvatarUrl: string) => {
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
    }

    // In a real app, this would likely trigger a database save.
    const handleSaveChanges = () => {
        console.log("Saving profile:", profile);
        // Here you would call an action to save the profile to a database.
    }

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Perfil & Dados</h1>
                    <p className="mt-2 text-muted-foreground">
                        Mantenha os seus dados biológicos atualizados para cálculos precisos.
                    </p>
                </header>

                <AvatarUploader 
                    name={profile.name}
                    email={profile.email}
                    avatarUrl={profile.avatarUrl}
                    onAvatarChange={handleAvatarChange}
                    onNameChange={(name) => setProfile({...profile, name})}
                    onEmailChange={(email) => setProfile({...profile, email})}
                />

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Ruler/> Dados Biométricos</CardTitle>
                        <CardDescription>Estes dados são usados como base para todos os cálculos de progresso e calóricos.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-3 gap-6">
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
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSaveChanges}><Save className="mr-2"/> Guardar Alterações</Button>
                </div>
            </div>
        </AppShell>
    );
}
