'use client';

import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  allTasks: Task[];
  onToggleCompletion: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (taskId: number, newTitle: string) => void;
  onMoveUp: (taskId: number) => void;
  onMoveDown: (taskId: number) => void;
  canMoveUp: (taskId: number) => boolean;
  canMoveDown: (taskId: number) => boolean;
}

export function TaskList({
  tasks,
  allTasks,
  onToggleCompletion,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Adicione uma nova tarefa ou ajuste os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          canMoveUp={canMoveUp(task.id)}
          canMoveDown={canMoveDown(task.id)}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          onEdit={onEdit}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
      
      {tasks.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          {tasks.length === 1 ? '1 tarefa' : `${tasks.length} tarefas`} 
          {' '}encontrada{tasks.length !== 1 ? 's' : ''}
          {allTasks.length !== tasks.length && ` de ${allTasks.length} total`}
        </div>
      )}
    </div>
  );
}