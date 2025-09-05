import { Task } from '@/types/task';

const STORAGE_KEY = 'studyTasks';

export class TaskStorage {
  static getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  static saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  static addTask(task: Task): Task[] {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
    return tasks;
  }

  static updateTask(taskId: number, updates: Partial<Task>): Task[] {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveTasks(tasks);
    }
    
    return tasks;
  }

  static deleteTask(taskId: number): Task[] {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    this.saveTasks(filtered);
    return filtered;
  }

  static moveTask(taskId: number, direction: 'up' | 'down'): Task[] {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    
    if (index === -1) return tasks;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= tasks.length) return tasks;
    
    // Swap tasks
    [tasks[index], tasks[newIndex]] = [tasks[newIndex], tasks[index]];
    
    this.saveTasks(tasks);
    return tasks;
  }

  static clearAllTasks(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  static exportTasks(): string {
    const tasks = this.getTasks();
    return JSON.stringify(tasks, null, 2);
  }

  static importTasks(jsonData: string): Task[] {
    try {
      const tasks = JSON.parse(jsonData) as Task[];
      
      // Validate tasks structure
      const validTasks = tasks.filter(task => 
        typeof task.id === 'number' &&
        typeof task.title === 'string' &&
        typeof task.category === 'string' &&
        typeof task.completed === 'boolean'
      );
      
      this.saveTasks(validTasks);
      return validTasks;
    } catch (error) {
      console.error('Error importing tasks:', error);
      throw new Error('Invalid JSON format');
    }
  }
}