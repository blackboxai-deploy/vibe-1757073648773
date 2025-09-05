'use client';

import { Card } from '@/components/ui/card';
import { TaskStats as TaskStatsType } from '@/types/task';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <h3 className="font-bold text-sm text-blue-900 mb-1">Total</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
      </Card>
      
      <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <h3 className="font-bold text-sm text-yellow-900 mb-1">Pendentes</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
      </Card>
      
      <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <h3 className="font-bold text-sm text-green-900 mb-1">Concluídas</h3>
        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
      </Card>
      
      <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <h3 className="font-bold text-sm text-purple-900 mb-1">Progresso</h3>
        <p className="text-2xl font-bold text-purple-600">{stats.progress}%</p>
        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </Card>
    </div>
  );
}