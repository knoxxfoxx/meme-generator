'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';
import { id } from '@instantdb/react';
import MemeCanvas, { MemeCanvasRef } from '@/components/MemeCanvas';
import TemplateGallery from '@/components/TemplateGallery';
import ImageUpload from '@/components/ImageUpload';
import MemeToolbar from '@/components/MemeToolbar';
import Auth from '@/components/Auth';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = db.useAuth();
  const canvasRef = useRef<MemeCanvasRef>(null);
  
  const memeId = searchParams.get('id');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  
  // Load existing meme if editing
  const { data: memeData } = db.useQuery(
    memeId ? {
      memes: {
        $: {
          where: { id: memeId, userId: user?.id || '' },
        },
      },
    } : { memes: {} }
  );
  
  useEffect(() => {
    if (memeId && memeData?.memes) {
      const memes = Object.values(memeData.memes);
      const meme = memes[0] as any;
      if (meme) {
        setTopText(meme.topText || '');
        setBottomText(meme.bottomText || '');
        setFontSize(meme.fontSize || 40);
        setTextColor(meme.textColor || '#FFFFFF');
        // Load the image
        if (meme.imageData && canvasRef.current) {
          canvasRef.current.loadImageFromUrl(meme.imageData);
          setHasImage(true);
        }
      }
    }
  }, [memeId, memeData]);
  
  const handleImageSelect = (url: string) => {
    if (canvasRef.current) {
      canvasRef.current.loadImageFromUrl(url);
      setHasImage(true);
    }
  };
  
  const handleTemplateSelect = (url: string) => {
    if (canvasRef.current) {
      canvasRef.current.loadImageFromUrl(url);
      setHasImage(true);
    }
  };
  
  const handleDownload = () => {
    if (!canvasRef.current || !hasImage) {
      alert('Please select an image first!');
      return;
    }
    
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meme.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };
  
  const handleSave = async () => {
    // Check authentication
    if (!user?.id) {
      setShowAuthPrompt(true);
      return;
    }
    
    if (!canvasRef.current || !hasImage) {
      alert('Please select an image first!');
      return;
    }
    
    const imageData = canvasRef.current.toDataURL();
    const now = Date.now();
    
    if (memeId) {
      // Update existing meme
      db.transact(db.tx.memes[memeId].update({
        imageData,
        topText,
        bottomText,
        fontSize,
        textColor,
        updatedAt: now,
      }));
      alert('Meme updated successfully!');
    } else {
      // Create new meme
      db.transact(db.tx.memes[id()].update({
        imageData,
        topText,
        bottomText,
        fontSize,
        textColor,
        createdAt: now,
        updatedAt: now,
        userId: user.id,
      }));
      alert('Meme saved successfully!');
    }
    
    router.push('/feed');
  };
  
  if (showAuthPrompt) {
    return (
      <div style={{ padding: '2rem' }}>
        <Auth onAuthSuccess={() => setShowAuthPrompt(false)} />
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <aside className="left-sidebar">
        <div className="sidebar-header">
          <h2>🎭 Templates</h2>
        </div>
        <div className="sidebar-content">
          <div className="upload-section">
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
          <div className="templates-section">
            <h3>Choose Template</h3>
            <TemplateGallery onTemplateSelect={handleTemplateSelect} />
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        <div className="canvas-container">
          <MemeCanvas
            ref={canvasRef}
            topText={topText}
            bottomText={bottomText}
            fontSize={fontSize}
            textColor={textColor}
            onImageLoad={() => setHasImage(true)}
          />
        </div>
      </main>
      
      <footer className="bottom-toolbar">
        <MemeToolbar
          topText={topText}
          bottomText={bottomText}
          fontSize={fontSize}
          textColor={textColor}
          onTopTextChange={setTopText}
          onBottomTextChange={setBottomText}
          onFontSizeChange={setFontSize}
          onColorChange={setTextColor}
          onDownload={handleDownload}
          onSave={handleSave}
        />
      </footer>
    </div>
  );
}
