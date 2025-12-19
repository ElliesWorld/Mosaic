import React, { createContext, useContext, useState, useCallback } from 'react'

export interface Task {
  id: string
  title: string
  description?: string
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW'
  completed: boolean
  dueDate?: Date
  listType: 'TODO' | 'SHOPPING' | 'CALENDAR'
  createdAt: Date
  updatedAt: Date
}

interface TasksContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Contact the Teacher about the report',
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
      title: 'Call Dad',
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
      description: 'Birthday is on August 19th!',
      priority: 'URGENT',
      completed: false,
      dueDate: new Date('2024-12-08'),
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
    ))
  }, [])

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskComplete }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}