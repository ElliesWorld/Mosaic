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
  refreshTasks: () => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all tasks on mount
  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTasks = await taskAPI.getAllTasks()
      
      // Convert date strings to Date objects
      const tasksWithDates = fetchedTasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
      
      setTasks(tasksWithDates)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const newTask = await taskAPI.createTask(task)
      
      // Convert dates
      const taskWithDates = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        createdAt: new Date(newTask.createdAt),
        updatedAt: new Date(newTask.updatedAt),
      }
      
      setTasks(prev => [...prev, taskWithDates])
    } catch (err) {
      console.error('Error adding task:', err)
      setError('Failed to add task')
      throw err
    }
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      setError(null)
      const updatedTask = await taskAPI.updateTask(id, updates)
      
      // Convert dates
      const taskWithDates = {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
      }
      
      setTasks(prev => prev.map(task => task.id === id ? taskWithDates : task))
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task')
      throw err
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null)
      await taskAPI.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('Failed to delete task')
      throw err
    }
  }, [])

  const toggleTaskComplete = useCallback(async (id: string) => {
    try {
      setError(null)
      const updatedTask = await taskAPI.toggleTaskComplete(id)
      
      // Convert dates
      const taskWithDates = {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
      }
      
      setTasks(prev => prev.map(task => task.id === id ? taskWithDates : task))
    } catch (err) {
      console.error('Error toggling task:', err)
      setError('Failed to toggle task')
      throw err
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
      refreshTasks 
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