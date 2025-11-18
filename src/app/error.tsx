'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { FirestorePermissionError } from '@/firebase/errors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  // Check if this is a Firestore permission error
  const isPermissionError = error instanceof FirestorePermissionError;
  
  return (
    <div className="container flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isPermissionError ? 'Acesso Negado' : 'Algo correu mal!'}
          </CardTitle>
          <CardDescription>
            {isPermissionError 
              ? 'Não tem permissões suficientes para realizar esta ação.' 
              : 'Ocorreu um erro inesperado.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isPermissionError && (
              <p className="text-sm text-muted-foreground">
                Se o problema persistir, por favor contacte o suporte.
              </p>
            )}
            
            {isPermissionError && (
              <div className="text-left space-y-2">
                <p className="text-sm font-medium">Detalhes do erro:</p>
                <pre className="text-xs p-3 bg-muted rounded-md overflow-x-auto">
                  {error.message}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={() => reset()} className="w-full">
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            Voltar para a página inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}