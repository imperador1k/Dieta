'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppContext } from '@/app/context/AppContext';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { type UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { profile, saveProfile, isProfileLoading } = useAppContext();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || auth.currentUser?.email || '');
      setAge(profile.age ? profile.age.toString() : '');
      setHeight(profile.height ? profile.height.toString() : '');
      setGender(profile.gender || 'male');
    } else if (auth.currentUser) {
      // Set email from auth user if profile doesn't exist yet
      setName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
    }
  }, [profile, auth.currentUser, profile?.name, profile?.email, profile?.age, profile?.height, profile?.gender]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (auth.currentUser) {
      try {
        setIsSaving(true);
        const profileData: Partial<UserProfile> = {
          name,
          email,
          age: age ? parseInt(age) : 0,
          height: height ? parseInt(height) : 0,
          gender
        };
        saveProfile(profileData);
        setIsEditing(false);
        setIsSaving(false);
        toast({
          title: "Perfil atualizado",
          description: "As suas informações foram guardadas com sucesso.",
        });
      } catch (error) {
        console.error('Error saving profile:', error);
        setIsSaving(false);
        toast({
          title: "Erro ao guardar",
          description: "Ocorreu um erro ao guardar o perfil. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/auth/login');
    }
  }, [auth.currentUser, router]);

  // Show loading state while redirecting
  if (!auth.currentUser) {
    return (
      <AppShell>
        <div className="container max-w-4xl mx-auto py-8">
          <Card className="glass-card">
            <CardContent className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <span>A redirecionar para login...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (isProfileLoading) {
    return (
      <AppShell>
        <div className="container max-w-4xl mx-auto py-8">
          <Card className="glass-card">
            <CardContent className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <span>A carregar perfil...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  // Show a message if there's no profile data yet
  if (!profile && !isProfileLoading) {
    return (
      <AppShell>
        <div className="container max-w-4xl mx-auto py-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Perfil do Utilizador</CardTitle>
              <CardDescription>Gerencie as informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <span>A criar o seu perfil...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Perfil do Utilizador</CardTitle>
            <CardDescription>Gerencie as informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{name || 'Não definido'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                {isEditing ? (
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{age ? `${age} anos` : 'Não definido'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                {isEditing ? (
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{height ? `${height} cm` : 'Não definido'}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Género</Label>
                {isEditing ? (
                  <RadioGroup value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')} className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Feminino</Label>
                    </div>
                  </RadioGroup>
                ) : (
                  <p className="text-lg font-medium">{gender === 'male' ? 'Masculino' : 'Feminino'}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button disabled={isSaving} onClick={handleSave}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? 'A guardar...' : 'Guardar'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}