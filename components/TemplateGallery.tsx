'use client';

import { useState, useEffect } from 'react';

interface TemplateGalleryProps {
  onTemplateSelect: (url: string, name: string) => void;
}

export default function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    try {
      const response = await fetch('/assets/templates.json');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Could not load templates.json:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTemplateClick = (imageName: string) => {
    setSelectedTemplate(imageName);
    onTemplateSelect(`/assets/${imageName}`, imageName);
  };
  
  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>Loading templates...</p>;
  }
  
  if (templates.length === 0) {
    return <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>No templates found.</p>;
  }
  
  return (
    <div className="template-gallery">
      {templates.map((imageName, index) => (
        <div
          key={index}
          className={`template-item ${selectedTemplate === imageName ? 'active' : ''}`}
          onClick={() => handleTemplateClick(imageName)}
        >
          <img
            src={`/assets/${imageName}`}
            alt={`Template ${index + 1}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('./')) {
                target.src = `./assets/${imageName}`;
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
