'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  const loadFromLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const tasks = localStorage.getItem('completedTasks');
        const hideout = localStorage.getItem('completedHideout');
        if (tasks) setCompletedTaskIds(new Set(JSON.parse(tasks)));
        else setCompletedTaskIds(new Set()); 
        
        if (hideout) setCompletedHideoutLevels(new Set(JSON.parse(hideout)));
        else setCompletedHideoutLevels(new Set());
      } catch (e) {
        console.error("Failed to load progress from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const toggleTask = (taskId: string, completed: boolean) => {
    const newSet = new Set(completedTaskIds);
    if (completed) {
      newSet.add(taskId);
    } else {
      newSet.delete(taskId);
    }
    setCompletedTaskIds(newSet);
    localStorage.setItem('completedTasks', JSON.stringify(Array.from(newSet)));
  };

  const toggleHideout = (stationId: string, level: number, completed: boolean) => {
    const key = `${stationId}-${level}`;
    const newSet = new Set(completedHideoutLevels);
    if (completed) {
      newSet.add(key);
    } else {
      newSet.delete(key);
    }
    setCompletedHideoutLevels(newSet);
    localStorage.setItem('completedHideout', JSON.stringify(Array.from(newSet)));
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
