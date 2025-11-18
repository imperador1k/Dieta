'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOut() {
  // Clear the authentication token cookie
  (await cookies()).delete('token');
  redirect('/auth/login');
}