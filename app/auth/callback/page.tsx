'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  
  useEffect(() => {
    // InstantDB handles the auth automatically
    // Just redirect to the feed after a short delay
    const timer = setTimeout(() => {
      router.push('/feed');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: 'white',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <p>Completing sign in...</p>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>You will be redirected shortly.</p>
    </div>
  );
}
