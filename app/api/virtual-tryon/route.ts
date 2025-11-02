import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const personImage = formData.get('personImage') as File;
    const clothingImage = formData.get('clothingImage') as File;
    const additionalPrompt = formData.get('additionalPrompt') as string || '';
    const numberOfImages = parseInt(formData.get('numberOfImages') as string) || 1;

    // Validation
    if (!personImage || !clothingImage) {
      return NextResponse.json(
        { error: 'Both person image and clothing image are required' },
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

    // Convert images to base64
    const personBuffer = await personImage.arrayBuffer();
    const clothingBuffer = await clothingImage.arrayBuffer();
    
    const personBase64 = Buffer.from(personBuffer).toString('base64');
    const clothingBase64 = Buffer.from(clothingBuffer).toString('base64');
    
    const personMimeType = personImage.type || 'image/png';
    const clothingMimeType = clothingImage.type || 'image/png';

    // Use Gemini 2.5 Flash Image (Nano Banana)
    const modelName = 'gemini-2.5-flash-image';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    // Generate images sequentially
    const images = [];
    const errors = [];

    for (let i = 0; i < numberOfImages; i++) {
      try {
        // Construct prompt for virtual try-on
        const tryonPrompt = `Create a highly realistic, photorealistic image showing the person from the first image wearing the clothing item from the second image. 

IMPORTANT REQUIREMENTS:
- Maintain the exact person's face, body type, pose, and physical features
- Seamlessly fit the clothing from the second image onto the person's body
- Ensure perfect lighting consistency and shadows
- Keep natural fabric draping and wrinkles
- Match the original photo's lighting, background, and atmosphere
- Preserve all facial details, skin tone, and hair
- Make the clothing fit naturally without distortion
- High detail, 8K quality, professional photography

${additionalPrompt ? `Additional details: ${additionalPrompt}` : ''}

Generate a single cohesive image that looks like a professional fashion photograph where the person is naturally wearing the clothing item.`;

        const requestBody = {
          contents: [{
            parts: [
              { text: tryonPrompt },
              {
                inlineData: {
                  mimeType: personMimeType,
                  data: personBase64
                }
              },
              {
                inlineData: {
                  mimeType: clothingMimeType,
                  data: clothingBase64
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
          console.error(`Gemini API Error (try-on ${i + 1}/${numberOfImages}):`, errorData);
          errors.push({
            index: i + 1,
            error: `Failed: ${response.statusText}`,
            details: errorData
          });
          continue;
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

        // Add delay between requests
        if (i < numberOfImages - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err: any) {
        console.error(`Error generating try-on ${i + 1}/${numberOfImages}:`, err);
        errors.push({
          index: i + 1,
          error: err.message || 'Unknown error'
        });
      }
    }

    // Return results
    if (images.length === 0) {
      return NextResponse.json(
        { 
          error: 'All virtual try-on generations failed', 
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
    console.error('Error in virtual try-on:', error);
    return NextResponse.json(
      { error: 'Failed to generate virtual try-on', details: error.message },
      { status: 500 }
    );
  }
}
