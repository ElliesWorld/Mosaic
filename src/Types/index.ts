export type Priority = 'NORMAL' | 'MEDIUM' | 'URGENT'
export type ListType = 'TODO' | 'SHOPPING' | 'FOOD_SHOPPING' | 'CUSTOM'

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  completed: boolean
  dueDate?: Date
  listType: ListType
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime?: Date
  color: string
  isUrgent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reminder {
  id: string
  reminderTime: Date
  message: string
  triggered: boolean
  taskId?: string
  eventId?: string
  createdAt: Date
}

export interface Memory {
  id: string
  key: string
  value: string
  category?: string
  createdAt: Date
  updatedAt: Date
}

export type TabType = 'todo' | 'shopping' | 'calendar' | 'memory'