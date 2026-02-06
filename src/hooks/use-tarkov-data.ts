import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks, getHideoutStations } from '@/lib/tarkov-api';

export interface ItemRequirement {
  id: string; // Item ID
  name: string;
  shortName: string;
  image512pxLink: string;
  count: number;
  sourceType: 'task' | 'hideout';
  sourceName: string;
  // Identifiers for toggling
  taskId?: string;
  stationId?: string;
  level?: number;
}

export interface AggregatedItem {
  id: string;
  item: {
    id:string;
    name: string;
    shortName: string;
    image512pxLink: string;
  };
  totalCount: number;
  requirements: ItemRequirement[];
}

export function useTarkovData(
  lang: string = 'ja',
  completedTaskIds: Set<string> = new Set(),
  completedHideoutLevels: Set<string> = new Set(),
  includeCompleted: boolean = false
) {
  const tasksQuery = useQuery({
    queryKey: ['tasks', lang],
    queryFn: () => getTasks(lang),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const hideoutQuery = useQuery({
    queryKey: ['hideout', lang],
    queryFn: () => getHideoutStations(lang),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const isLoading = tasksQuery.isLoading || hideoutQuery.isLoading;
  const error = tasksQuery.error || hideoutQuery.error;

  const { aggregatedItems, relevantTasks } = useMemo(() => {
    const itemMap = new Map<string, AggregatedItem>();

    const relevantTasks = tasksQuery.data
      ?.map(task => ({
        ...task,
        objectives: task.objectives.filter(obj => obj.type === 'giveItem' && obj.item && obj.count && obj.count > 0)
      }))
      .filter(task => task.objectives.length > 0) || [];

    if (relevantTasks && hideoutQuery.data) {
      // ... processing logic
      relevantTasks.forEach(task => {
        // ...
        const isCompleted = completedTaskIds.has(task.id);
        if (!includeCompleted && isCompleted) return;
        task.objectives.forEach(obj => {
          const itemId = obj.item!.id;
          if (!itemMap.has(itemId)) {
            itemMap.set(itemId, {
              id: itemId,
              item: { ...obj.item!, image512pxLink: obj.item!.image512pxLink || "" },
              totalCount: 0,
              requirements: []
            });
          }
          const entry = itemMap.get(itemId)!;
          entry.requirements.push({
            id: obj.item!.id,
            name: obj.item!.name,
            shortName: obj.item!.shortName,
            image512pxLink: obj.item!.image512pxLink || "",
            count: obj.count!,
            sourceType: 'task',
            sourceName: `${task.trader.name} - ${task.name}`,
            taskId: task.id
          });
        });
      });

      hideoutQuery.data.forEach(station => {
        station.levels.forEach(level => {
          const levelKey = `${station.id}-${level.level}`;
          const isCompleted = completedHideoutLevels.has(levelKey);
          if (!includeCompleted && isCompleted) return;
          level.itemRequirements.forEach(req => {
            const itemId = req.item.id;
            if (!itemMap.has(itemId)) {
              itemMap.set(itemId, {
                id: itemId,
                item: { ...req.item, image512pxLink: req.item.image512pxLink || "" },
                totalCount: 0,
                requirements: []
              });
            }
            const entry = itemMap.get(itemId)!;
            entry.requirements.push({
              id: req.item.id,
              name: req.item.name,
              shortName: req.item.shortName,
              image512pxLink: req.item.image512pxLink || "",
              count: req.count,
              sourceType: 'hideout',
              sourceName: `${station.name} Level ${level.level}`,
              stationId: station.id,
              level: level.level
            });
          });
        });
      });

      itemMap.forEach(entry => {
        entry.totalCount = entry.requirements.reduce((sum, req) => sum + req.count, 0);
      });
    }

    const aggregatedItems = Array.from(itemMap.values()).sort((a, b) => b.totalCount - a.totalCount);
    return { aggregatedItems, relevantTasks };
  }, [tasksQuery.data, hideoutQuery.data, completedTaskIds, completedHideoutLevels, includeCompleted]);

  return {
    tasks: relevantTasks,
    hideout: hideoutQuery.data,
    aggregatedItems,
    isLoading,
    error
  };
}
