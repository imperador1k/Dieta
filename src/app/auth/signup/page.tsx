'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [step, setStep] = useState(1); // 1 for email/password, 2 for profile info
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(false); // Track if user account was created
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  // Redirect if user is already logged in (but not during signup process)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Only redirect if there's a user and we're not in the middle of signup
      if (user && !userCreated) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router, userCreated]);

  const validateForm = () => {
    if (step === 1) {
      if (!email || !password || !confirmPassword) {
        setError('Por favor, preencha todos os campos.');
        return false;
      }

      if (password.length < 6) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.');
        return false;
      }

      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem.');
        return false;
      }
      
      return true;
    } else {
      // Step 2 - profile information
      if (!name) {
        setError('Por favor, introduza o seu nome.');
        return false;
      }
      
      if (!age || parseInt(age) <= 0) {
        setError('Por favor, introduza uma idade válida.');
        return false;
      }
      
      if (!height || parseInt(height) <= 0) {
        setError('Por favor, introduza uma altura válida.');
        return false;
      }
      
      return true;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (step === 1) {
        // Step 1: Just move to step 2, don't create account yet
        setStep(2);
        setIsLoading(false);
      } else {
        // Step 2: Create user account and save profile information
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUserCreated(true);
        
        // Get the user ID
        const user = userCredential.user;
        if (user) {
          // Save profile data
          const profileData = {
            name,
            email,
            age: parseInt(age),
            height: parseInt(height),
            gender
          };
          
          // We need to save this data to Firestore
          const { doc } = await import('firebase/firestore');
          const { getFirestore } = await import('firebase/firestore');
          const { getApp } = await import('firebase/app');
          const { setDocumentNonBlocking } = await import('@/firebase/non-blocking-updates');
          
          const firestore = getFirestore(getApp());
          const profileRef = doc(firestore, `users/${user.uid}`);
          setDocumentNonBlocking(profileRef, profileData, { merge: true });
          
          // Success - redirect to home page
          toast({
            title: "Conta criada com sucesso!",
            description: "A sua conta foi criada. Bem-vindo à nossa aplicação.",
          });
          
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setIsLoading(false);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está registado. Por favor, utilize outro email ou faça login.');
          break;
        case 'auth/invalid-email':
          setError('O email fornecido é inválido. Por favor, verifique o email e tente novamente.');
          break;
        case 'auth/operation-not-allowed':
          setError('O registo de novas contas está temporariamente desativado. Por favor, tente mais tarde.');
          break;
        case 'auth/weak-password':
          setError('A palavra-passe é muito fraca. Por favor, escolha uma palavra-passe mais forte.');
          break;
        case 'auth/network-request-failed':
          setError('Erro de ligação. Por favor, verifique a sua ligação à internet e tente novamente.');
          break;
        case 'permission-denied':
          setError('Erro de permissões. Por favor, contacte o suporte técnico.');
          break;
        default:
          setError(`Ocorreu um erro ao criar a conta: ${error.message}`);
          break;
      }
    }
  };

  // Effect to handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Only redirect if user is authenticated and we haven't created an account yet
      if (user && !userCreated) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router, userCreated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Introduza o seu email e palavra-passe para criar uma conta'
              : 'Introduza as suas informações pessoais'
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              // Step 1: Email and password
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              // Step 2: Profile information
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    disabled={isLoading}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="50"
                    max="250"
                    disabled={isLoading}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Género</Label>
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="female">Feminino</Label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              {step === 2 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              )}
              <Button className="flex-1" disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 1 ? 'Continuar' : 'Criar Conta'}
              </Button>
            </div>
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Iniciar sessão
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}