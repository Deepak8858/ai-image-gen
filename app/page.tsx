'use client';

import { useState, useRef } from 'react';

interface GeneratedImage {
  id: string;
  data: string;
  mimeType: string;
  prompt: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <main className="min-h-screen bg-neo-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="neo-card bg-neo-yellow p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">
            AI IMAGE GEN
          </h1>
          <p className="text-lg font-bold">Powered by Gemini 2.5 Flash Image (Nano Banana)</p>
        </div>
      </header>

      {/* Generation Form */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="neo-card p-6 bg-neo-blue mb-6">
          <h2 className="text-2xl font-black uppercase mb-4">Create Image</h2>

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
                Generating...
              </span>
            ) : (
              'Generate Images'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 neo-border bg-neo-pink p-4">
              <p className="font-bold">⚠️ Error: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="neo-card bg-neo-orange p-6 mb-6">
            <h2 className="text-2xl font-black uppercase">Generated Images</h2>
          </div>

          <div className="image-grid">
            {generatedImages.map((image) => (
              <div key={image.id} className="neo-card p-4 bg-neo-white">
                <img
                  src={`data:${image.mimeType};base64,${image.data}`}
                  alt={image.prompt}
                  className="w-full h-auto mb-4"
                />
                <p className="text-sm font-bold mb-2 line-clamp-2">{image.prompt}</p>
                <button
                  onClick={() => downloadImage(image)}
                  className="neo-btn bg-neo-purple w-full text-sm"
                >
                  Download
                </button>
              </div>
            ))}
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
    </main>
  );
}
