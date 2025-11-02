# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI Image Generator powered by **Google Gemini Imagen 4.0 Ultra API** built with Next.js 15 and featuring a **neobrutalism UI design**. The application supports both text-to-image and image-to-image generation with multiple models, aspect ratios, and batch generation capabilities.

## Essential Setup

### Environment Configuration
1. Copy `.env.local.example` to `.env.local`
2. Add your Google Gemini API key (get from https://ai.google.dev/):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   **Security**: Never commit `.env.local` - the API key is accessed server-side only

### Common Commands

**Development**
```bash
npm install          # Install dependencies
npm run dev         # Start dev server at http://localhost:3000
npm run build       # Production build
npm start           # Start production server
npm run lint        # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Custom Neobrutalism CSS
- **API**: Google Gemini Imagen 4.0 API (`@google/generative-ai` v0.21.0)

### Project Structure
```
app/
├── api/
│   ├── generate/               # Text-to-image API route
│   │   └── route.ts            # POST handler for basic generation
│   └── generate-with-image/    # Image-to-image API route
│       └── route.ts            # POST handler with reference image support
├── globals.css                 # Neobrutalism design system
├── layout.tsx                  # Root layout with metadata
└── page.tsx                    # Main UI (client component)
```

### API Architecture

**Two Generation Endpoints:**

1. **`/api/generate`** (Text-to-Image)
   - Accepts: `{ prompt, numberOfImages, aspectRatio, model }`
   - Returns: `{ images: [{ data: base64, mimeType }] }`
   - Makes POST request to Gemini API `/v1beta/models/{model}:predict`

2. **`/api/generate-with-image`** (Image-to-Image)
   - Accepts: FormData with `prompt`, `referenceImage` (File), config
   - Converts uploaded image to base64 before sending to Gemini
   - Same Gemini API endpoint but includes `image.bytesBase64Encoded` in request

**Gemini API Integration:**
- Uses REST API (not SDK) with direct fetch calls
- Authentication via `x-goog-api-key` header
- Request format: `{ instances: [{ prompt, image? }], parameters: { sampleCount, aspectRatio, personGeneration } }`
- Response format: `{ predictions: [{ bytesBase64Encoded, mimeType }] }`

### UI/State Management

**Client-Side Component** (`app/page.tsx`):
- Single page app with React hooks (useState, useRef)
- No external state management - local state only
- Key state: `prompt`, `generatedImages[]`, `referenceImage`, `loading`, `error`
- Image handling: FileReader for preview, FormData for upload, base64 for display/download

### Design System (Neobrutalism)

Custom CSS in `app/globals.css` defines the visual language:

**Core Classes:**
- `.neo-border` - 4px solid black borders
- `.neo-shadow`, `.neo-shadow-sm`, `.neo-shadow-lg` - Offset shadows
- `.neo-card` - Border + shadow combo
- `.neo-btn` - Interactive buttons with translate animations
- `.neo-input`, `.neo-textarea`, `.neo-select` - Form elements
- `.bg-neo-{color}` - Yellow, pink, blue, green, purple, orange backgrounds

**Design Principles:**
- Thick borders (4px)
- Offset drop shadows (no blur)
- Bold, uppercase typography
- Interactive states with transform (buttons "push down")
- Bright, solid colors

### Key Features

**Models:**
- `imagen-4.0-ultra-generate-001` - 2K resolution (default)
- `imagen-4.0-generate-001` - 1K resolution
- `imagen-4.0-fast-generate-001` - Faster generation
- `imagen-3.0-generate-002` - Legacy model

**Aspect Ratios:** 1:1, 3:4, 4:3, 9:16, 16:9

**Capabilities:**
- Batch generation (1-4 images)
- Reference image upload (guides generation)
- Client-side download (base64 → blob URL)
- Character limit: 480 chars for prompts

## Development Guidelines

### When Modifying API Routes
- API key validation is critical - always check `process.env.GEMINI_API_KEY`
- Error handling: Log full error details, return sanitized user-facing messages
- Gemini API errors come as text, not JSON - use `response.text()` for debugging
- Both routes follow same pattern: validate input → call Gemini → transform response

### When Modifying UI
- Use existing neobrutalism classes - don't add inline styles
- Maintain 4px border + 8px shadow consistency
- All buttons should have hover/active transform states
- Form elements must have `.neo-` prefixed classes
- Colors: Use CSS variables (`var(--neo-yellow)`) or Tailwind classes (`bg-neo-blue`)

### TypeScript Notes
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Type interfaces defined inline (see `GeneratedImage` in `page.tsx`)
- Target: ES2020

### Next.js Specifics
- App Router (not Pages Router)
- Client components marked with `'use client'`
- API routes use Next.js 15 conventions (`NextRequest`, `NextResponse`)
- Image optimization config allows all remote patterns (`hostname: '**'`)

## Common Tasks

**Adding a new model:**
1. Add option to `<select>` in `app/page.tsx` (line ~191)
2. Model name format: `imagen-{version}-{variant}-generate-{revision}`

**Changing aspect ratio options:**
- Update `<select>` in `app/page.tsx` aspect ratio dropdown
- Must match Gemini API supported ratios

**Modifying neobrutalism styles:**
- Edit CSS variables in `:root` (globals.css lines 5-14)
- Add new utility classes following `.neo-` prefix convention
- Keep border/shadow/color consistency
