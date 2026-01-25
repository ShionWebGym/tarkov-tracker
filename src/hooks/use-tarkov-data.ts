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
    id: string;
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

  const itemMap = new Map<string, AggregatedItem>();

  if (tasksQuery.data && hideoutQuery.data) {
    // Process Tasks
    tasksQuery.data.forEach(task => {
      const isCompleted = completedTaskIds.has(task.id);
      if (!includeCompleted && isCompleted) return;

      // Filter out 'findItem' if 'giveItem' exists for the same item to avoid double counting
      // Also handle cases where there are multiple 'plantItem' objectives
      const uniqueObjectives = task.objectives.reduce((acc, obj) => {
        if (!obj.item || !obj.count) return acc;
        
        const existingIndex = acc.findIndex(o => o.item!.id === obj.item!.id);
        if (existingIndex !== -1) {
            // Priority: giveItem > findItem > plantItem
            // If we have a 'giveItem' and the existing one is 'findItem', replace it.
            // If we have 'findItem' and existing is 'giveItem', ignore 'findItem'.
            // If we have multiple 'plantItem', we might want to keep all of them or sum them? 
            // Based on logs: "plantItem, plantItem" usually means multiple spots.
            
            const existing = acc[existingIndex];
            
            // Case 1: Handle Find/Give pair (usually "Find in raid" + "Hand over")
            if (
                (obj.type === 'giveItem' && existing.type === 'findItem') ||
                (obj.type === 'findItem' && existing.type === 'giveItem')
            ) {
                 // Keep 'giveItem' as the requirement usually implies finding it too, or just handing over found ones.
                 // The 'count' should be the same usually. We take the 'giveItem' one.
                 if (obj.type === 'giveItem') {
                     acc[existingIndex] = obj;
                 }
                 return acc;
            }

            // Case 2: Multiple plantItem or other combinations that are distinct requirements
            // e.g., "plantItem" x 3 often means 3 different items or same item 3 times?
            // The log shows: "Task: Informed Means Armed has multiple objectives for item 5b4391a586f7745321235ab2: plantItem, plantItem, plantItem"
            // If it's the same item ID, we should probably SUM them if they are distinct actions (like planting in 3 spots).
            // However, the dashboard logic simply pushes requirements. 
            // If we push multiple requirements for the same item from the same task, it shows up as multiple lines in "Item Details".
            // But for "Total Count", we need to be careful.
            
            // For now, let's just push it as a separate objective if it's NOT the Find/Give pair.
            acc.push(obj);
        } else {
            acc.push(obj);
        }
        return acc;
      }, [] as typeof task.objectives);

      uniqueObjectives.forEach(obj => {
        if (obj.item && obj.count) {
          const itemId = obj.item.id;
          if (!itemMap.has(itemId)) {
            itemMap.set(itemId, {
              id: itemId,
              item: {
                ...obj.item,
                image512pxLink: obj.item.image512pxLink || "",
              },
              totalCount: 0,
              requirements: []
            });
          }
          const entry = itemMap.get(itemId)!;
          
          entry.totalCount += obj.count;
          
          entry.requirements.push({
            id: obj.item.id,
            name: obj.item.name,
            shortName: obj.item.shortName,
            image512pxLink: obj.item.image512pxLink || "",
            count: obj.count,
            sourceType: 'task',
            sourceName: `${task.trader.name} - ${task.name} (${obj.type})`,
            taskId: task.id
          });
        }
      });
    });

    // Process Hideout
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
                item: {
                  ...req.item,
                  image512pxLink: req.item.image512pxLink || "",
                },
                totalCount: 0,
                requirements: []
              });
            }
            const entry = itemMap.get(itemId)!;
            entry.totalCount += req.count;
            
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
  }

  return {
    tasks: tasksQuery.data,
    hideout: hideoutQuery.data,
    aggregatedItems: Array.from(itemMap.values()).sort((a, b) => b.totalCount - a.totalCount),
    isLoading,
    error
  };
}
