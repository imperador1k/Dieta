'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function LogoutButton() {
  const router = useRouter();
  const auth = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/auth/login'); // Still redirect even if there's an error
    }
  };

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sair
    </Button>
  );
}