'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import StatsCard from '../components/StatsCard';
import VirtualTryOn from '../components/VirtualTryOn';

interface GeneratedImage {
  id: string;
  data: string;
  mimeType: string;
  prompt: string;
  timestamp: number;
  aspectRatio?: string;
  negativePrompt?: string;
  stylePreset?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [stylePreset, setStylePreset] = useState('realistic');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'prompt'>('newest');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{current: number, total: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ai-image-gen-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGeneratedImages(parsed);
      } catch (e) {
        console.error('Failed to parse stored images:', e);
      }
    }

    const storedDarkMode = localStorage.getItem('ai-image-gen-darkmode');
    if (storedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Save images to localStorage whenever they change
  useEffect(() => {
    if (generatedImages.length > 0) {
      localStorage.setItem('ai-image-gen-history', JSON.stringify(generatedImages));
    }
  }, [generatedImages]);

  // Apply dark mode to document
  useEffect(() => {
    localStorage.setItem('ai-image-gen-darkmode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter and sort images
  useEffect(() => {
    let filtered = [...generatedImages];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(img =>
        img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'prompt':
          return a.prompt.localeCompare(b.prompt);
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  }, [generatedImages, searchTerm, sortBy]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setWarning(null);
    setProgress({ current: 0, total: numberOfImages });

    // Simulate progress updates (approximate timing: ~8 seconds per image)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (!prev) return null;
        // Increment current by 1 every ~8 seconds, but don't exceed total
        const newCurrent = Math.min(prev.current + 1, prev.total);
        return { current: newCurrent, total: prev.total };
      });
    }, 8000);

    try {
      let response;

      if (referenceImage) {
        // Generate with reference image
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('numberOfImages', numberOfImages.toString());
        formData.append('referenceImage', referenceImage);

        response = await fetch('/api/generate-with-image', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Generate without reference image
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            numberOfImages,
          }),
        });
      }

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate images');
      }

      const data = await response.json();
      
      // Handle partial failures
      if (data.failed > 0) {
        setWarning(`Successfully generated ${data.success} of ${numberOfImages} images. ${data.failed} failed.`);
      }

      const newImages = data.images.map((img: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        data: img.data,
        mimeType: img.mimeType,
        prompt,
        timestamp: Date.now(),
        aspectRatio,
        negativePrompt: negativePrompt.trim() || undefined,
        stylePreset,
      }));

      setGeneratedImages([...newImages, ...generatedImages]);
      setProgress({ current: data.success, total: numberOfImages });
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'An error occurred while generating images');
    } finally {
      setLoading(false);
      // Clear progress after a delay
      setTimeout(() => setProgress(null), 2000);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.data}`;
    link.download = `generated-${image.id}.png`;
    link.click();
  };

  const downloadAllImages = () => {
    filteredImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all image history?')) {
      setGeneratedImages([]);
      setFilteredImages([]);
      localStorage.removeItem('ai-image-gen-history');
    }
  };

  const deleteImage = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const applyPromptTemplate = (template: string) => {
    setPrompt(template);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayImages = generatedImages.filter(img => 
      new Date(img.timestamp).setHours(0, 0, 0, 0) === today
    ).length;

    const styleCount: Record<string, number> = {};
    const ratioCount: Record<string, number> = {};

    generatedImages.forEach(img => {
      const style = img.stylePreset || 'realistic';
      const ratio = img.aspectRatio || '1:1';
      styleCount[style] = (styleCount[style] || 0) + 1;
      ratioCount[ratio] = (ratioCount[ratio] || 0) + 1;
    });

    const favoriteStyle = Object.keys(styleCount).reduce((a, b) => 
      styleCount[a] > styleCount[b] ? a : b, 'realistic'
    );

    const mostUsedRatio = Object.keys(ratioCount).reduce((a, b) => 
      ratioCount[a] > ratioCount[b] ? a : b, '1:1'
    );

    return {
      totalImages: generatedImages.length,
      todayImages,
      favoriteStyle,
      mostUsedRatio,
    };
  }, [generatedImages]);

  const promptTemplates = [
    'A stunning landscape with mountains, lakes, and golden sunset lighting, photorealistic, 8k quality',
    'A futuristic cyberpunk city at night with neon lights, rain-soaked streets, and flying vehicles',
    'A cozy coffee shop interior with warm lighting, vintage furniture, and large windows',
    'A majestic dragon perched on a cliff overlooking a fantasy kingdom',
    'An abstract art piece with vibrant colors, geometric shapes, and fluid patterns',
    'A professional product photography of a luxury watch on a marble surface',
  ];

  const stylePresets = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic style' },
    { value: 'artistic', label: 'Artistic', description: 'Painterly and creative' },
    { value: 'anime', label: 'Anime', description: 'Japanese anime style' },
    { value: 'digital-art', label: 'Digital Art', description: 'Modern digital illustration' },
    { value: '3d-render', label: '3D Render', description: 'High-quality 3D rendering' },
    { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' },
  ];

  return (
    <main className={`min-h-screen p-4 md:p-8 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-neo-white'}`}>
      {/* Header */}
      <header className="mb-8">
        <div className="neo-card bg-neo-yellow p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase">
              🎨 AI IMAGE GEN PRO
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="neo-btn bg-neo-purple text-sm px-4 py-2"
              title="Toggle dark mode"
            >
              {darkMode ? '☀️ LIGHT' : '🌙 DARK'}
            </button>
          </div>
          <p className="text-lg font-bold">Powered by Gemini 2.5 Flash Image • Advanced Features • Pro Tools</p>
          <div className="flex gap-4 mt-3 text-sm font-bold flex-wrap">
            <span>✨ Batch Generation</span>
            <span>🎭 Style Presets</span>
            <span>💾 Auto-Save</span>
            <span>🔍 Smart Search</span>
            <span>👔 Virtual Try-On</span>
          </div>
        </div>
      </header>

      {/* Quick Access Buttons */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="neo-card bg-neo-purple p-4">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setShowVirtualTryOn(true)}
              className="neo-btn bg-neo-pink flex-1 min-w-[200px]"
            >
              👔 Virtual Try-On
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="neo-btn bg-neo-blue flex-1 min-w-[200px]"
              disabled={generatedImages.length === 0}
            >
              🖼️ View Gallery ({generatedImages.length})
            </button>
          </div>
          <p className="text-xs font-bold mt-3">
            💡 New! Try Virtual Try-On to see how clothes look on any person
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      {generatedImages.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <StatsCard
            totalImages={stats.totalImages}
            todayImages={stats.todayImages}
            favoriteStyle={stats.favoriteStyle}
            mostUsedRatio={stats.mostUsedRatio}
          />
        </div>
      )}

      {/* Prompt Templates */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="neo-card p-6 bg-neo-pink">
          <h2 className="text-xl font-black uppercase mb-4">💡 Prompt Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promptTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => applyPromptTemplate(template)}
                className="neo-btn bg-neo-white text-left text-sm p-3 hover:bg-neo-yellow transition-colors"
              >
                {template.substring(0, 60)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="neo-card p-6 bg-neo-blue mb-6">
          <h2 className="text-2xl font-black uppercase mb-4">✨ Create Image</h2>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">Prompt</label>
            <textarea
              className="neo-textarea w-full"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              maxLength={480}
            />
            <p className="text-xs mt-1 font-bold">{prompt.length}/480 characters</p>
          </div>

          {/* Negative Prompt */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">
              Negative Prompt (Optional) - What to Avoid
            </label>
            <textarea
              className="neo-textarea w-full"
              rows={2}
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="E.g., blurry, distorted, low quality, watermark..."
              maxLength={240}
            />
            <p className="text-xs mt-1 font-bold">{negativePrompt.length}/240 characters</p>
          </div>

          {/* Style Preset */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">🎭 Style Preset</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setStylePreset(preset.value)}
                  className={`neo-btn text-sm p-3 ${
                    stylePreset === preset.value ? 'bg-neo-green' : 'bg-neo-white'
                  }`}
                >
                  <div className="font-black">{preset.label}</div>
                  <div className="text-xs">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">📏 Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`neo-btn text-sm ${
                    aspectRatio === ratio ? 'bg-neo-orange' : 'bg-neo-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Image Upload */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">
              Reference Image (Optional)
            </label>
            <div className="flex gap-4 items-start">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="neo-btn bg-neo-purple cursor-pointer inline-block"
              >
                Upload Image
              </label>
              {referenceImagePreview && (
                <div className="relative">
                  <img
                    src={referenceImagePreview}
                    alt="Reference"
                    className="neo-border w-32 h-32 object-cover"
                  />
                  <button
                    onClick={clearReferenceImage}
                    className="absolute -top-2 -right-2 bg-neo-pink neo-border w-8 h-8 flex items-center justify-center font-black"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="mb-4">
            <label className="block font-bold mb-2 uppercase text-sm">
              Number of Images
            </label>
            <select
              className="neo-select w-full"
              value={numberOfImages}
              onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
            >
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
            className="neo-btn w-full bg-neo-green"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                {progress ? `Generating ${progress.current + 1}/${progress.total}...` : 'Generating...'}
              </span>
            ) : (
              'Generate Images'
            )}
          </button>

          {/* Progress Message */}
          {progress && !loading && (
            <div className="mt-4 neo-border bg-neo-green p-4">
              <p className="font-bold">✓ Generated {progress.current} of {progress.total} images</p>
            </div>
          )}

          {/* Warning Message */}
          {warning && (
            <div className="mt-4 neo-border bg-neo-orange p-4">
              <p className="font-bold">⚠️ {warning}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 neo-border bg-neo-pink p-4">
              <p className="font-bold">❌ Error: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="neo-card bg-neo-orange p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-black uppercase">🖼️ Generated Images</h2>
                <p className="text-sm font-bold mt-1">
                  Showing {filteredImages.length} of {generatedImages.length} images
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadAllImages}
                  className="neo-btn bg-neo-green text-sm px-4 py-2"
                  disabled={filteredImages.length === 0}
                >
                  💾 Download All
                </button>
                <button
                  onClick={clearHistory}
                  className="neo-btn bg-neo-pink text-sm px-4 py-2"
                >
                  🗑️ Clear History
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-xs">🔍 Search Prompts</label>
                <input
                  type="text"
                  className="neo-input w-full"
                  placeholder="Search by prompt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase text-xs">📋 Sort By</label>
                <select
                  className="neo-select w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="prompt">By Prompt (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="image-grid">
            {filteredImages.map((image) => (
              <div key={image.id} className="neo-card p-4 bg-neo-white">
                <div 
                  className="cursor-pointer mb-4"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`data:${image.mimeType};base64,${image.data}`}
                    alt={image.prompt}
                    className="w-full h-auto hover:opacity-90 transition-opacity"
                  />
                </div>
                <p className="text-sm font-bold mb-2 line-clamp-2">{image.prompt}</p>
                <div className="flex gap-2 text-xs font-bold mb-2">
                  <span className="bg-neo-blue px-2 py-1 neo-border">{image.aspectRatio || '1:1'}</span>
                  <span className="bg-neo-purple px-2 py-1 neo-border">{image.stylePreset || 'default'}</span>
                </div>
                <p className="text-xs mb-3">{new Date(image.timestamp).toLocaleString()}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage(image)}
                    className="neo-btn bg-neo-green flex-1 text-sm"
                  >
                    ⬇️ Download
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="neo-btn bg-neo-pink text-sm px-3"
                    title="Delete image"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 neo-btn bg-neo-pink w-12 h-12 text-2xl z-10"
            >
              ×
            </button>
            <div className="neo-card bg-neo-white p-6">
              <img
                src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`}
                alt={selectedImage.prompt}
                className="w-full h-auto mb-4"
              />
              <div className="space-y-3">
                <div>
                  <h3 className="font-black uppercase text-sm mb-1">💬 Prompt:</h3>
                  <p className="text-sm">{selectedImage.prompt}</p>
                </div>
                {selectedImage.negativePrompt && (
                  <div>
                    <h3 className="font-black uppercase text-sm mb-1">⛔ Negative Prompt:</h3>
                    <p className="text-sm">{selectedImage.negativePrompt}</p>
                  </div>
                )}
                <div className="flex gap-4 flex-wrap text-sm font-bold">
                  <span>📏 Ratio: {selectedImage.aspectRatio || '1:1'}</span>
                  <span>🎭 Style: {selectedImage.stylePreset || 'default'}</span>
                  <span>🕒 {new Date(selectedImage.timestamp).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="neo-btn bg-neo-green w-full"
                >
                  💾 Download Full Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {generatedImages.length === 0 && !loading && (
        <div className="max-w-4xl mx-auto">
          <div className="neo-card bg-neo-purple p-6">
            <h3 className="text-xl font-black uppercase mb-4">Getting Started</h3>
            <ol className="space-y-2 font-bold">
              <li>1. Add your Gemini API key to .env.local file</li>
              <li>2. Enter a descriptive prompt</li>
              <li>3. (Optional) Upload a reference image</li>
              <li>4. Select your preferred settings</li>
              <li>5. Click Generate Images!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      {showVirtualTryOn && (
        <VirtualTryOn onClose={() => setShowVirtualTryOn(false)} />
      )}
    </main>
  );
}
