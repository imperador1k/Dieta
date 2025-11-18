'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Loader2, Camera, User as UserIcon, Edit3, Save, X, Calendar, Ruler, VenetianMask } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || auth.currentUser?.email || '');
      setAge(profile.age ? profile.age.toString() : '');
      setHeight(profile.height ? profile.height.toString() : '');
      setGender(profile.gender || 'male');
      setAvatarUrl(profile.avatarUrl || null);
    } else if (auth.currentUser) {
      setName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
    }
  }, [profile, auth.currentUser]);

  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload avatar: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      setAvatarUrl(result.url);
      
      // Update profile with new avatar URL
      if (auth.currentUser) {
        saveProfile({ avatarUrl: result.url });
      }

      toast({
        title: "Foto de perfil atualizada",
        description: "A sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: `Ocorreu um erro ao atualizar a foto de perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header with Avatar */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl opacity-70"></div>
            <Card className="glass-card border-0 shadow-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-48 -translate-x-48"></div>
              
              <CardContent className="relative pt-12 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="relative group"
                  >
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                        <AvatarImage src={avatarUrl || undefined} alt={name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5">
                          <UserIcon className="h-16 w-16 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAvatarClick}
                          disabled={isUploading}
                          className="absolute bottom-2 right-2 bg-primary rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all duration-300 group-hover:opacity-100 opacity-0"
                        >
                          {isUploading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                          ) : (
                            <Camera className="h-5 w-5 text-white" />
                          )}
                        </motion.button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </motion.div>
                  
                  <div className="flex-1 text-center md:text-left pb-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {name || 'Utilizador'}
                      </h1>
                      <p className="text-muted-foreground mt-2 text-lg">{email}</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{age ? `${age} anos` : 'Idade não definida'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <Ruler className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{height ? `${height} cm` : 'Altura não definida'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                          <VenetianMask className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{gender === 'male' ? 'Masculino' : 'Feminino'}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                  >
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="rounded-full px-6 border-muted-foreground/30"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                        <Button 
                          disabled={isSaving} 
                          onClick={handleSave}
                          className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                        >
                          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Save className="mr-2 h-4 w-4" />
                          Guardar
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                    )}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-0 shadow-xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Informações Pessoais</CardTitle>
                <CardDescription>Gerencie os seus dados pessoais e preferências</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Nome
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-lg h-14 rounded-2xl border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="Digite o seu nome"
                      />
                    ) : (
                      <div className="min-h-14 flex items-center px-4 py-3 bg-muted/30 rounded-2xl">
                        <p className="text-xl font-medium">{name || 'Não definido'}</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg h-14 rounded-2xl border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                        placeholder="Digite o seu email"
                      />
                    ) : (
                      <div className="min-h-14 flex items-center px-4 py-3 bg-muted/30 rounded-2xl">
                        <p className="text-xl font-medium">{email}</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="age" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Idade
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Input
                          id="age"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="text-lg h-14 rounded-2xl border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 pl-4 pr-12 transition-all"
                          placeholder="Digite a sua idade"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">anos</span>
                      </div>
                    ) : (
                      <div className="min-h-14 flex items-center px-4 py-3 bg-muted/30 rounded-2xl">
                        <p className="text-xl font-medium">{age ? `${age} anos` : 'Não definido'}</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="height" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Altura
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="text-lg h-14 rounded-2xl border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/30 pl-4 pr-12 transition-all"
                          placeholder="Digite a sua altura"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">cm</span>
                      </div>
                    ) : (
                      <div className="min-h-14 flex items-center px-4 py-3 bg-muted/30 rounded-2xl">
                        <p className="text-xl font-medium">{height ? `${height} cm` : 'Não definido'}</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-2 md:col-span-2"
                  >
                    <Label className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Género
                    </Label>
                    {isEditing ? (
                      <RadioGroup 
                        value={gender} 
                        onValueChange={(value) => setGender(value as 'male' | 'female')} 
                        className="flex gap-6 pt-2"
                      >
                        <div className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/50 rounded-2xl px-6 py-4 transition-all cursor-pointer">
                          <RadioGroupItem value="male" id="male" className="w-5 h-5" />
                          <Label htmlFor="male" className="text-lg cursor-pointer">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/50 rounded-2xl px-6 py-4 transition-all cursor-pointer">
                          <RadioGroupItem value="female" id="female" className="w-5 h-5" />
                          <Label htmlFor="female" className="text-lg cursor-pointer">Feminino</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="min-h-14 flex items-center px-4 py-3 bg-muted/30 rounded-2xl">
                        <p className="text-xl font-medium">{gender === 'male' ? 'Masculino' : 'Feminino'}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pt-4 border-t border-muted/30"
                  >
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="rounded-full px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar Informações
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
}