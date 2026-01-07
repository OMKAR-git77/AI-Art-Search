"use client"

import { ArtworkDetailsDialog } from "@/components/artwork-details-dialog"
import React, { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface SearchResult {
  id?: number
  filename?: string
  filepath?: string
  score?: number
  message?: string
  matchReason?: string
  imageUrl?: string
  similarity?: number
  metadata_json?: Record<string, any>
}

interface SearchResultsProps {
  results: SearchResult | SearchResult[]
  searchImage: string | null
  filters: {
    style: boolean
    texture: boolean
    color: boolean
    emotion: boolean
  }
  selectedColor: string | null
  loading: boolean
  weights?: {
    style: number
    texture: number
    color: number
    emotion: number
  }
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  filters,
  selectedColor,
  loading,
}) => {
    // 🌀 Handle Loading State
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">
            Searching for similar artworks...
          </p>
        </div>
      )
    }

    // 🚫 Handle Empty State
    const isEmpty =
      !results ||
      (Array.isArray(results) && results.length === 0) ||
      (!Array.isArray(results) && Object.keys(results).length === 0)

    if (isEmpty) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            No results found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting feature weights or uploading a different image.
          </p>
        </div>
      )
    }
  const normalizedResults = Array.isArray(results) ? results : [results]
  const carouselRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<SearchResult | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -400, behavior: "smooth" })
  }

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 400, behavior: "smooth" })
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Search Results
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Showing the best {normalizedResults.length} matches based on your selected features
          {selectedColor ? ` and color ${selectedColor}` : ""}.
        </p>
      </div>

      {/* Carousel container with arrows */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll left through search results"
          title="Scroll left"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition z-20"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-gray-200" aria-hidden="true" />
        </button>

        {/* Scrollable Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400/50 scroll-smooth"
        >
          {normalizedResults.map((r, i) => {
            const finalScore = r.score
              ? r.score
              : r.similarity
              ? r.similarity * 100
              : 0

            const cleanFileName = r.filename
              ? r.filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")
              : "Untitled"

            return (
              <Card
                key={i}
                className="min-w-[300px] sm:min-w-[360px] snap-start shrink-0 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900"
              >
                <CardContent className="p-4">
                  {/* Click-to-enlarge via Dialog */}
                  <Dialog open={openIndex === i} onOpenChange={(open) => setOpenIndex(open ? i : null)}>
                    <DialogTrigger asChild>
                      <img
                        src={`${r.filepath || r.imageUrl || ""}?w=400`}
                        alt={cleanFileName}
                        loading="lazy"
                        width={400}
                        height={320}
                        className="rounded-lg w-full h-[320px] sm:h-[380px] object-cover mb-4 shadow-sm cursor-zoom-in"
                        onClick={() => setOpenIndex(i)}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
                      <img
                        src={`${r.filepath || r.imageUrl || ""}?w=1200`}
                        alt={cleanFileName}
                        className="w-full h-auto rounded-lg object-contain"
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Overall Similarity + File Info */}
                  <div className="mt-2 text-center">
                    <div
                      className={`text-lg font-extrabold ${scoreColor(finalScore)} text-gray-900 dark:text-gray-100 tracking-wide`}
                    >
                      Similarity: {finalScore.toFixed(2)}%
                    </div>
                    {r.message && (
                      <p className="mt-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
                        {r.message
                          .replace(/^Weaviate match\s*[-–]\s*/i, "")
                          .replace(/^([a-z])/, (m) => m.toUpperCase())}
                      </p>
                    )}

                    {/*{r.filename && (
                      <div className="mt-1 text-xs text-gray-800 dark:text-gray-200 truncate">
                        {cleanFileName}
                      </div>
                    )}*/}

                    {/* Artist Name (if available) */}
                    {r.metadata_json?.artist && (
                      <div className="mt-1 text-xs text-gray-700 dark:text-gray-300 italic">
                        {r.metadata_json.artist}
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedArtwork(r)
                          setDetailsOpen(true)
                        }}
                        className="text-sm text-blue-600 hover:underline focus:outline-none"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          aria-label="Scroll right through search results"
          title="Scroll right"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition z-20"
        >
          <ChevronRight className="h-6 w-6 text-gray-800 dark:text-gray-200" aria-hidden="true" />
        </button>
      </div>

      {/* View Details Modal */}
      <ArtworkDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        artwork={
          selectedArtwork
            ? { ...selectedArtwork, imageUrl: selectedArtwork.imageUrl || "" }
            : null
        }
      />
    </div>
  )
}
