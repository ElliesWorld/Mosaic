import { useState } from 'react'
import { Plus } from 'lucide-react'
import TaskItem from './taskItem'
import type { Task } from '@types/index'

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Contact the Teacher to submit the report',
      description: '',
      priority: 'URGENT',
      completed: false,
      dueDate: new Date('2024-12-05'),
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Eat Food',
      description: '',
      priority: 'MEDIUM',
      completed: false,
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Buy gift to Grandma on bday',
      description: 'Birthday is on December 8th!',
      priority: 'URGENT',
      completed: false,
      dueDate: new Date('2024-12-08'),
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      priority: 'NORMAL',
      completed: false,
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle('')
  }

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#7EC8E3' }}>To do list</h2>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-blue-200/50 focus:outline-none focus:ring-2 focus:ring-[#A8E6CF]/50 bg-white/70 backdrop-blur-sm"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-1.5 font-medium shadow-sm hover:shadow"
          style={{ backgroundColor: '#A8E6CF' }}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}