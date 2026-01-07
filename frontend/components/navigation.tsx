
"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { Sparkles, Search, Upload, LogOut, Menu } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/landing"
  }

  const navigationItems = [
    {
      href: "/home",
      label: "Search",
      icon: Search,
    },
    {
      href: "/upload",
      label: "Bulk Upload",
      icon: Upload,
    },
  ]

  return (
    <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ArtSearch AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex glass-effect bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout} className="glass-effect bg-transparent">
              <LogOut className="h-4 w-4" />
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="glass-effect bg-transparent">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-xl font-semibold">ArtSearch AI</span>
                  </div>

                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 text-lg transition-colors hover:text-primary p-2 rounded-lg ${
                          pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}