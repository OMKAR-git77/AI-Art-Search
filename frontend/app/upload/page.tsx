"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { BulkUploadInterface } from "@/components/bulk-upload-interface"
import { Navigation } from "@/components/navigation"

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Bulk Upload</h1>
              <p className="text-muted-foreground">Upload multiple images at once for batch processing</p>
            </div>

            {/* Upload Interface */}
            <BulkUploadInterface />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
