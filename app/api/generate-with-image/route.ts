import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const numberOfImages = parseInt(formData.get('numberOfImages') as string) || 1;
    const aspectRatio = formData.get('aspectRatio') as string || '1:1';
    const model = formData.get('model') as string || 'imagen-4.0-ultra-generate-001';
    const referenceImage = formData.get('referenceImage') as File;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!referenceImage) {
      return NextResponse.json(
        { error: 'Reference image is required' },
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

    // Convert image to base64
    const arrayBuffer = await referenceImage.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;

    const requestBody = {
      instances: [
        {
          prompt: prompt.trim(),
          image: {
            bytesBase64Encoded: base64Image,
          },
        },
      ],
      parameters: {
        sampleCount: numberOfImages,
        aspectRatio: aspectRatio,
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
    console.error('Error generating images with reference:', error);
    return NextResponse.json(
      { error: 'Failed to generate images', details: error.message },
      { status: 500 }
    );
  }
}
