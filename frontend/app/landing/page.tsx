import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Search, Upload, Palette } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ArtSearch AI</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="glass-effect bg-transparent">
              Log in
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
              AI-Powered Art and <span className="text-primary">Design Style</span> Search
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover similar artworks and designs using advanced AI technology. Search by style, texture, color
              palette, and emotional expression.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
            <Card className="p-6 glass-effect border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <Search className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Smart Search</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any image and find visually similar artworks using AI
                </p>
              </div>
            </Card>

            <Card className="p-6 glass-effect border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <Palette className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Style Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Filter by style, texture, color palette, and emotional tone
                </p>
              </div>
            </Card>

            <Card className="p-6 glass-effect border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <Upload className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Bulk Upload</h3>
                <p className="text-sm text-muted-foreground">Upload multiple images at once for batch processing</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 glass-effect">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>AI-Powered Art and Design Style Search Application</p>
        </div>
      </footer>
    </div>
  )
}
