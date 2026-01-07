"use client"

import { useState } from "react"
import { SearchInterface } from "./search-interface"
import { SearchResults } from "./search-results"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SearchImages() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchImage, setSearchImage] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    style: false,
    texture: false,
    colorPalette: false,
    emotion: false,
  })
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const handleSearch = async (file) => {
    try {
      setLoading(true)
      setSearchImage(URL.createObjectURL(file))

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
      const token = localStorage.getItem("auth-token")
      const formData = new FormData()
      formData.append("file", file)

      // Optional filters (sent to backend)
      formData.append("style", String(filters.style))
      formData.append("texture", String(filters.texture))
      formData.append("colorPalette", String(filters.colorPalette))
      formData.append("emotion", String(filters.emotion))
      if (selectedColor) formData.append("selectedColor", selectedColor)

      const response = await fetch(`${apiBaseUrl}/search`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Search results:", data)
      setResults(data.results || [])
    } catch (error) {
      console.error("Error during search:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🎨 Image Similarity Search</h1>

      {/* Image Upload & Search Section */}
      <SearchInterface onSearch={handleSearch} loading={loading} />

      {/* Results Display Section */}
      <SearchResults
        results={results}
        searchImage={searchImage}
        filters={filters}
        selectedColor={selectedColor}
        loading={loading}
      />
    </div>
  )
}
