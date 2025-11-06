'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import VirtualTryOn from '../components/VirtualTryOn';
import ThemeToggle from '@/components/ThemeToggle';
import './app.css';

interface GeneratedImage {
  id: string;
  data: string;
  mimeType: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: string;
  stylePreset?: string;
}

export default function AppPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [stylePreset, setStylePreset] = useState('realistic');
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ai-image-gen-history');
    if (stored) {
      try {
        setGeneratedImages(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored images:', e);
      }
    }
  }, []);

  // Save to localStorage with quota management
  useEffect(() => {
    if (generatedImages.length > 0) {
      try {
        // Keep only the latest 50 images to prevent quota issues
        const limitedImages = generatedImages.slice(0, 50);
        localStorage.setItem('ai-image-gen-history', JSON.stringify(limitedImages));
      } catch (e) {
        // If still quota exceeded, keep only 20 most recent
        console.warn('LocalStorage quota exceeded, reducing to 20 images');
        try {
          const veryLimitedImages = generatedImages.slice(0, 20);
          localStorage.setItem('ai-image-gen-history', JSON.stringify(veryLimitedImages));
        } catch (finalError) {
          console.error('Unable to save to localStorage:', finalError);
        }
      }
    }
  }, [generatedImages]);

  // Filter images
  useEffect(() => {
    let filtered = [...generatedImages];
    if (searchTerm.trim()) {
      filtered = filtered.filter(img =>
        img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      return sortBy === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
    });
    setFilteredImages(filtered);
  }, [generatedImages, searchTerm, sortBy]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setReferenceImages(prev => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReferencePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const clearReferenceImage = (index?: number) => {
    if (typeof index === 'number') {
      setReferenceImages(prev => prev.filter((_, i) => i !== index));
      setReferencePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setReferenceImages([]);
      setReferencePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      if (referenceImages.length > 0) {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('numberOfImages', numberOfImages.toString());
        referenceImages.forEach((file) => formData.append('referenceImages', file));

        response = await fetch('/api/generate-with-image', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, numberOfImages }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate images');
      }

      const data = await response.json();
      const newImages = data.images.map((img: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        data: img.data,
        mimeType: img.mimeType,
        prompt,
        timestamp: Date.now(),
        aspectRatio,
        stylePreset,
      }));

      setGeneratedImages([...newImages, ...generatedImages]);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating images');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.data}`;
    link.download = `generated-${image.id}.png`;
    link.click();
  };

  const deleteImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const stylePresets = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'anime', label: 'Anime' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: '3d-render', label: '3D Render' },
    { value: 'minimalist', label: 'Minimalist' },
  ];

  const promptTemplates = [
    'A stunning landscape with mountains, lakes, and golden sunset lighting, photorealistic, 8k quality',
    'A futuristic cyberpunk city at night with neon lights and flying vehicles',
    'A cozy coffee shop interior with warm lighting and vintage furniture',
    'A majestic dragon perched on a cliff overlooking a fantasy kingdom',
    'An abstract art piece with vibrant colors and geometric shapes',
    'A professional product photography of a luxury watch on marble surface',
  ];

  const applyTemplate = (template: string) => {
    setPrompt(template);
  };

  const downloadAllImages = () => {
    filteredImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all image history?')) {
      setGeneratedImages([]);
      localStorage.removeItem('ai-image-gen-history');
    }
  };

  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayImages = generatedImages.filter(img =>
      new Date(img.timestamp).setHours(0, 0, 0, 0) === today
    ).length;

    const styleCount: Record<string, number> = {};
    generatedImages.forEach(img => {
      const style = img.stylePreset || 'realistic';
      styleCount[style] = (styleCount[style] || 0) + 1;
    });

    const favoriteStyle = Object.keys(styleCount).reduce((a, b) =>
      styleCount[a] > styleCount[b] ? a : b, 'realistic'
    );

    return {
      total: generatedImages.length,
      today: todayImages,
      favoriteStyle,
    };
  }, [generatedImages]);

  return (
    <div className="app-page">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <a href="/" className="app-logo">
            <span className="app-logo-icon">🎨</span>
            <span>AI Image Gen Pro</span>
          </a>
          <div className="app-nav">
            <div className="app-user-info">
              <span>👤</span>
              <span>{user?.email}</span>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className="app-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="app-container">
        {/* Storage Notice */}
        {generatedImages.length > 40 && (
          <div className="md-alert md-alert-warning mb-24">
            ⚠️ Storage limit: Keeping latest 50 images. Download important ones to avoid losing them.
          </div>
        )}

        {/* Quick Actions */}
        <div className="md-card">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowVirtualTryOn(true)} className="md-btn md-btn-secondary" style={{ flex: 1, minWidth: '220px' }}>
              👔 Virtual Try-On
            </button>
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
              className="md-btn md-btn-outline"
              style={{ flex: 1, minWidth: '220px' }}
              disabled={generatedImages.length === 0}
            >
              🖼️ View Gallery ({generatedImages.length})
            </button>
          </div>
        </div>

        {/* Stats */}
        {generatedImages.length > 0 && (
          <div className="md-stats-grid">
            <div className="md-stat-card">
              <div className="md-stat-number">{stats.total}</div>
              <div className="md-stat-label">Total Images</div>
            </div>
            <div className="md-stat-card">
              <div className="md-stat-number">{stats.today}</div>
              <div className="md-stat-label">Today</div>
            </div>
            <div className="md-stat-card">
              <div className="md-stat-number">{stats.favoriteStyle}</div>
              <div className="md-stat-label">Fav Style</div>
            </div>
          </div>
        )}

        {/* Prompt Templates */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">
              <span>💡</span> Prompt Templates
            </h2>
          </div>
          <div className="md-grid-2">
            {promptTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => applyTemplate(template)}
                className="md-btn md-btn-outline"
                style={{ textAlign: 'left', padding: '12px' }}
              >
                {template.substring(0, 60)}...
              </button>
            ))}
          </div>
        </div>

        {/* Generation Form */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">
              <span>✨</span> Create Image
            </h2>
          </div>

          {/* Prompt */}
          <div className="mb-16">
            <label className="md-label">Prompt</label>
            <textarea
              className="md-textarea"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              maxLength={480}
            />
            <div className="text-sm mt-16">{prompt.length}/480 characters</div>
          </div>

          {/* Negative Prompt */}
          <div className="mb-16">
            <label className="md-label">Negative Prompt (Optional)</label>
            <textarea
              className="md-textarea"
              rows={2}
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid: blurry, distorted, low quality, watermark..."
              maxLength={240}
            />
            <div className="text-sm mt-16">{negativePrompt.length}/240 characters</div>
          </div>

          {/* Style Preset */}
          <div className="mb-16">
            <label className="md-label">Style Preset</label>
            <div className="md-grid-3">
              {stylePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setStylePreset(preset.value)}
                  className={`md-btn ${
                    stylePreset === preset.value ? 'md-btn-primary' : 'md-btn-outline'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-16">
            <label className="md-label">Aspect Ratio</label>
            <div className="md-grid-3">
              {['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`md-btn ${
                    aspectRatio === ratio ? 'md-btn-secondary' : 'md-btn-outline'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Images */}
          <div className="mb-16">
            <label className="md-label">Reference Images (Optional)</label>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="md-btn md-btn-outline" style={{ cursor: 'pointer' }}>
                Upload Images
              </label>
              {referenceImages.length > 0 && (
                <button
                  onClick={() => clearReferenceImage()}
                  className="md-btn md-btn-outline"
                  style={{ marginLeft: '12px' }}
                >
                  Clear All
                </button>
              )}
            </div>
            {referencePreviews.length > 0 && (
              <div className="md-reference-grid">
                {referencePreviews.map((src, idx) => (
                  <div key={idx} className="md-reference-item">
                    <img src={src} alt={`Reference ${idx + 1}`} className="md-reference-img" />
                    <button
                      onClick={() => clearReferenceImage(idx)}
                      className="md-reference-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Number of Images */}
          <div className="mb-16">
            <label className="md-label">Number of Images</label>
            <select className="md-select" value={numberOfImages} onChange={(e) => setNumberOfImages(parseInt(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateImages}
            disabled={loading || !prompt.trim()}
            className="md-btn md-btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="md-spinner" style={{ width: '20px', height: '20px' }}></div>
                Generating...
              </>
            ) : (
              'Generate Images'
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="md-alert md-alert-error mt-16">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Gallery */}
        {generatedImages.length > 0 && (
          <div className="md-card">
            <div className="md-card-header">
              <h2 className="md-card-title">
                <span>🖼️</span> Generated Images ({filteredImages.length})
              </h2>
            </div>

            {/* Search & Actions */}
            <div className="md-grid-2 mb-24">
              <div>
                <label className="md-label">Search</label>
                <input
                  type="text"
                  className="md-input"
                  placeholder="Search by prompt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="md-label">Sort By</label>
                <select className="md-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={downloadAllImages} className="md-btn md-btn-secondary" disabled={filteredImages.length === 0}>
                💾 Download All
              </button>
              <button onClick={clearHistory} className="md-btn md-btn-outline">
                🗑️ Clear History
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="md-gallery">
              {filteredImages.map((image) => (
                <div key={image.id} className="md-gallery-item">
                  <img
                    src={`data:${image.mimeType};base64,${image.data}`}
                    alt={image.prompt}
                    className="md-gallery-img"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="md-gallery-content">
                    <p className="text-sm font-bold mb-16" style={{ lineHeight: '1.4' }}>
                      {image.prompt.substring(0, 80)}...
                    </p>
                    <div className="md-gallery-meta">
                      <span className="md-chip">{image.aspectRatio || '1:1'}</span>
                      <span className="md-chip">{image.stylePreset || 'default'}</span>
                    </div>
                    <div className="md-gallery-actions">
                      <button onClick={() => downloadImage(image)} className="md-btn md-btn-primary" style={{ flex: 1, padding: '10px' }}>
                        ⬇️
                      </button>
                      <button onClick={() => deleteImage(image.id)} className="md-btn md-btn-outline" style={{ padding: '10px' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedImages.length === 0 && !loading && (
          <div className="md-card text-center">
            <h3 className="md-card-title" style={{ marginBottom: '16px', justifyContent: 'center' }}>
              👋 Welcome to AI Image Gen Pro
            </h3>
            <p style={{ marginBottom: '16px' }}>Start by entering a prompt and clicking Generate Images</p>
          </div>
        )}
      </div>

      {/* Virtual Try-On Modal */}
      {showVirtualTryOn && (
        <VirtualTryOn onClose={() => setShowVirtualTryOn(false)} />
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="md-modal" onClick={() => setSelectedImage(null)}>
          <div className="md-modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <button onClick={() => setSelectedImage(null)} className="md-modal-close">
              ×
            </button>
            <img
              src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`}
              alt={selectedImage.prompt}
              style={{ width: '100%', height: 'auto', marginBottom: '16px', borderRadius: '12px', border: '3px solid var(--neo-black)' }}
            />
            <div style={{ marginBottom: '12px' }}>
              <h4 className="font-bold mb-16">Prompt:</h4>
              <p className="text-sm">{selectedImage.prompt}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <span className="md-chip-primary md-chip">Ratio: {selectedImage.aspectRatio || '1:1'}</span>
              <span className="md-chip-secondary md-chip">Style: {selectedImage.stylePreset || 'default'}</span>
            </div>
            <button onClick={() => downloadImage(selectedImage)} className="md-btn md-btn-primary" style={{ width: '100%' }}>
              💾 Download Full Resolution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
