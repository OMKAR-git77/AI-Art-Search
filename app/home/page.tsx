"use client"

import { useState, useRef, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { SearchInterface } from "@/components/search-interface"
import { SearchResults } from "@/components/search-results"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Layers, Palette, Eye } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"


export interface SearchResult {
  imageUrl: string
  tags?: string[]
  matchReason?: string
  similarity: number
  score?: number
  id?: number
  filename?: string
  filepath?: string
  message?: string
}

// 🧠 Simple in-memory cache for search results
const searchCache = new Map<string, SearchResult[]>()

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchImage, setSearchImage] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    style: true,
    texture: true,
    color: true,
    emotion: true,
  })
  const [weights, setWeights] = useState({
    style: 25,
    texture: 25,
    color: 25,
    emotion: 25,
  })
  const [lastFile, setLastFile] = useState<File | null>(null)

  // 🕓 Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])


  // 🔁 debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth-token") : null

  // 🧠 Run Search (with caching)
  const runSearch = async (file?: File) => {
    if (!token || !lastFile) return

    const activeFilters = Object.keys(filters).filter(
      (key) => filters[key as keyof typeof filters]
    )
    if (activeFilters.length === 0) return

    const cacheKey = JSON.stringify({
      file: lastFile.name,
      weights,
      filters,
    })

    if (searchCache.has(cacheKey)) {
      console.log("⚡ Using cached result for", cacheKey)
      setSearchResults(searchCache.get(cacheKey) || [])
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file || lastFile)
      formData.append("style_weight", String(weights.style))
      formData.append("texture_weight", String(weights.texture))
      formData.append("color_weight", String(weights.color))
      formData.append("emotion_weight", String(weights.emotion))

      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Search failed (HTTP ${response.status})`)
      }

      const data = await response.json()
      const results = Array.isArray(data.results) ? data.results : [data.results]

      if (!results || results.length === 0) {
        setError("No artworks found for the given image.")
      } else {
        setSearchResults(results)
        setSuccessMessage(`✅ Found ${results.length} similar artworks!`)
        searchCache.set(cacheKey, results)
      }

      // reset filters & weights
      setFilters({ style: true, texture: true, color: true, emotion: true })
      setWeights({ style: 25, texture: 25, color: 25, emotion: 25 })

    } catch (err: any) {
      console.error("Search error:", err)
      setError(err.message || "Unexpected error occurred during search.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
      }
  

  const triggerSearch = () => {
    return // disable auto search
  }

  // 🖼 Handle upload (auto-search)
  const handleSearch = async (file: File) => {
    setLastFile(file)
    setSearchImage(URL.createObjectURL(file))
    setSearchResults([])
  }

  // 🎚 Update slider (NO auto-search)
  const updateWeight = (key: string, newVal: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: newVal,
    }))
  }



  // 🎨 Icons for sliders
  const icons: Record<string, JSX.Element> = {
    style: <Sparkles className="h-4 w-4 text-primary" />,
    texture: <Layers className="h-4 w-4 text-green-600" />,
    color: <Palette className="h-4 w-4 text-yellow-600" />,
    emotion: <Eye className="h-4 w-4 text-pink-600" />,
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-2 sm:px-4 py-6 sm:py-8 relative">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">🎨 AI Art Search</h1>
              <p className="text-gray-700 dark:text-gray-300">
                Upload an image, adjust feature weights, and explore visually similar artworks
              </p>
            </div>

            <SearchInterface onSearch={handleSearch} loading={loading} />

            {/* Feedback Messages */}
            {error && (
              <div className="mt-4 p-4 border border-red-500/40 bg-red-100/40 text-red-700 rounded-md text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            {successMessage && (
              <div
                className="mt-6 px-5 py-4 rounded-lg shadow-md border border-green-500/60
                          bg-gradient-to-r from-green-400/20 via-green-300/25 to-green-400/20
                          text-green-800 dark:text-green-100 text-base font-medium
                          flex items-center justify-center gap-2 animate-fade-in"
                style={{
                  backdropFilter: "blur(6px)",
                }}
              >
                <span className="text-xl">✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Feature Weights */}
            {lastFile && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    🎛️ Feature Weights
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Each feature weight can be set independently (0–100%)
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-sm cursor-help">
                              {icons[key]}
                              <label className="capitalize text-gray-900 dark:text-gray-100">
                                {key}
                              </label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {key === "style" && "Overall artistic movement (e.g., Impressionism, Cubism)."}
                            {key === "texture" && "Surface detail or brushstroke density."}
                            {key === "color" && "Dominant hue and tonal composition."}
                            {key === "emotion" && "Mood or emotion expressed visually."}
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {value}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => updateWeight(key, parseInt(e.target.value, 10))}
                        className="w-full accent-primary"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => runSearch()}
                  disabled={loading}
                  className="w-full mt-2"
                >
                  {loading ? "Searching..." : "🔍 Search"}
                </Button>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-6">
                {searchImage && (
                  <div className="lg:w-1/4 flex flex-col items-center justify-center mt-8">
                    <img
                      src={searchImage}
                      alt="Query"
                      className="w-50 h-50 object-cover rounded-md shadow-md"
                    />
                    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 font-medium">
                      Uploaded Image
                    </p>
                  </div>
                )}
                <div className="lg:w-3/4">
                  <SearchResults
                    results={searchResults}
                    searchImage={searchImage}
                    filters={filters}
                    selectedColor={null}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Loader Overlay */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
              <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-white rounded-full"></div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
