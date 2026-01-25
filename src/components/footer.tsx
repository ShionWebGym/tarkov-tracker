'use client'

import { useEffect, useState } from 'react'
import { getItemsByIds, Item } from '@/lib/tarkov-api'
import { useLanguage } from '@/context/language-context'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const donationItemIds = [
  '57347d7224597744596b4e72', // Tushonka (Small)
  '5d1b36a186f7742523398433', // Fuel (Small)
  '5751a89d24597722aa0e8db0', // Golden Star
]

const donationLinks: Record<string, { url: string; text: string }> = {
  '57347d7224597744596b4e72': { url: 'https://buymeacoffee.com/noobmqster/e/502959', text: 'Buy Dev a Tushonka' },
  '5d1b36a186f7742523398433': { url: 'https://buymeacoffee.com/noobmqster/e/502961', text: 'Buy Dev some Fuel' },
  '5751a89d24597722aa0e8db0': { url: 'https://buymeacoffee.com/noobmqster/e/502962', text: 'Buy Dev a Golden Star' },
}

export function Footer() {
  const { language } = useLanguage()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    async function fetchItems() {
      const fetchedItems = await getItemsByIds(donationItemIds, language)
      // Sort items to match the order of donationItemIds and ensure they have an iconLink
      const sortedAndFiltered = donationItemIds
        .map(id => fetchedItems.find(item => item.id === id))
        .filter((item): item is Item & { iconLink: string } => !!item && !!item.iconLink);
      setItems(sortedAndFiltered)
    }
    fetchItems()
  }, [language])

  return (
    <footer className="w-full border-t border-border/40 mt-12 py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {items.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <a href={donationLinks[item.id].url} target="_blank" rel="noopener noreferrer" className="grayscale hover:grayscale-0 transition-all duration-200">
                    <img src={item.iconLink} alt={item.name} className="h-8 w-8" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{donationLinks[item.id].text}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>&copy; {new Date().getFullYear()} Loot Lens. All rights reserved.</p>
          <p>
            Escape from Tarkov and all related logos and imagery are trademarks of Battlestate Games. This site is unofficial and not affiliated with Battlestate Games.
          </p>
          <p>
            Data provided by <a href="https://tarkov.dev/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">tarkov.dev</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
