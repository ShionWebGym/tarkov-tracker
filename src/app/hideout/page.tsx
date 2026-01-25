'use client'

import { useTarkovData } from "@/hooks/use-tarkov-data"
import { useUserProgress } from "@/context/user-progress-context"
import { useLanguage } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { Loader2, CheckCircle2, Lock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export default function HideoutPage() {
  const { completedHideoutLevels, toggleHideout } = useUserProgress()
  const { language, t } = useLanguage()
  const { hideout, isLoading, error } = useTarkovData(language)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  // Sort stations by name
  const sortedStations = useMemo(() => {
      return hideout ? [...hideout].sort((a, b) => a.name.localeCompare(b.name, language === 'ja' ? 'ja' : 'en')) : [];
  }, [hideout, language]);

  // Set initial station
  if (sortedStations.length > 0 && !selectedStationId) {
      setSelectedStationId(sortedStations[0].id);
  }

  const selectedStation = useMemo(() => 
    sortedStations.find(s => s.id === selectedStationId), 
  [sortedStations, selectedStationId]);

  // Calculate progress for a station
  const getStationProgress = (station: typeof sortedStations[0]) => {
      const totalLevels = station.levels.length;
      if (totalLevels === 0) return 0;
      const completedCount = station.levels.filter(lvl => completedHideoutLevels.has(`${station.id}-${lvl.level}`)).length;
      return (completedCount / totalLevels) * 100;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 font-medium animate-pulse">{t('loadingHideout')}</span>
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
      <main className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t('hideout')}</h1>
            <p className="text-muted-foreground max-w-2xl">
                {t('trackHideout')}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Station Selection Sidebar */}
            <div className="lg:col-span-1">
                <Card className="h-full border-muted shadow-md max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
                    <CardContent className="p-4 flex-1 overflow-y-auto">
                         <h3 className="font-semibold mb-4 px-2 text-lg">Stations</h3>
                         <div className="space-y-1">
                            {sortedStations.map((station) => {
                                const progress = getStationProgress(station);
                                return (
                                    <button
                                        key={station.id}
                                        onClick={() => setSelectedStationId(station.id)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-between group",
                                            selectedStationId === station.id 
                                                ? "bg-primary text-primary-foreground shadow-sm" 
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="truncate mr-2">{station.name}</span>
                                        {progress === 100 ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                        ) : (
                                            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-current transition-all" 
                                                    style={{ width: `${progress}%`, opacity: selectedStationId === station.id ? 1 : 0.5 }} 
                                                />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                         </div>
                    </CardContent>
                </Card>
            </div>

            {/* Station Levels Area */}
            <div className="lg:col-span-3">
                 <Card className="h-full min-h-[500px] border-muted shadow-md flex flex-col">
                    <CardContent className="p-6 flex-1">
                        {selectedStation && (
                            <>
                                <div className="mb-8">
                                    <div className="flex items-end justify-between mb-2">
                                        <h2 className="text-3xl font-bold">{selectedStation.name}</h2>
                                        <span className="text-sm font-mono text-muted-foreground">
                                             {Math.round(getStationProgress(selectedStation))}% Completed
                                        </span>
                                    </div>
                                    <Progress value={getStationProgress(selectedStation)} className="h-2" />
                                </div>

                                <div className="space-y-6">
                                    {selectedStation.levels.map((level) => {
                                        const levelKey = `${selectedStation.id}-${level.level}`;
                                        const isCompleted = completedHideoutLevels.has(levelKey);
                                        const prevLevelKey = `${selectedStation.id}-${level.level - 1}`;
                                        const isPrevCompleted = level.level === 1 || completedHideoutLevels.has(prevLevelKey);
                                        const isLocked = !isPrevCompleted;

                                        return (
                                            <div 
                                                key={level.level} 
                                                onClick={() => !isLocked && toggleHideout(selectedStation.id, level.level, !isCompleted)}
                                                className={cn(
                                                    "border rounded-xl p-6 transition-all duration-300 relative overflow-hidden",
                                                    isCompleted ? "bg-muted/30 border-muted" : "bg-card border-border",
                                                    isLocked && "opacity-60 bg-muted/10 grayscale",
                                                    !isLocked && "cursor-pointer hover:border-primary/50"
                                                )}
                                            >
                                                {isLocked && (
                                                    <div className="absolute top-4 right-4 text-muted-foreground" title="Complete previous level first">
                                                        <Lock className="h-5 w-5" />
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 mb-4">
                                                     <Checkbox 
                                                        id={levelKey} 
                                                        checked={isCompleted}
                                                        disabled={isLocked}
                                                        className="h-6 w-6 pointer-events-none"
                                                    />
                                                    <div 
                                                        className={cn(
                                                            "text-xl font-bold",
                                                            isCompleted && "line-through text-muted-foreground"
                                                        )}
                                                    >
                                                        Level {level.level}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-10">
                                                    {level.itemRequirements.map((req, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className={cn(
                                                                "flex items-center gap-3 p-2 rounded-md border bg-background/50 text-sm",
                                                                isCompleted && "opacity-50 line-through"
                                                            )}
                                                        >
                                                            {/* We could fetch images here if we aggregated differently, but aggregatedItems is separate. 
                                                                Since we only have name/count here from the raw hideout query, we show text.
                                                                Ideally, we'd map this to the item DB to get images.
                                                            */}
                                                             <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 font-bold text-xs text-muted-foreground">
                                                                {req.item.shortName ? req.item.shortName.substring(0,2) : "?"}
                                                             </div>
                                                             <div className="flex flex-col leading-tight">
                                                                <span className="font-medium">{req.item.name}</span>
                                                                <span className="text-muted-foreground text-xs">x{req.count}</span>
                                                             </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  )
}
