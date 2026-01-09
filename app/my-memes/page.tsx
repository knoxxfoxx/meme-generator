'use client';

import { db } from '@/lib/db';
import MemeCard from '@/components/MemeCard';
import Auth from '@/components/Auth';

export default function MyMemesPage() {
  const { user, isLoading: authLoading } = db.useAuth();
  
  const { data, isLoading } = db.useQuery(
    user?.id ? {
      memes: {
        $: {
          where: { userId: user.id },
          order: {
            serverCreatedAt: 'desc' as const,
          },
        },
      },
    } : { memes: {} }
  );
  
  if (!user?.id) {
    return (
      <div className="my-memes-container">
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>My Memes</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
          Please sign in to view your memes.
        </p>
        <Auth />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="my-memes-container">
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>My Memes</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading your memes...</p>
      </div>
    );
  }
  
  const memes = data?.memes ? Object.values(data.memes) : [];
  
  return (
    <div className="my-memes-container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>My Memes</h1>
      {memes.length === 0 ? (
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          You haven't created any memes yet. Create your first meme!
        </p>
      ) : (
        <div className="meme-grid">
          {memes.map((meme: any) => (
            <MemeCard key={meme.id} meme={meme} mode="my-memes" />
          ))}
        </div>
      )}
    </div>
  );
}
