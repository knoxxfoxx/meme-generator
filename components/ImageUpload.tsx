'use client';

import { useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (dataUrl: string) => void;
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <label htmlFor="imageUpload" className="upload-btn">
      <span className="upload-icon">📤</span>
      <span>Upload Image</span>
      <input
        ref={fileInputRef}
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </label>
  );
}
