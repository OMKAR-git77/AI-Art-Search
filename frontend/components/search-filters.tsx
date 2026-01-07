"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Palette, Layers, Eye, Sparkles } from "lucide-react"

interface SearchFiltersProps {
  filters: {
    style: boolean
    texture: boolean
    colorPalette: boolean
    emotion: boolean
  }
  onFiltersChange: (filters: any) => void
}

export function SearchFiltersComponent({ filters, onFiltersChange }: SearchFiltersProps) {
  const handleFilterChange = (key: string, value: boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const filterOptions = [
    {
      key: "style",
      label: "Style",
      description: "Artistic style and technique",
      icon: Sparkles,
    },
    {
      key: "texture",
      label: "Texture",
      description: "Surface texture and material",
      icon: Layers,
    },
    {
      key: "colorPalette",
      label: "Color Palette",
      description: "Color scheme and harmony",
      icon: Palette,
    },
    {
      key: "emotion",
      label: "Emotion",
      description: "Emotional tone and mood",
      icon: Eye,
    },
  ]

  return (
    <Card className="p-6 glass-effect border-border/50">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Search Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filterOptions.map((option) => {
            const Icon = option.icon
            return (
              <div key={option.key} className="flex items-center space-x-3">
                <Switch
                  id={option.key}
                  checked={filters[option.key as keyof typeof filters]}
                  onCheckedChange={(checked) => handleFilterChange(option.key, checked)}
                />
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <Label htmlFor={option.key} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
