'use client'

import { useTarkovData, AggregatedItem } from "@/hooks/use-tarkov-data"
import { ItemCard } from "@/components/item-card"
import { Loader2, ArrowUpDown, Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useUserProgress } from "@/context/user-progress-context"
import { useLanguage } from "@/context/language-context"
import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortOption = 'total-desc' | 'total-asc' | 'name-asc' | 'name-desc';

export default function Dashboard() {
  const { completedTaskIds, completedHideoutLevels, pinnedItemIds, togglePin } = useUserProgress()
  const { language, t } = useLanguage()
  const { aggregatedItems, isLoading, error } = useTarkovData(language, completedTaskIds, completedHideoutLevels)
  const [sortBy, setSortBy] = useState<SortOption>('total-desc')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedSort = localStorage.getItem('dashboardSortBy') as SortOption
    if (savedSort) {
        setSortBy(savedSort)
    }
    const savedQuery = localStorage.getItem('dashboardSearchQuery')
    if (savedQuery) {
        setSearchQuery(savedQuery)
    }
  }, [])

  const handleSortChange = (val: string) => {
    const newSort = val as SortOption;
    setSortBy(newSort);
    localStorage.setItem('dashboardSortBy', newSort);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    localStorage.setItem('dashboardSearchQuery', val)
  }

  const sortedItems = useMemo(() => {
    if (!aggregatedItems) return [];
    
    const sortFn = (a: AggregatedItem, b: AggregatedItem) => {
      switch (sortBy) {
        case 'total-desc':
          return b.totalCount - a.totalCount;
        case 'total-asc':
          return a.totalCount - b.totalCount;
        case 'name-asc':
          return a.item.name.localeCompare(b.item.name, language === 'ja' ? 'ja' : 'en');
        case 'name-desc':
          return b.item.name.localeCompare(a.item.name, language === 'ja' ? 'ja' : 'en');
        default:
          return 0;
      }
    };

    const pinned = aggregatedItems.filter(item => pinnedItemIds.has(item.id)).sort(sortFn);
    const unpinned = aggregatedItems.filter(item => !pinnedItemIds.has(item.id)).sort(sortFn);

    return [...pinned, ...unpinned];
  }, [aggregatedItems, sortBy, language, pinnedItemIds]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 font-medium animate-pulse">{t('loadingData')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex h-[50vh] w-full items-center justify-center text-destructive">
          {t('errorLoading')}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="container mx-auto max-w-7xl py-8 space-y-8 px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('dashboard')}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {t('totalItemsNeeded')}
            </p>
            <div className="flex flex-col gap-2 pt-2 text-center max-w-full">
                <Badge variant="destructive" className="text-xs font-normal whitespace-normal text-left sm:text-center mx-auto max-w-full leading-relaxed">
                    ※データはブラウザに保存されます。キャッシュを削除すると進捗がリセットされるためご注意ください。
                </Badge>
                <p className="text-xs text-muted-foreground px-4">
                    ※当サイトのデータはTarkov.dev APIを利用しており、実際の内容と異なる場合があります。
                </p>
            </div>
            
             <div className="flex w-full max-w-sm items-center gap-2 pt-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={language === 'ja' ? '検索...' : 'Search...'}
                        className="pl-8 bg-background"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px] sm:w-[180px]">
                    <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="total-desc">Count (High to Low)</SelectItem>
                    <SelectItem value="total-asc">Count (Low to High)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 place-content-center">
          {sortedItems.map((item) => (
            <ItemCard
                key={item.id}
                item={item}
                isPinned={pinnedItemIds.has(item.id)}
                onPinToggle={() => togglePin(item.id)}
            />
          ))}
        </div>
        
        {sortedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-lg border-2 border-dashed border-muted mx-auto max-w-2xl">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-semibold">{t('noItemsNeeded')}</h3>
                <p className="text-muted-foreground">Good luck in the raid!</p>
            </div>
        )}
      </main>
    </div>
  )
}
