'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function Navbar() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-16 items-center mx-auto">
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
  )
}
