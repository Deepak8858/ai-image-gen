# AI Image Gen Pro 🎨

A **professional-grade AI image generation platform** powered by **Gemini 2.5 Flash Image (Nano Banana)** with an enhanced **neobrutalism UI design** and advanced creative tools.

## ✨ Professional Features

### Core Generation
- 🖼️ **High-Quality Image Generation** - Powered by Google's latest Gemini 2.5 Flash Image model
- 📸 **Image-to-Image Generation** - Upload reference images to guide generation and editing
- 🔢 **Batch Generation** - Generate up to 4 images simultaneously
- 💬 **Conversational AI** - Describe scenes naturally, not just keywords
- 🔤 **High-Fidelity Text Rendering** - Accurately generate images with legible text

### Advanced Controls
- 📏 **Aspect Ratio Selector** - 6 preset ratios (1:1, 16:9, 9:16, 4:3, 3:4, 21:9)
- 🎭 **Style Presets** - Realistic, Artistic, Anime, Digital Art, 3D Render, Minimalist
- ⛔ **Negative Prompts** - Specify what to avoid in generations
- 💡 **Prompt Templates** - Pre-built templates for common use cases

### Professional Tools
- 💾 **Persistent History** - Auto-save all generated images to localStorage
- 🔍 **Smart Search** - Filter images by prompt text
- 📋 **Advanced Sorting** - Sort by newest, oldest, or prompt
- 🖼️ **Image Lightbox** - Full-screen viewing with detailed metadata
- 📊 **Stats Dashboard** - Track usage statistics and preferences
- 🌙 **Dark Mode** - Eye-friendly dark theme with preserved neobrutalism styling
- 📥 **Bulk Download** - Download multiple images at once
- 🗑️ **Individual Delete** - Remove unwanted images from history

### UI/UX Enhancements
- ✨ **Smooth Animations** - Fade, scale, and slide transitions
- 🎨 **Neobrutalism Design** - Bold colors, thick borders, and retro aesthetic
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Progress** - Live generation progress tracking

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

### Quick Start

1. **Enter a prompt** - Describe your desired image in detail (up to 480 characters)
2. **Choose style preset** - Select from 6 professional style options
3. **Set aspect ratio** - Pick the perfect dimensions for your use case
4. **Add negative prompt** (optional) - Specify what to avoid
5. **Select batch size** - Generate 1-4 images simultaneously
6. **Click "Generate Images"** - Watch the magic happen!

### Using Prompt Templates

- Click any template button to auto-fill your prompt
- Customize the template text as needed
- Templates include landscapes, cityscapes, interiors, fantasy, abstract art, and product photography

### Image-to-Image Generation

1. Click "Upload Image" to add a reference image
2. Enter a prompt describing desired modifications
3. Select style preset and aspect ratio
4. Generate variations based on your reference

### Managing Your Gallery

- **Search**: Use the search bar to filter images by prompt
- **Sort**: Organize by newest, oldest, or alphabetically
- **View Details**: Click any image for full-screen lightbox with metadata
- **Download**: Single download or bulk download all filtered images
- **Delete**: Remove unwanted images individually
- **Stats**: Track your generation statistics and preferences

### Dark Mode

Toggle dark mode using the button in the header for comfortable viewing in low-light environments.

## 💡 Prompting Tips

- **Describe the scene, don't just list keywords** - Narrative descriptions work best
- Use natural language and full sentences
- Be specific about details, style, lighting, and composition
- For editing: Clearly describe what to change while keeping context
- All generated images include a SynthID watermark

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Neobrutalism CSS
- **AI:** Gemini 2.5 Flash Image (Nano Banana) API
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
