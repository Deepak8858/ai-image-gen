import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Generate stunning images with Google Gemini Imagen API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
