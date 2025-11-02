import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const numberOfImages = parseInt(formData.get('numberOfImages') as string) || 1;
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
    
    // Determine MIME type
    const mimeType = referenceImage.type || 'image/png';

    // Use Gemini 2.5 Flash Image (Nano Banana)
    const modelName = 'gemini-2.5-flash-image';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    // Generate images sequentially to avoid rate limits
    const images = [];
    const errors = [];

    for (let i = 0; i < numberOfImages; i++) {
      try {
        const requestBody = {
          contents: [{
            parts: [
              { text: prompt.trim() },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          }]
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
          console.error(`Gemini API Error (image ${i + 1}/${numberOfImages}):`, errorData);
          errors.push({
            index: i + 1,
            error: `Failed: ${response.statusText}`,
            details: errorData
          });
          continue; // Continue generating other images
        }

        const data = await response.json();
        
        // Extract image data from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            images.push({
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png',
            });
          }
        }

        // Add small delay between requests to avoid rate limiting
        if (i < numberOfImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err: any) {
        console.error(`Error generating image ${i + 1}/${numberOfImages}:`, err);
        errors.push({
          index: i + 1,
          error: err.message || 'Unknown error'
        });
      }
    }

    // Return results with partial success handling
    if (images.length === 0) {
      return NextResponse.json(
        { 
          error: 'All image generations failed', 
          details: errors 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      images,
      success: images.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Error generating images with reference:', error);
    return NextResponse.json(
      { error: 'Failed to generate images', details: error.message },
      { status: 500 }
    );
  }
}
