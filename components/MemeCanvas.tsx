'use client';

import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

interface MemeCanvasProps {
  topText: string;
  bottomText: string;
  fontSize: number;
  textColor: string;
  onImageLoad?: (img: HTMLImageElement) => void;
}

export interface MemeCanvasRef {
  loadImageFromUrl: (url: string) => void;
  toDataURL: () => string;
  toBlob: (callback: (blob: Blob | null) => void) => void;
}

const MemeCanvas = forwardRef<MemeCanvasRef, MemeCanvasProps>(({
  topText,
  bottomText,
  fontSize,
  textColor,
  onImageLoad,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    loadImageFromUrl: (url: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setCurrentImage(img);
        if (onImageLoad) onImageLoad(img);
      };
      img.onerror = () => {
        alert('Failed to load image. Please try another image.');
      };
      img.src = url;
    },
    toDataURL: () => {
      // Use JPEG with 0.8 quality for smaller file size (PNG can be very large)
      return canvasRef.current?.toDataURL('image/jpeg', 0.8) || '';
    },
    toBlob: (callback: (blob: Blob | null) => void) => {
      canvasRef.current?.toBlob(callback, 'image/png');
    },
  }));
  
  // Canvas drawing logic
  useEffect(() => {
    if (!canvasRef.current || !currentImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limit canvas size to reduce file size (max 800px width)
    const MAX_WIDTH = 800;
    let width = currentImage.width;
    let height = currentImage.height;
    
    if (width > MAX_WIDTH) {
      height = (height * MAX_WIDTH) / width;
      width = MAX_WIDTH;
    }
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image (scaled to fit)
    ctx.drawImage(currentImage, 0, 0, width, height);
    
    // Draw text overlays
    drawText(ctx, canvas.width, canvas.height);
  }, [currentImage, topText, bottomText, fontSize, textColor]);
  
  const drawText = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Draw top text
    if (topText) {
      drawTextWithBorder(ctx, topText, width / 2, 20);
    }
    
    // Draw bottom text
    if (bottomText) {
      const textMetrics = ctx.measureText(bottomText);
      const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      drawTextWithBorder(ctx, bottomText, width / 2, height - textHeight - 20);
    }
  }, [topText, bottomText, fontSize, textColor]);
  
  const drawTextWithBorder = useCallback((
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number
  ) => {
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Draw black stroke (border)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(3, fontSize / 10);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    
    // Draw stroke multiple times for thicker border
    for (let i = 0; i < 3; i++) {
      ctx.strokeText(text, x, y);
    }
    
    // Draw fill with selected color
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
  }, [fontSize, textColor]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="meme-canvas"
    />
  );
});

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas;
