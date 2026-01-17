import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/lib/api/auth';

export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token || null;
}

export async function getServerUser(): Promise<User | null> {
  try {
    const token = await getServerToken();
    
    if (!token) {
      return null;
    }

    // Get backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '';
    
    if (!backendUrl) {
      return null;
    }

    // Fetch user profile from backend
    const response = await fetch(`${backendUrl}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token cookie
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        return null;
      }
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching server user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<{ token: string; user: User }> {
  const token = await getServerToken();
  const user = await getServerUser();
  
  if (!token || !user) {
    redirect('/signin');
  }
  
  return { token, user };
}

export async function requireRole(role: string): Promise<{ token: string; user: User }> {
  const { token, user } = await requireAuth();
  
  if (user.role !== role) {
    // Redirect to login - cookies will be cleared on client-side logout
    redirect(`/signin?error=unauthorized`);
  }
  
  return { token, user };
}
