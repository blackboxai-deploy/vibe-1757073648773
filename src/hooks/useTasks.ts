'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats, FilterType, TaskCategory } from '@/types/task';
import { TaskStorage } from '@/lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadTasks = () => {
      const storedTasks = TaskStorage.getTasks();
      setTasks(storedTasks);
      setIsLoading(false);
    };

    loadTasks();
  }, []);

  // Add new task
  const addTask = useCallback(async (
    title: string, 
    category: TaskCategory, 
    hasExercise: boolean = false,
    exerciseFile?: File
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: '',
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      hasExercise,
    };

    // Handle PDF file if provided
    if (hasExercise && exerciseFile) {
      try {
        const dataUrl = await fileToDataUrl(exerciseFile);
        newTask.exerciseFile = {
          name: exerciseFile.name,
          dataUrl,
        };
      } catch (error) {
        console.error('Error processing PDF file:', error);
      }
    }

    const updatedTasks = TaskStorage.addTask(newTask);
    setTasks(updatedTasks);
    
    return newTask;
  }, []);

  // Update task
  const updateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    const updatedTasks = TaskStorage.updateTask(taskId, updates);
    setTasks(updatedTasks);
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: number) => {
    const updatedTasks = TaskStorage.deleteTask(taskId);
    setTasks(updatedTasks);
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  // Move task up/down
  const moveTask = useCallback((taskId: number, direction: 'up' | 'down') => {
    const updatedTasks = TaskStorage.moveTask(taskId, direction);
    setTasks(updatedTasks);
  }, []);

  // Edit task title
  const editTaskTitle = useCallback((taskId: number, newTitle: string) => {
    if (newTitle.trim()) {
      updateTask(taskId, { title: newTitle.trim() });
    }
  }, [updateTask]);

  // Filter tasks based on current filters
  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (currentFilter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    // Apply hide completed filter
    if (hideCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    return filtered;
  }, [tasks, searchTerm, currentFilter, hideCompleted]);

  // Get task statistics
  const getStats = useCallback((): TaskStats => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      completed,
      progress,
    };
  }, [tasks]);

  // Can move task up/down
  const canMoveUp = useCallback((taskId: number) => {
    const index = tasks.findIndex(t => t.id === taskId);
    return index > 0;
  }, [tasks]);

  const canMoveDown = useCallback((taskId: number) => {
    const index = tasks.findIndex(t => t.id === taskId);
    return index >= 0 && index < tasks.length - 1;
  }, [tasks]);

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    TaskStorage.clearAllTasks();
    setTasks([]);
  }, []);

  // Export/Import tasks
  const exportTasks = useCallback(() => {
    return TaskStorage.exportTasks();
  }, []);

  const importTasks = useCallback((jsonData: string) => {
    try {
      const importedTasks = TaskStorage.importTasks(jsonData);
      setTasks(importedTasks);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, []);

  return {
    // State
    tasks: getFilteredTasks(),
    allTasks: tasks,
    isLoading,
    hideCompleted,
    currentFilter,
    searchTerm,
    
    // Actions
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    editTaskTitle,
    
    // Filters
    setHideCompleted,
    setCurrentFilter,
    setSearchTerm,
    
    // Utils
    getStats,
    canMoveUp,
    canMoveDown,
    clearAllTasks,
    exportTasks,
    importTasks,
  };
}

// Helper function to convert File to Data URL
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}