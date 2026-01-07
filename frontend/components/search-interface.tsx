"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card } from "@/components/ui/card"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchInterfaceProps {
  onSearch: (file: File) => void
  loading: boolean
}

export function SearchInterface({ onSearch, loading }: SearchInterfaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
        onSearch(file)
      }
    },
    [onSearch]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"] },
    multiple: false,
  })

  const clearSelection = () => {
    setSelectedFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  return (
    <Card className="p-8 glass-effect border-border/50">
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors group ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />

          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {isDragActive ? "Drop your image here" : "Upload an image to search"}
            </p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            Drag and drop or click to upload
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <ImageIcon className="h-5 w-5" />
                Selected Image
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative max-w-md mx-auto">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto rounded-lg border border-border/50"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
