import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZEN AND AI - Decentralized AI Agent Trading Platform',
  description: 'A decentralized AI agent platform for autonomous trading in Nasdaq-100 markets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
