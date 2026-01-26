'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProgressContextType {
  completedTaskIds: Set<string>;
  completedHideoutLevels: Set<string>;
  toggleTask: (taskId: string, completed: boolean) => void;
  toggleHideout: (stationId: string, level: number, completed: boolean) => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [completedHideoutLevels, setCompletedHideoutLevels] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const tasks = localStorage.getItem('completedTasks');
        const hideout = localStorage.getItem('completedHideout');
        
        if (tasks) {
            setCompletedTaskIds(new Set(JSON.parse(tasks)));
        }

        if (hideout) {
            setCompletedHideoutLevels(new Set(JSON.parse(hideout)));
        }
      } catch (e) {
        console.error("Failed to load progress from local storage", e);
      } finally {
        setIsLoaded(true);
      }
    } else {
        setIsLoaded(true);
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('completedTasks', JSON.stringify(Array.from(completedTaskIds)));
  }, [completedTaskIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('completedHideout', JSON.stringify(Array.from(completedHideoutLevels)));
  }, [completedHideoutLevels, isLoaded]);

  const toggleTask = (taskId: string, completed: boolean) => {
    setCompletedTaskIds(prev => {
        const newSet = new Set(prev);
        if (completed) {
            newSet.add(taskId);
        } else {
            newSet.delete(taskId);
        }
        return newSet;
    });
  };

  const toggleHideout = (stationId: string, level: number, completed: boolean) => {
    setCompletedHideoutLevels(prev => {
        const newSet = new Set(prev);

        if (completed) {
            // Check current level and all previous levels (1 to level)
            for (let l = 1; l <= level; l++) {
                newSet.add(`${stationId}-${l}`);
            }
        } else {
            // Uncheck current level and all higher levels
            // We iterate through the set to find higher levels for this station
            // This is safer than assuming max level
            for (const key of Array.from(newSet)) {
                if (key.startsWith(`${stationId}-`)) {
                    // Extract level from key "stationId-level"
                    const levelStr = key.substring(stationId.length + 1);
                    const l = parseInt(levelStr, 10);

                    if (!isNaN(l) && l >= level) {
                        newSet.delete(key);
                    }
                }
            }
        }
        return newSet;
    });
  };

  return (
    <UserProgressContext.Provider value={{ completedTaskIds, completedHideoutLevels, toggleTask, toggleHideout }}>
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
}
