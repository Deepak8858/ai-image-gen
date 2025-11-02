# AI Image Generator 🎨

A modern AI image generation platform powered by **Gemini 2.5 Flash Image (Nano Banana)** with a stunning **neobrutalism UI design**.

## ✨ Features

- 🖼️ **High-Quality Image Generation** - Powered by Google's latest Gemini 2.5 Flash Image model
- 📸 **Image-to-Image Generation** - Upload reference images to guide generation and editing
- 🎨 **Smart Aspect Ratio Detection** - Automatically handles optimal sizing
- 🔢 **Batch Generation** - Generate up to 4 images simultaneously
- 💬 **Conversational AI** - Describe scenes naturally, not just keywords
- 💾 **Instant Download** - Download generated images with one click
- 🎭 **Neobrutalism Design** - Bold colors, thick borders, and retro aesthetic
- 🔤 **High-Fidelity Text Rendering** - Accurately generate images with legible text

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

1. Enter a descriptive prompt (up to 480 characters) - **describe the scene naturally**
2. Select the number of images to generate (1-4)
3. Click "Generate Images"
4. Download your generated images

### Image-to-Image Generation (Editing)

1. Click "Upload Image" to add a reference image
2. Enter a prompt describing the modifications you want
3. Select the number of variations to generate
4. Click "Generate Images"
5. Your reference image will guide the generation process

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
