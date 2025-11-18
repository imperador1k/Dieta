'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Success - redirect to home page
      toast({
        title: "Login efetuado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/invalid-email':
          setError('O email fornecido é inválido.');
          break;
        case 'auth/user-disabled':
          setError('Esta conta foi desativada.');
          break;
        case 'auth/user-not-found':
          setError('Não existe uma conta com este email.');
          break;
        case 'auth/wrong-password':
          setError('Palavra-passe incorreta.');
          break;
        case 'auth/network-request-failed':
          setError('Erro de ligação. Por favor, verifique a sua ligação à internet e tente novamente.');
          break;
        case 'permission-denied':
          setError('Erro de permissões. Por favor, contacte o suporte técnico.');
          break;
        default:
          setError(`Ocorreu um erro ao iniciar sessão: ${error.message}`);
          break;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sessão</CardTitle>
          <CardDescription>
            Introduza o seu email e palavra-passe para continuar
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="nome@exemplo.com"
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
                autoComplete="current-password"
                autoCorrect="off"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sessão
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Criar conta
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}