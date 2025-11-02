import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, numberOfImages, aspectRatio, model } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Use Imagen 4.0 Ultra for highest resolution (2K)
    const modelName = model || 'imagen-4.0-ultra-generate-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict`;

    const requestBody = {
      instances: [{ prompt: prompt.trim() }],
      parameters: {
        sampleCount: numberOfImages || 1,
        aspectRatio: aspectRatio || '1:1',
        personGeneration: 'allow_adult',
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        { error: `API request failed: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract image data from predictions
    const images = data.predictions?.map((pred: any) => ({
      data: pred.bytesBase64Encoded || pred.image?.bytesBase64Encoded,
      mimeType: pred.mimeType || 'image/png',
    })) || [];

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images', details: error.message },
      { status: 500 }
    );
  }
}
