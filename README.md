# AI Image Generator 🎨

A modern AI image generation platform powered by **Google Gemini Imagen 4.0 Ultra API** with a stunning **neobrutalism UI design**.

## ✨ Features

- 🖼️ **High-Resolution Image Generation** - Up to 2K resolution with Imagen 4.0 Ultra
- 📸 **Image-to-Image Generation** - Upload reference images to guide generation
- 🎨 **Multiple Aspect Ratios** - Square, portrait, landscape, vertical, and wide formats
- ⚡ **Multiple Models** - Choose from Imagen 4.0 Ultra, Standard, Fast, or Imagen 3
- 🔢 **Batch Generation** - Generate up to 4 images simultaneously
- 💾 **Instant Download** - Download generated images with one click
- 🎭 **Neobrutalism Design** - Bold colors, thick borders, and retro aesthetic

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Text-to-Image Generation

1. Enter a descriptive prompt (up to 480 characters)
2. Select your preferred model, aspect ratio, and number of images
3. Click "Generate Images"
4. Download your generated images

### Image-to-Image Generation

1. Click "Upload Image" to add a reference image
2. Enter a prompt describing the modifications you want
3. Configure settings and click "Generate Images"
4. Your reference image will guide the generation process

## 🎨 Available Models

- **Imagen 4.0 Ultra** - Highest quality, 2K resolution
- **Imagen 4.0 Standard** - Good quality, 1K resolution
- **Imagen 4.0 Fast** - Faster generation, good quality
- **Imagen 3** - Previous generation model

## 📐 Aspect Ratios

- 1:1 (Square)
- 3:4 (Portrait)
- 4:3 (Landscape)
- 9:16 (Vertical)
- 16:9 (Wide)

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Neobrutalism CSS
- **AI:** Google Gemini Imagen 4.0 API
- **Deployment:** Vercel-ready

## 📁 Project Structure

```
ai-image-gen/
├── app/
│   ├── api/
│   │   ├── generate/          # Text-to-image API route
│   │   └── generate-with-image/  # Image-to-image API route
│   ├── globals.css            # Neobrutalism styling
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── public/
├── .env.local.example         # Environment template
├── package.json
└── README.md
```

## 🎨 Neobrutalism Design

The UI features:
- **Thick black borders** (4px)
- **Bold drop shadows** (offset shadows)
- **Vibrant colors** (yellow, pink, blue, green, purple, orange)
- **Uppercase typography**
- **Interactive button states**
- **Retro aesthetic**

## 🔒 API Key Security

- Never commit your `.env.local` file
- Keep your Gemini API key private
- Use environment variables for all sensitive data

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

- **Google Gemini** for the Imagen API
- **Neobrutalism** design trend for the aesthetic inspiration

---

Built with ❤️ using Next.js and Google Gemini
