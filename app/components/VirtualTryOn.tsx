'use client';

import { useState, useRef } from 'react';

interface TryOnResult {
  id: string;
  data: string;
  mimeType: string;
  personImagePreview: string;
  clothingImagePreview: string;
  timestamp: number;
  additionalPrompt?: string;
}

interface VirtualTryOnProps {
  onClose: () => void;
}

export default function VirtualTryOn({ onClose }: VirtualTryOnProps) {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{current: number, total: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TryOnResult[]>([]);
  
  const personInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  const handlePersonImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClothingImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setClothingImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPersonImage = () => {
    setPersonImage(null);
    setPersonImagePreview(null);
    if (personInputRef.current) {
      personInputRef.current.value = '';
    }
  };

  const clearClothingImage = () => {
    setClothingImage(null);
    setClothingImagePreview(null);
    if (clothingInputRef.current) {
      clothingInputRef.current.value = '';
    }
  };

  const generateTryOn = async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both person and clothing images');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: numberOfImages });

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (!prev) return null;
        const newCurrent = Math.min(prev.current + 1, prev.total);
        return { current: newCurrent, total: prev.total };
      });
    }, 10000); // Virtual try-on takes longer (~10s per image)

    try {
      const formData = new FormData();
      formData.append('personImage', personImage);
      formData.append('clothingImage', clothingImage);
      formData.append('additionalPrompt', additionalPrompt);
      formData.append('numberOfImages', numberOfImages.toString());

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate virtual try-on');
      }

      const data = await response.json();

      const newResults = data.images.map((img: any, index: number) => ({
        id: `tryon-${Date.now()}-${index}`,
        data: img.data,
        mimeType: img.mimeType,
        personImagePreview: personImagePreview!,
        clothingImagePreview: clothingImagePreview!,
        timestamp: Date.now(),
        additionalPrompt: additionalPrompt || undefined,
      }));

      setResults([...newResults, ...results]);
      setProgress({ current: data.success, total: numberOfImages });
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.message || 'An error occurred during virtual try-on');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(null), 2000);
    }
  };

  const downloadResult = (result: TryOnResult) => {
    const link = document.createElement('a');
    link.href = `data:${result.mimeType};base64,${result.data}`;
    link.download = `virtual-tryon-${result.id}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 flex items-start justify-center">
        <div className="neo-card bg-neo-white p-6 max-w-6xl w-full my-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-black uppercase">👔 Virtual Try-On</h2>
              <p className="font-bold mt-1">AI-Powered Clothing Visualization</p>
            </div>
            <button
              onClick={onClose}
              className="neo-btn bg-neo-pink px-6 py-2"
            >
              ✕ Close
            </button>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Person Image */}
            <div className="neo-card bg-neo-blue p-4">
              <h3 className="font-black uppercase mb-3">1️⃣ Upload Person Image</h3>
              <input
                ref={personInputRef}
                type="file"
                accept="image/*"
                onChange={handlePersonImageUpload}
                className="hidden"
                id="person-upload"
              />
              <label
                htmlFor="person-upload"
                className="neo-btn bg-neo-green cursor-pointer inline-block w-full text-center mb-3"
              >
                📸 Choose Person Photo
              </label>
              {personImagePreview && (
                <div className="relative">
                  <img
                    src={personImagePreview}
                    alt="Person"
                    className="neo-border w-full h-64 object-contain bg-white"
                  />
                  <button
                    onClick={clearPersonImage}
                    className="absolute -top-2 -right-2 bg-neo-pink neo-border w-8 h-8 flex items-center justify-center font-black"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs font-bold mt-2">
                💡 Best: Full body or upper body shot, clear lighting, neutral background
              </p>
            </div>

            {/* Clothing Image */}
            <div className="neo-card bg-neo-purple p-4">
              <h3 className="font-black uppercase mb-3">2️⃣ Upload Clothing Image</h3>
              <input
                ref={clothingInputRef}
                type="file"
                accept="image/*"
                onChange={handleClothingImageUpload}
                className="hidden"
                id="clothing-upload"
              />
              <label
                htmlFor="clothing-upload"
                className="neo-btn bg-neo-orange cursor-pointer inline-block w-full text-center mb-3"
              >
                👕 Choose Clothing Item
              </label>
              {clothingImagePreview && (
                <div className="relative">
                  <img
                    src={clothingImagePreview}
                    alt="Clothing"
                    className="neo-border w-full h-64 object-contain bg-white"
                  />
                  <button
                    onClick={clearClothingImage}
                    className="absolute -top-2 -right-2 bg-neo-pink neo-border w-8 h-8 flex items-center justify-center font-black"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className="text-xs font-bold mt-2">
                💡 Best: Clear product shot, white background, high resolution
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="neo-card bg-neo-yellow p-4 mb-6">
            <h3 className="font-black uppercase mb-3">3️⃣ Customize (Optional)</h3>
            
            <div className="mb-4">
              <label className="block font-bold mb-2 uppercase text-sm">
                Additional Instructions
              </label>
              <textarea
                className="neo-textarea w-full"
                rows={2}
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="E.g., full body shot, outdoor setting, professional lighting..."
                maxLength={200}
              />
              <p className="text-xs mt-1 font-bold">{additionalPrompt.length}/200 characters</p>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2 uppercase text-sm">
                Number of Variations
              </label>
              <select
                className="neo-select w-full"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(parseInt(e.target.value))}
              >
                <option value={1}>1 (Fastest)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <button
              onClick={generateTryOn}
              disabled={loading || !personImage || !clothingImage}
              className="neo-btn w-full bg-neo-green"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
                  {progress ? `Generating ${progress.current + 1}/${progress.total}...` : 'Processing...'}
                </span>
              ) : (
                '✨ Generate Virtual Try-On'
              )}
            </button>

            {progress && !loading && (
              <div className="mt-4 neo-border bg-neo-green p-3">
                <p className="font-bold">✓ Generated {progress.current} of {progress.total} images</p>
              </div>
            )}

            {error && (
              <div className="mt-4 neo-border bg-neo-pink p-3">
                <p className="font-bold">❌ Error: {error}</p>
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="neo-card bg-neo-orange p-4">
              <h3 className="font-black uppercase mb-4">🎨 Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result) => (
                  <div key={result.id} className="neo-card bg-neo-white p-3">
                    <img
                      src={`data:${result.mimeType};base64,${result.data}`}
                      alt="Try-on result"
                      className="w-full h-auto mb-3"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <img
                        src={result.personImagePreview}
                        alt="Person"
                        className="w-full h-20 object-cover neo-border"
                      />
                      <img
                        src={result.clothingImagePreview}
                        alt="Clothing"
                        className="w-full h-20 object-cover neo-border"
                      />
                    </div>
                    <button
                      onClick={() => downloadResult(result)}
                      className="neo-btn bg-neo-green w-full text-sm"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="neo-card bg-neo-blue p-4 mt-6">
            <h3 className="font-black uppercase mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm font-bold">
              <li>✅ Use high-quality, well-lit photos for best results</li>
              <li>✅ Person should be facing forward or at slight angle</li>
              <li>✅ Clothing should be clearly visible (flat lay or on hanger)</li>
              <li>✅ Avoid blurry or heavily filtered images</li>
              <li>✅ Generation takes ~10-15 seconds per image</li>
              <li>✅ Try multiple variations for different poses/angles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
