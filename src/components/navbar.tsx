'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container relative flex h-16 items-center mx-auto px-4 md:px-8">
          <div className="md:hidden mr-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
              </Button>
          </div>

          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Loot Lens
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t('dashboard')}
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/tasks" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t('tasks')}
            </Link>
            <Link
              href="/hideout"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/hideout" ? "text-foreground" : "text-foreground/60"
              )}
            >
              {t('hideout')}
            </Link>
          </nav>

          <div className="flex-1 flex items-center justify-end gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="lang-switch" className={`text-xs font-bold ${language === 'en' ? 'text-primary' : 'text-muted-foreground'}`}>EN</Label>
              <Switch
                  id="lang-switch"
                  checked={language === 'ja'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'ja' : 'en')}
              />
              <Label htmlFor="lang-switch" className={`text-xs font-bold ${language === 'ja' ? 'text-primary' : 'text-muted-foreground'}`}>JP</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
            "fixed inset-0 z-50 bg-black/80 md:hidden transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Content */}
      <div className={cn(
        "fixed top-0 left-0 z-50 h-full w-[300px] max-w-[80vw] bg-background p-6 shadow-xl transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Loot Lens
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
            </Button>
        </div>

        <nav className="flex flex-col space-y-6">
             <Link
                href="/"
                className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
                )}
            >
                {t('dashboard')}
            </Link>
            <Link
                href="/tasks"
                className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/tasks" ? "text-foreground" : "text-muted-foreground"
                )}
            >
                {t('tasks')}
            </Link>
            <Link
                href="/hideout"
                className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === "/hideout" ? "text-foreground" : "text-muted-foreground"
                )}
            >
                {t('hideout')}
            </Link>
        </nav>

        <div className="mt-auto">
            <Footer className="mt-0 border-t-0" minimal />
        </div>
      </div>
    </>
  )
}
