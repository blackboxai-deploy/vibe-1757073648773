export interface Task {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  hasExercise: boolean;
  exerciseFile?: ExerciseFile;
}

export interface ExerciseFile {
  name: string;
  dataUrl: string;
}

export type TaskCategory = 
  | 'Direito Constitucional'
  | 'Direito Penal'
  | 'Direito Penal Especial'
  | 'Legislação Penal Especial'
  | 'Direitos Humanos'
  | 'Direito Administrativo'
  | 'Direito Penal Militar'
  | 'Português'
  | 'Informática'
  | 'Matemática'
  | 'Geografia'
  | 'Atualidades'
  | 'História';

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  progress: number;
}

export type FilterType = 'all' | 'pending' | 'search';

export const TASK_CATEGORIES: TaskCategory[] = [
  'Direito Constitucional',
  'Direito Penal',
  'Direito Penal Especial',
  'Legislação Penal Especial',
  'Direitos Humanos',
  'Direito Administrativo',
  'Direito Penal Militar',
  'Português',
  'Informática',
  'Matemática',
  'Geografia',
  'Atualidades',
  'História'
];

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  'Direito Constitucional': 'bg-blue-100 text-blue-800 border-blue-200',
  'Direito Penal': 'bg-red-100 text-red-800 border-red-200',
  'Direito Penal Especial': 'bg-purple-100 text-purple-800 border-purple-200',
  'Legislação Penal Especial': 'bg-green-100 text-green-800 border-green-200',
  'Direitos Humanos': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Direito Administrativo': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Direito Penal Militar': 'bg-pink-100 text-pink-800 border-pink-200',
  'Português': 'bg-teal-100 text-teal-800 border-teal-200',
  'Informática': 'bg-orange-100 text-orange-800 border-orange-200',
  'Matemática': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Geografia': 'bg-amber-100 text-amber-800 border-amber-200',
  'Atualidades': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'História': 'bg-lime-100 text-lime-800 border-lime-200'
};