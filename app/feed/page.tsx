'use client';

import { db } from '@/lib/db';
import MemeCard from '@/components/MemeCard';

export default function FeedPage() {
  const { data, isLoading } = db.useQuery({
    memes: {
      $: {
        order: {
          serverCreatedAt: 'desc' as const,
        },
      },
    },
  });
  
  if (isLoading) {
    return (
      <div className="feed-container">
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Meme Feed</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading memes...</p>
      </div>
    );
  }
  
  const memes = data?.memes ? Object.values(data.memes) : [];
  
  return (
    <div className="feed-container">
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Meme Feed</h1>
      {memes.length === 0 ? (
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No memes yet. Be the first to create one!
        </p>
      ) : (
        <div className="meme-grid">
          {memes.map((meme: any) => (
            <MemeCard key={meme.id} meme={meme} mode="feed" />
          ))}
        </div>
      )}
    </div>
  );
}
