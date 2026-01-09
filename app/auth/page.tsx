'use client';

import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import Auth from '@/components/Auth';

export default function AuthPage() {
  const router = useRouter();
  const { user } = db.useAuth();
  
  // If already signed in, redirect to feed
  if (user) {
    router.push('/feed');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        <p>Redirecting...</p>
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <Auth onAuthSuccess={() => router.push('/feed')} />
    </div>
  );
}
