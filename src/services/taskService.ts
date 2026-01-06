import type { Task } from '@types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface CreateTaskInput {
  title: string
  description?: string
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW'
  completed?: boolean
  dueDate?: Date
  listType: 'TODO' | 'SHOPPING' | 'CALENDAR'
}

interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW'
  completed?: boolean
  dueDate?: Date
  listType?: 'TODO' | 'SHOPPING' | 'CALENDAR'
}

export const taskAPI = {
  // Get all tasks (optionally filter by listType)
  async getAllTasks(listType?: 'TODO' | 'SHOPPING' | 'CALENDAR'): Promise<Task[]> {
    const url = listType 
      ? `${API_BASE_URL}/api/tasks?listType=${listType}`
      : `${API_BASE_URL}/api/tasks`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch tasks')
    }
    return response.json()
  },

  // Get single task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch task')
    }
    return response.json()
  },

  // Create new task
  async createTask(task: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create task')
    }
    return response.json()
  },

  // Update task
  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update task')
    }
    return response.json()
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete task')
    }
  },

  // Toggle task completion
  async toggleTaskComplete(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    })
    
    if (!response.ok) {
      throw new Error('Failed to toggle task')
    }
    return response.json()
  },
}