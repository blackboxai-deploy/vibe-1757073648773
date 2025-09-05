'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { TASK_CATEGORIES, TaskCategory } from '@/types/task';


interface TaskFormProps {
  onAddTask: (title: string, category: TaskCategory, hasExercise: boolean, exerciseFile?: File) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ onAddTask, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Direito Constitucional');
  const [hasExercise, setHasExercise] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    try {
      await onAddTask(title, category, hasExercise, selectedFile || undefined);
      
      // Reset form
      setTitle('');
      setCategory('Direito Constitucional');
      setHasExercise(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Por favor, selecione apenas arquivos PDF.');
      e.target.value = '';
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Category Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da tarefa"
            className="flex-grow"
            maxLength={100}
            required
          />
          
          <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exercise Checkbox and File Upload */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasExercise"
              checked={hasExercise}
              onCheckedChange={(checked) => {
                setHasExercise(checked as boolean);
                if (!checked) {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }}
            />
            <label htmlFor="hasExercise" className="text-sm font-medium">
              Esta tarefa possui exercícios em PDF
            </label>
          </div>

          {hasExercise && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleChooseFile}
                  className="flex items-center gap-2"
                >
                  📁
                  Escolher PDF
                </Button>
                
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    📄
                    <span className="max-w-32 truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-auto p-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              
              {hasExercise && !selectedFile && (
                <p className="text-xs text-gray-500">
                  Nenhum arquivo selecionado. Apenas arquivos PDF são aceitos.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={!title.trim() || isLoading}
        >
          ➕
          {isLoading ? 'Adicionando...' : 'Adicionar Tarefa'}
        </Button>
      </form>
    </Card>
  );
}