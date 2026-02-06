'use client'

import { use } from 'react'
import { useTarkovData } from "@/hooks/use-tarkov-data"
import { useUserProgress } from "@/context/user-progress-context"
import { useLanguage } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const { completedTaskIds, completedHideoutLevels, toggleTask, toggleHideout } = useUserProgress()
  const { language, t } = useLanguage()
  
  // Fetch ALL data including completed ones to show full history/context
  const { aggregatedItems, isLoading, error } = useTarkovData(language, new Set(), new Set(), true)

  const itemData = aggregatedItems?.find(i => i.id === id)

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

  if (error || !itemData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex h-[50vh] w-full flex-col items-center justify-center text-muted-foreground gap-4">
          <p>{error ? t('errorLoading') : 'Item not found.'}</p>
          <Button asChild variant="outline">
            <Link href="/">{t('dashboard')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate current needed count
  const currentNeeded = itemData.requirements.reduce((acc, req) => {
    let isCompleted = false;
    if (req.sourceType === 'task' && req.taskId) {
        isCompleted = completedTaskIds.has(req.taskId);
    } else if (req.sourceType === 'hideout' && req.stationId && req.level) {
        isCompleted = completedHideoutLevels.has(`${req.stationId}-${req.level}`);
    }
    return isCompleted ? acc : acc + req.count;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="container mx-auto max-w-5xl py-8 px-4 sm:px-6">
        <div className="mb-6 flex justify-center md:justify-start">
            <Button asChild variant="ghost" className="pl-0 hover:pl-2 transition-all">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Item Info Column */}
            <div className="md:col-span-1 space-y-6">
                <Card className="overflow-hidden border-border/50 shadow-lg bg-card/50 backdrop-blur-sm sticky top-24">
                    <CardHeader className="flex flex-col items-center pb-2">
                         <div className="relative w-40 h-40 mb-4 bg-gradient-to-br from-muted/50 to-transparent rounded-xl flex items-center justify-center">
                            {itemData.item.image512pxLink ? (
                                <Image 
                                    src={itemData.item.image512pxLink} 
                                    alt={itemData.item.name} 
                                    fill 
                                    className="object-contain p-4"
                                />
                            ) : (
                                <span className="text-muted-foreground">No Image</span>
                            )}
                        </div>
                        <CardTitle className="text-center text-xl font-bold leading-tight">
                            {itemData.item.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-mono mt-1">{itemData.item.shortName}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Separator />
                        <div className="flex justify-between items-center px-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Needed</span>
                            <span className="text-2xl font-bold">{itemData.totalCount}</span>
                        </div>
                         <div className="flex justify-between items-center px-2">
                            <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                            <Badge variant={currentNeeded > 0 ? "default" : "secondary"} className="text-lg px-3">
                                {currentNeeded}
                            </Badge>
                        </div>
                        {currentNeeded === 0 && (
                            <div className="bg-primary/10 text-primary p-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4" />
                                All requirements met!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Requirements Column */}
            <div className="md:col-span-2 space-y-6">
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <p className="text-muted-foreground mb-6">
                        Check off completed tasks and hideout upgrades to update your progress.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Tasks Section */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="bg-blue-500/10 text-blue-500 p-1.5 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                            </span>
                            Tasks
                        </h3>
                        <Card>
                            <CardContent className="p-0">
                                <ScrollArea className="h-full max-h-[400px]">
                                    <div className="divide-y">
                                        {itemData.requirements.filter(r => r.sourceType === 'task').map((req, idx) => {
                                             const isCompleted = req.taskId ? completedTaskIds.has(req.taskId) : false;
                                             return (
                                                <div key={idx} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                                                     <Checkbox 
                                                        id={`task-${idx}`}
                                                        checked={isCompleted}
                                                        onCheckedChange={(checked) => req.taskId && toggleTask(req.taskId, checked as boolean)}
                                                        className="mt-0.5"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <Label 
                                                            htmlFor={`task-${idx}`}
                                                            className={`text-base font-medium cursor-pointer block ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                                        >
                                                            {req.sourceName}
                                                        </Label>
                                                    </div>
                                                    <Badge variant="outline" className="ml-auto font-mono">
                                                        x{req.count}
                                                    </Badge>
                                                </div>
                                             )
                                        })}
                                        {itemData.requirements.filter(r => r.sourceType === 'task').length === 0 && (
                                            <div className="p-8 text-center text-muted-foreground text-sm">
                                                No tasks require this item.
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Hideout Section */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="bg-orange-500/10 text-orange-500 p-1.5 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </span>
                            Hideout
                        </h3>
                        <Card>
                            <CardContent className="p-0">
                                <ScrollArea className="h-full max-h-[400px]">
                                     <div className="divide-y">
                                        {itemData.requirements.filter(r => r.sourceType === 'hideout').map((req, idx) => {
                                             const key = `${req.stationId}-${req.level}`;
                                             const isCompleted = completedHideoutLevels.has(key);
                                             return (
                                                <div key={idx} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                                                     <Checkbox
                                                        id={`hideout-${idx}`}
                                                        checked={isCompleted}
                                                        onCheckedChange={(checked) => req.stationId && req.level && toggleHideout(req.stationId, req.level, checked as boolean)}
                                                        className="mt-0.5"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <Label
                                                            htmlFor={`hideout-${idx}`}
                                                            className={`text-base font-medium cursor-pointer block ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                                        >
                                                            {req.sourceName}
                                                        </Label>
                                                    </div>
                                                    <Badge variant="outline" className="ml-auto font-mono">
                                                        x{req.count}
                                                    </Badge>
                                                </div>
                                             )
                                        })}
                                         {itemData.requirements.filter(r => r.sourceType === 'hideout').length === 0 && (
                                            <div className="p-8 text-center text-muted-foreground text-sm">
                                                No hideout upgrades require this item.
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
