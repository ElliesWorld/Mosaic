import { Star, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Task } from '@types/index'

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'URGENT':
        return 'text-priority-urgent fill-priority-urgent'
      case 'MEDIUM':
        return 'text-priority-medium fill-priority-medium'
      default:
        return 'text-priority-normal fill-priority-normal'
    }
  }

  return (
    <div className={`task-item relative ${task.completed ? 'opacity-50' : ''}`}>
      {/* Urgent Corner Indicator */}
      {task.priority === 'URGENT' && !task.completed && (
        <div className="urgent-corner" />
      )}

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 cursor-pointer"
          style={{ 
            accentColor: '#A8E6CF',
          }}
        />

        {/* Priority Star */}
        <Star className={`priority-star mt-0.5 flex-shrink-0 ${getPriorityColor()}`} />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-600 mt-0.5">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-xs font-medium mt-0.5" style={{ color: '#1E40AF' }}>
              Due: {format(task.dueDate, 'MMM d, yyyy')}
            </p>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 hover:bg-red-100/70 rounded-lg transition-colors text-gray-400 hover:text-red-600 flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}