import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Art Search - Discover Similar Styles",
  description: "AI-Powered Art and Design Style Search Application",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="gradient-bg min-h-screen">{children}</div>
          </Suspense>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}
