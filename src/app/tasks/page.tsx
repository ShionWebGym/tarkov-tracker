'use client'

import { useTarkovData } from "@/hooks/use-tarkov-data"
import { useUserProgress } from "@/context/user-progress-context"
import { useLanguage } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const { completedTaskIds, toggleTask } = useUserProgress()
  const { language, t } = useLanguage()
  const { tasks, isLoading, error } = useTarkovData(language)
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null)

  // Group tasks by trader
  const tasksByTrader = useMemo(() => {
      return tasks?.reduce((acc, task) => {
        const trader = task.trader.name;
        if (!acc[trader]) {
          acc[trader] = [];
        }
        acc[trader].push(task);
        return acc;
      }, {} as Record<string, typeof tasks>) || {};
  }, [tasks]);

  const traders = useMemo(() => Object.keys(tasksByTrader).sort(), [tasksByTrader]);

  // Set initial trader if not selected
  if (traders.length > 0 && !selectedTrader) {
      setSelectedTrader(traders[0]);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 font-medium animate-pulse">{t('loadingTasks')}</span>
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
            <h1 className="text-3xl font-bold tracking-tight">{t('tasks')}</h1>
            <p className="text-muted-foreground max-w-2xl">
                {t('markTasks')}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Trader Selection Sidebar */}
            <div className="lg:col-span-1">
                <Card className="h-full border-muted shadow-md">
                    <CardContent className="p-4">
                         <h3 className="font-semibold mb-4 px-2 text-lg">Traders</h3>
                         <div className="space-y-1">
                            {traders.map((trader) => (
                                <button
                                    key={trader}
                                    onClick={() => setSelectedTrader(trader)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                        selectedTrader === trader 
                                            ? "bg-primary text-primary-foreground shadow-sm" 
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {trader}
                                </button>
                            ))}
                         </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks List Area */}
            <div className="lg:col-span-3">
                 <Card className="h-full min-h-[500px] border-muted shadow-md flex flex-col">
                    <CardContent className="p-6 flex-1">
                         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            {selectedTrader}
                            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {tasksByTrader[selectedTrader!]?.length || 0} tasks
                            </span>
                         </h2>
                         
                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                             {selectedTrader && tasksByTrader[selectedTrader]?.map((task) => (
                                <div key={task.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 group">
                                    <Checkbox 
                                        id={task.id} 
                                        checked={completedTaskIds.has(task.id)}
                                        onCheckedChange={(checked) => toggleTask(task.id, checked as boolean)}
                                        className="mt-1 group-hover:border-primary"
                                    />
                                    <div className="grid gap-1.5 leading-none w-full">
                                        <div className="flex justify-between items-start gap-2">
                                            <Label 
                                                htmlFor={task.id}
                                                className={`text-base font-medium cursor-pointer transition-colors ${completedTaskIds.has(task.id) ? "line-through text-muted-foreground" : "group-hover:text-primary"}`}
                                            >
                                                {task.name}
                                            </Label>
                                        </div>
                                        
                                        <div className="text-sm text-muted-foreground space-y-1 mt-1 bg-muted/30 p-2 rounded-md">
                                            {(() => {
                                                const aggregatedObjectives = new Map<string, any>();
                                                task.objectives
                                                    .filter(obj => (obj.type === 'giveItem' || obj.type === 'findItem') && obj.item)
                                                    .forEach(obj => {
                                                        if (aggregatedObjectives.has(obj.item!.id)) {
                                                            aggregatedObjectives.get(obj.item!.id).count += obj.count;
                                                        } else {
                                                            aggregatedObjectives.set(obj.item!.id, { ...obj });
                                                        }
                                                    });
                                                
                                                return Array.from(aggregatedObjectives.values()).map(obj => (
                                                    <div key={obj.item.id} className="flex items-center gap-2">
                                                        <span className={`h-1.5 w-1.5 rounded-full ${completedTaskIds.has(task.id) ? "bg-muted-foreground" : "bg-primary"}`} />
                                                        <span>{obj.item.name} <span className="font-mono text-xs opacity-80">x{obj.count}</span></span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                             ))}
                         </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </main>
    </div>
  )
}
