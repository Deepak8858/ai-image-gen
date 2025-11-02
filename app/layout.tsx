import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Image Gen Pro - Professional AI Image Generator',
  description: 'Advanced AI image generation platform powered by Google Gemini 2.5 Flash. Features batch generation, style presets, negative prompts, smart history, and more professional tools.',
  keywords: ['AI image generator', 'Gemini', 'text to image', 'AI art', 'image generation', 'Gemini 2.5 Flash'],
  authors: [{ name: 'AI Image Gen Pro' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffd700',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://bm3ggpiakhmxbwfoaqsea55b.agents.do-ai.run/static/chatbot/widget.js"
          data-agent-id="d0a2866a-b632-11f0-b074-4e013e2ddde4"
          data-chatbot-id="_zHtyy4w95vQpnACfN6qDUSsqUY8p-iu"
          data-name="youtube-agent-10312025 Chatbot"
          data-primary-color="#031B4E"
          data-secondary-color="#E5E8ED"
          data-button-background-color="#0061EB"
          data-starting-message="Hello! Aditya How can I help you today?"
          data-logo="/static/chatbot/icons/default-agent.svg"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
