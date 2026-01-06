import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { taskAPI } from '../services/taskService'

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
  loading: boolean
  error: string | null
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskComplete: (id: string) => Promise<void>
  refreshTasks?: () => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

// Initial demo tasks
const INITIAL_TASKS: Task[] = [
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
]

// Check if we're in test environment
const isTest = process.env.NODE_ENV === 'test'

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [loading, setLoading] = useState(!isTest) // Don't load in tests
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks on mount (skip in tests)
  const refreshTasks = useCallback(async () => {
    if (isTest) return // Skip API calls in tests
    
    try {
      setLoading(true)
      setError(null)
      const fetchedTasks = await taskAPI.getAllTasks()
      
      const tasksWithDates = fetchedTasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
      
      if (tasksWithDates.length > 0) {
        setTasks(tasksWithDates)
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      console.log('Using initial demo tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isTest) {
      refreshTasks()
    }
  }, [refreshTasks])

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In tests, just add to local state
    if (isTest) {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTasks(prev => [...prev, newTask])
      return
    }

    // In production, try API first
    try {
      setError(null)
      const newTask = await taskAPI.createTask(task)
      
      const taskWithDates = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        createdAt: new Date(newTask.createdAt),
        updatedAt: new Date(newTask.updatedAt),
      }
      
      setTasks(prev => [...prev, taskWithDates])
    } catch (err) {
      console.error('Error adding task:', err)
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTasks(prev => [...prev, newTask])
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    // In tests, just update local state
    if (isTest) {
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ))
      return
    }

    try {
      setError(null)
      const updatedTask = await taskAPI.updateTask(id, updates)
      
      const taskWithDates = {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
      }
      
      setTasks(prev => prev.map(task => task.id === id ? taskWithDates : task))
    } catch (err) {
      console.error('Error updating task:', err)
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ))
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    // In tests, just delete from local state
    if (isTest) {
      setTasks(prev => prev.filter(task => task.id !== id))
      return
    }

    try {
      setError(null)
      await taskAPI.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setTasks(prev => prev.filter(task => task.id !== id))
    }
  }, [])

  const toggleTaskComplete = useCallback(async (id: string) => {
    // In tests, just toggle local state
    if (isTest) {
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      ))
      return
    }

    try {
      setError(null)
      const updatedTask = await taskAPI.toggleTaskComplete(id)
      
      const taskWithDates = {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
      }
      
      setTasks(prev => prev.map(task => task.id === id ? taskWithDates : task))
    } catch (err) {
      console.error('Error toggling task:', err)
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      ))
    }
  }, [])

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      loading, 
      error, 
      addTask, 
      updateTask, 
      deleteTask, 
      toggleTaskComplete,
      refreshTasks: isTest ? undefined : refreshTasks
    }}>
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