"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileImage, X, CheckCircle, AlertCircle } from "lucide-react"

interface UploadFile {
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  id: string
}

export function BulkUploadInterface() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
      progress: 0,
      id: Math.random().toString(36).substr(2, 9),
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: true,
  })

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const clearAllFiles = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview))
    setFiles([])
    setUploadComplete(false)
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadComplete(false)

    try {
      const formData = new FormData()
      files.forEach((fileItem) => {
        formData.append("files", fileItem.file)
      })

      // Update all files to uploading status
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "uploading" as const }))
      )

      // Get token from localStorage
      const token = localStorage.getItem("auth-token")

      const response = await fetch("http://127.0.0.1:8000/upload/bulk", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      })

      if (response.ok) {
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "success" as const,
            progress: 100,
          }))
        )
        setUploadComplete(true)
      } else {
        setFiles((prev) =>
          prev.map((f) => ({ ...f, status: "error" as const }))
        )
      }
    } catch (error) {
      console.error("Upload error:", error)
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "error" as const }))
      )
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        )
      default:
        return <FileImage className="h-4 w-4 text-muted-foreground" />
    }
  }

  const successCount = files.filter((f) => f.status === "success").length
  const errorCount = files.filter((f) => f.status === "error").length

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-8 glass-effect border-border/50">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
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
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop your images here" : "Upload multiple images"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to select multiple files • PNG, JPG, GIF up
                to 10MB each
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-6 glass-effect border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Selected Files ({files.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="relative group border border-border/50 rounded-lg p-3 glass-effect"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={fileItem.preview || "/placeholder.svg"}
                      alt={fileItem.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {fileItem.status === "uploading" && (
                        <Progress value={fileItem.progress} className="mt-1 h-1" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(fileItem.status)}
                      {!uploading && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileItem.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={uploadFiles}
                disabled={files.length === 0 || uploading}
                size="lg"
                className="px-8"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Uploading {files.length} files...
                  </>
                ) : (
                  `Upload ${files.length} files`
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upload Results */}
      {uploadComplete && (
        <Alert className="glass-effect border-green-500/50 bg-green-500/5">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Upload completed successfully!</p>
              <p className="text-sm">
                {successCount} files uploaded successfully
                {errorCount > 0 && `, ${errorCount} files failed`}
              </p>
              <p className="text-sm text-muted-foreground">
                Your images are now being processed and will be available for search
                shortly.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
