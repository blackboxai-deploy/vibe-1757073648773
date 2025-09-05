'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, CATEGORY_COLORS } from '@/types/task';
import { PdfViewer } from './PdfViewer';

interface TaskItemProps {
  task: Task;
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggleCompletion: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onEdit: (taskId: number, newTitle: string) => void;
  onMoveUp: (taskId: number) => void;
  onMoveDown: (taskId: number) => void;
}

export function TaskItem({
  task,
  index,
  canMoveUp,
  canMoveDown,
  onToggleCompletion,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing && editTitle.trim() !== task.title) {
      onEdit(task.id, editTitle.trim());
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      task.completed 
        ? 'bg-gray-50 border-gray-200 opacity-75' 
        : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left section - Index and content */}
        <div className="flex items-center flex-grow gap-3">
          {/* Task index */}
          <div className="text-sm font-medium text-gray-500 min-w-6">
            {index + 1}.
          </div>

          {/* Task content */}
          <div className="flex-grow" onDoubleClick={handleDoubleClick}>
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={handleKeyPress}
                className="font-medium"
                autoFocus
              />
            ) : (
              <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${CATEGORY_COLORS[task.category]}`}
              >
                {task.category}
              </Badge>
              
              {task.hasExercise && task.exerciseFile && (
                <PdfViewer exerciseFile={task.exerciseFile} taskTitle={task.title} />
              )}
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-1 ml-4">
          {/* Move buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveUp(task.id)}
            disabled={!canMoveUp}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Mover para cima"
          >
            ⬆️
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveDown(task.id)}
            disabled={!canMoveDown}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Mover para baixo"
          >
            ⬇️
          </Button>

          {/* Complete toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleCompletion(task.id)}
            className={`h-8 w-8 p-0 ${
              task.completed 
                ? 'text-gray-500 hover:bg-gray-100' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {task.completed ? '↩️' : '✅'}
          </Button>

          {/* Edit button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
            title="Editar tarefa"
          >
            ✏️
          </Button>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                onDelete(task.id);
              }
            }}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
            title="Excluir tarefa"
          >
            🗑️
          </Button>
        </div>
      </div>
    </Card>
  );
}