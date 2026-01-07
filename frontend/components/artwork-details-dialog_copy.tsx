"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ArtworkDetailsDialogProps {
  open: boolean
  onClose: () => void
  artwork: {
    imageUrl?: string
    filename?: string
    filepath?: string
    similarity?: number
    tags?: string[]
    matchReason?: string
  } | null
}

export function ArtworkDetailsDialog({ open, onClose, artwork }: ArtworkDetailsDialogProps) {
  if (!artwork) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center sm:text-left">
            Artwork Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-6 items-center">
          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src={artwork.imageUrl || artwork.filepath || "/placeholder.svg"}
              alt={artwork.filename || "Artwork"}
              className="w-full max-w-sm rounded-lg shadow-md object-contain border border-border/50"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">Filename:</h3>
              <p className="text-gray-600 dark:text-gray-400">{artwork.filename || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300">File Path:</h3>
              <p className="text-blue-600 dark:text-blue-400 break-all">
                {artwork.filepath || "N/A"}
              </p>
            </div>

            {artwork.similarity !== undefined && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Similarity:</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {artwork.similarity.toFixed(2)}%
                </p>
              </div>
            )}

            {artwork.matchReason && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Match Reason:</h3>
                <p className="text-gray-600 dark:text-gray-400">{artwork.matchReason}</p>
              </div>
            )}

            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Tags:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {artwork.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
