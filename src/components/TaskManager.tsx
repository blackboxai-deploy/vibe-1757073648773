'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { TaskStats } from './TaskStats';
import { TaskList } from './TaskList';
import { useTasks } from '@/hooks/useTasks';

export function TaskManager() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const {
    tasks,
    allTasks,
    isLoading,
    hideCompleted,
    currentFilter,
    searchTerm,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    editTaskTitle,
    setHideCompleted,
    setCurrentFilter,
    setSearchTerm,
    getStats,
    canMoveUp,
    canMoveDown,
    clearAllTasks,
    exportTasks,
    importTasks,
  } = useTasks();

  const handleAddTask = async (title: string, category: any, hasExercise: boolean, exerciseFile?: File) => {
    setIsAddingTask(true);
    try {
      await addTask(title, category, hasExercise, exerciseFile);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleExportTasks = () => {
    const data = exportTasks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tarefas-estudo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTasks = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = e.target?.result as string;
            const success = importTasks(jsonData);
            if (success) {
              alert('Tarefas importadas com sucesso!');
            } else {
              alert('Erro ao importar tarefas. Verifique o formato do arquivo.');
            }
          } catch (error) {
            alert('Erro ao ler o arquivo.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllTasks = () => {
    if (window.confirm('Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita.')) {
      clearAllTasks();
    }
  };

  const handleOpenReadingPlan = () => {
    // Simular abertura do plano de leitura
    alert('Funcionalidade de Plano de Leitura:\n\nEsta função normalmente abriria um PDF com o plano de estudos. No aplicativo real, você pode:\n\n1. Adicionar um PDF ao projeto\n2. Criar uma página dedicada\n3. Integrar com um serviço de armazenamento\n\nPor enquanto, use esta área para consultar seu cronograma de estudos!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600">Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Lista de Tarefas de Estudo
          </h1>
          <p className="text-gray-600">
            Organize seus estudos jurídicos de forma eficiente
          </p>
        </div>

        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} isLoading={isAddingTask} />

        {/* Filters and Stats */}
        <TaskFilters
          currentFilter={currentFilter}
          searchTerm={searchTerm}
          hideCompleted={hideCompleted}
          onFilterChange={setCurrentFilter}
          onSearchChange={setSearchTerm}
          onToggleHideCompleted={() => setHideCompleted(!hideCompleted)}
        />

        <TaskStats stats={getStats()} />

        {/* Task List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl text-gray-700">
                📋 Suas Tarefas
              </CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenReadingPlan}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  📖 Plano de Leitura
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportTasks}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  disabled={allTasks.length === 0}
                >
                  📤 Exportar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportTasks}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                >
                  📥 Importar
                </Button>
                
                {allTasks.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllTasks}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  >
                    🗑️ Limpar Tudo
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <TaskList
              tasks={tasks}
              allTasks={allTasks}
              onToggleCompletion={toggleTaskCompletion}
              onDelete={deleteTask}
              onEdit={editTaskTitle}
              onMoveUp={(taskId) => moveTask(taskId, 'up')}
              onMoveDown={(taskId) => moveTask(taskId, 'down')}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>💡 Dica: Clique duas vezes em uma tarefa para editá-la rapidamente</p>
        </div>
      </div>
    </div>
  );
}