'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FilterType } from '@/types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  searchTerm: string;
  hideCompleted: boolean;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (search: string) => void;
  onToggleHideCompleted: () => void;
}

export function TaskFilters({
  currentFilter,
  searchTerm,
  hideCompleted,
  onFilterChange,
  onSearchChange,
  onToggleHideCompleted,
}: TaskFiltersProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            onClick={() => onFilterChange('all')}
            size="sm"
          >
            🔍 Mostrar Todas
          </Button>
          
          <Button
            variant={currentFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => onFilterChange('pending')}
            size="sm"
          >
            ⏳ Apenas Pendentes
          </Button>
          
          <Button
            variant={hideCompleted ? 'default' : 'outline'}
            onClick={onToggleHideCompleted}
            size="sm"
          >
            {hideCompleted ? '👁️ Mostrar Concluídas' : '🙈 Ocultar Concluídas'}
          </Button>
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔎 Buscar tarefas..."
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
}