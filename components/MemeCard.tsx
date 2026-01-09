'use client';

import { db } from '@/lib/db';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { id } from '@instantdb/react';

interface MemeCardProps {
  meme: {
    id: string;
    imageData: string;
    topText: string;
    bottomText: string;
    userId: string;
    createdAt: number;
    updatedAt: number;
  };
  mode: 'feed' | 'my-memes';
}

export default function MemeCard({ meme, mode }: MemeCardProps) {
  const { user } = db.useAuth();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Query upvotes for this specific meme and user (for feed mode)
  const { data: upvotesData } = db.useQuery({
    upvotes: {
      $: {
        where: { memeId: meme.id, userId: user?.id || '' },
      },
    },
  });
  
  // Query all upvotes for this meme to get count (for feed mode)
  const { data: allUpvotesData } = db.useQuery({
    upvotes: {
      $: {
        where: { memeId: meme.id },
      },
    },
  });
  
  const upvoteCount = allUpvotesData?.upvotes?.length || 0;
  const hasUpvoted = (upvotesData?.upvotes?.length || 0) > 0;
  
  const handleUpvote = () => {
    // Check authentication
    if (!user?.id) {
      setShowAuthPrompt(true);
      return;
    }
    
    const existingUpvote = upvotesData?.upvotes?.[0];
    if (existingUpvote) {
      // Delete upvote (unvote)
      db.transact(db.tx.upvotes[existingUpvote.id].delete());
    } else {
      // Create upvote
      db.transact(db.tx.upvotes[id()].update({
        memeId: meme.id,
        userId: user.id,
        createdAt: Date.now(),
      }));
    }
  };
  
  const handleEdit = () => {
    router.push(`/create?id=${meme.id}`);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meme?')) {
      db.transact(db.tx.memes[meme.id].delete());
    }
  };
  
  const handleImageClick = () => {
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };
  
  // Close fullscreen on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when fullscreen is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);
  
  return (
    <>
      <div className="meme-card">
        <img 
          src={meme.imageData} 
          alt="Meme" 
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      <div className="meme-card-actions">
        {mode === 'feed' ? (
          <>
            <button 
              className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
              onClick={handleUpvote}
            >
              <span>👍</span>
              <span>{upvoteCount}</span>
            </button>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9em' }}>
              {new Date(meme.createdAt).toLocaleDateString()}
            </span>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9em' }}>
              Updated: {new Date(meme.updatedAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
      </div>
      
      {isFullscreen && (
        <div 
          className="meme-fullscreen-overlay"
          onClick={handleCloseFullscreen}
        >
          <div 
            className="meme-fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="meme-fullscreen-close"
              onClick={handleCloseFullscreen}
              aria-label="Close fullscreen"
            >
              ×
            </button>
            <img 
              src={meme.imageData} 
              alt="Meme" 
              className="meme-fullscreen-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
