# YouTube Data API v3 Integration Guide

This guide will help you integrate YouTube Data API v3 into AI Image Gen Pro for enhanced features.

## Use Cases

The YouTube Data API can be used for:

1. **Thumbnail Generation** - Create custom thumbnails for YouTube videos
2. **Content Analysis** - Analyze video metadata to generate related imagery
3. **Channel Branding** - Generate channel art and profile pictures
4. **Video Preview Images** - Create preview images based on video descriptions
5. **Trend Analysis** - Generate images based on trending video topics

## Setup Steps

### 1. Enable YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for "YouTube Data API v3"
5. Click **Enable**

### 2. Create API Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Optional) Restrict the API key:
   - Click **Edit API key**
   - Under **API restrictions**, select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save

### 3. Add to Environment Variables

Add to your `.env.local`:

```env
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Install Dependencies (if needed)

```bash
npm install axios
```

## Example API Routes

### Get Video Details

```typescript
// app/api/youtube/video/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('videoId');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Search Videos

```typescript
// app/api/youtube/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${apiKey}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Feature Ideas

### 1. Thumbnail Generator from Video

Create a new page `/app/youtube-thumbnail` that:
- Takes YouTube video URL
- Fetches video metadata
- Generates custom thumbnail based on title/description
- Allows download in YouTube-optimized dimensions (1280x720)

### 2. Channel Art Generator

- Input: YouTube channel URL
- Fetch channel info
- Generate banner/profile art
- Export in correct dimensions (2560x1440 for banner)

### 3. Trending Content Visualizer

- Fetch trending videos by category
- Analyze common themes
- Generate imagery representing trends
- Help content creators stay relevant

### 4. Video-to-Prompt Converter

- Input: YouTube video URL
- Extract title, description, tags
- Convert to AI image generation prompt
- Generate related imagery

## API Quota Limits

YouTube Data API has quota limits:
- **Default quota**: 10,000 units/day
- **Search**: 100 units
- **Video details**: 1 unit
- **Channel info**: 1 unit

**Best Practices:**
- Cache responses when possible
- Batch requests
- Implement rate limiting
- Show quota usage to admins

## Security

✅ **DO:**
- Store API key in environment variables
- Use server-side API routes (not client-side)
- Restrict API key to YouTube Data API v3
- Implement rate limiting

❌ **DON'T:**
- Expose API key in client-side code
- Commit API key to version control
- Share API key publicly

## Example Integration

Here's how you could add a "Generate Thumbnail" feature:

```typescript
// app/components/YouTubeThumbnailGenerator.tsx
'use client';

import { useState } from 'react';

export default function YouTubeThumbnailGenerator() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const generateThumbnail = async () => {
    setLoading(true);
    
    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    
    // Fetch video details
    const response = await fetch(`/api/youtube/video?videoId=${videoId}`);
    const data = await response.json();
    
    // Use video title/description to generate prompt
    const prompt = `YouTube thumbnail for: ${data.items[0].snippet.title}. 
                   Eye-catching, bold text, vibrant colors, professional quality`;
    
    // Generate image using existing API
    // ... rest of generation logic
    
    setLoading(false);
  };
  
  return (
    <div className="md-card">
      <h2>YouTube Thumbnail Generator</h2>
      <input 
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Paste YouTube video URL"
      />
      <button onClick={generateThumbnail} disabled={loading}>
        Generate Thumbnail
      </button>
    </div>
  );
}
```

## Next Steps

1. ✅ Enable YouTube Data API v3 in Google Cloud Console
2. ✅ Add API key to `.env.local`
3. ✅ Create API routes for YouTube integration
4. ✅ Build YouTube-specific features
5. ✅ Test with real YouTube videos
6. ✅ Deploy and monitor quota usage

## Resources

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [API Reference](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Best Practices](https://developers.google.com/youtube/v3/guides/implementation/best_practices)

---

**Ready to enhance AI Image Gen Pro with YouTube integration!** 🎥🎨
