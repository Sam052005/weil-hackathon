import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'AutonoMarket - Autonomous E-Commerce',
  description: 'Agentic e-commerce managed by Cerebrum Human-in-the-loop Governance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  )
}
