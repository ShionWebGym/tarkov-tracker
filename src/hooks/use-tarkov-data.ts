import { useQuery } from '@tanstack/react-query';
import { getTasks, getHideoutStations, getItemsByIds } from '@/lib/tarkov-api';
import { useMemo } from 'react';

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
    nameEn?: string;
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

  const { itemMap, relevantTasks } = useMemo(() => {
    const itemMap = new Map<string, AggregatedItem>();

    // Filter tasks and their objectives to ONLY include 'giveItem' requirements.
    const relevantTasks = tasksQuery.data
      ?.map(task => ({
        ...task,
        objectives: task.objectives.filter(obj => obj.type === 'giveItem' && obj.item && obj.count && obj.count > 0)
      }))
      .filter(task => task.objectives.length > 0) || [];

    if (relevantTasks && hideoutQuery.data) {
      // Process Tasks from the cleaned list
      relevantTasks.forEach(task => {
        // Check completion based on includeCompleted flag
        const isCompleted = completedTaskIds.has(task.id);
        if (!includeCompleted && isCompleted) return;

        task.objectives.forEach(obj => {
          const itemId = obj.item!.id;
          if (!itemMap.has(itemId)) {
            itemMap.set(itemId, {
              id: itemId,
              item: {
                ...obj.item!,
                image512pxLink: obj.item!.image512pxLink || "",
              },
              totalCount: 0,
              requirements: []
            });
          }
          const entry = itemMap.get(itemId)!;

          // Check for existing requirement to merge (Deduplication Logic)
          const existingReq = entry.requirements.find(r =>
              r.sourceType === 'task' && r.taskId === task.id
          );

          if (existingReq) {
              existingReq.count += obj.count!;
          } else {
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

              // Check for existing requirement to merge (Deduplication Logic)
              const existingReq = entry.requirements.find(r =>
                  r.sourceType === 'hideout' &&
                  r.stationId === station.id &&
                  r.level === level.level
              );

              if (existingReq) {
                  existingReq.count += req.count;
              } else {
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
              }
          });
        });
      });

      // Recalculate totalCount based on merged requirements
      // This ensures that totalCount matches exactly what the user sees in the requirements list.
      itemMap.forEach(entry => {
          entry.totalCount = entry.requirements.reduce((sum, req) => sum + req.count, 0);
      });
    }
    return { itemMap, relevantTasks };
  }, [tasksQuery.data, hideoutQuery.data, completedTaskIds, completedHideoutLevels, includeCompleted]);

  const itemIds = useMemo(() => Array.from(itemMap.keys()), [itemMap]);
  const secondaryLang = lang === 'ja' ? 'en' : 'ja';

  const secondaryItemsQuery = useQuery({
    queryKey: ['items', secondaryLang, itemIds],
    queryFn: () => getItemsByIds(itemIds, secondaryLang),
    enabled: itemIds.length > 0,
    staleTime: 1000 * 60 * 60,
  });

  const aggregatedItems = useMemo(() => {
    const items = Array.from(itemMap.values());
    if (secondaryItemsQuery.data) {
      const secondaryMap = new Map(secondaryItemsQuery.data.map(i => [i.id, i]));
      items.forEach(item => {
        const sec = secondaryMap.get(item.id);
        if (sec) {
          item.item.nameEn = sec.name;
        }
      });
    }
    return items.sort((a, b) => b.totalCount - a.totalCount);
  }, [itemMap, secondaryItemsQuery.data]);

  const isLoading = tasksQuery.isLoading || hideoutQuery.isLoading;
  const error = tasksQuery.error || hideoutQuery.error;

  return {
    tasks: relevantTasks, // Return the filtered list of tasks
    hideout: hideoutQuery.data,
    aggregatedItems,
    isLoading,
    error
  };
}
