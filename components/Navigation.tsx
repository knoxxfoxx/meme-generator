'use client';

import { db } from '@/lib/db';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  // Always call hooks at the top level
  const { user, isLoading, error } = db.useAuth();
  
  return (
    <nav>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/feed" style={{ 
          fontWeight: pathname === '/feed' ? 'bold' : 'normal',
          color: pathname === '/feed' ? 'white' : 'rgba(255, 255, 255, 0.8)'
        }}>
          Feed
        </Link>
        <Link href="/create" style={{ 
          fontWeight: pathname === '/create' ? 'bold' : 'normal',
          color: pathname === '/create' ? 'white' : 'rgba(255, 255, 255, 0.8)'
        }}>
          Create
        </Link>
        {user && (
          <Link href="/my-memes" style={{ 
            fontWeight: pathname === '/my-memes' ? 'bold' : 'normal',
            color: pathname === '/my-memes' ? 'white' : 'rgba(255, 255, 255, 0.8)'
          }}>
            My Memes
          </Link>
        )}
      </div>
      
      <div className="auth-section">
        {isLoading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span>Signed in as {user.email}</span>
            <button onClick={() => db.auth.signOut()}>Sign Out</button>
          </>
        ) : (
          <Link href="/auth">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
