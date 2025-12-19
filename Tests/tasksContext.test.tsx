import '@testing-library/jest-dom'
import React, { ReactNode } from 'react'
import { renderHook, act } from '@testing-library/react'
import { TasksProvider, useTasks } from '../src/Interface/tasksContext'

const wrapper = ({ children }: { children: ReactNode }) => (
  <TasksProvider>{children}</TasksProvider>
)

describe('TasksContext', () => {
  describe('useTasks hook', () => {
    it('should throw error when used outside provider', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        renderHook(() => useTasks())
      }).toThrow('useTasks must be used within a TasksProvider')
      
      spy.mockRestore()
    })

    it('should provide initial tasks', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      
      expect(result.current.tasks).toHaveLength(3)
      expect(result.current.tasks[0].title).toBe('Contact the Teacher about the report')
    })
  })

  describe('addTask', () => {
    it('should add a new task', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      
      act(() => {
        result.current.addTask({
          title: 'New Task',
          completed: false,
          listType: 'TODO',
          priority: 'NORMAL',
        })
      })
      
      expect(result.current.tasks).toHaveLength(4)
      expect(result.current.tasks[3].title).toBe('New Task')
    })

    it('should add task with due date', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      const dueDate = new Date('2025-01-01')
      
      act(() => {
        result.current.addTask({
          title: 'Task with date',
          completed: false,
          listType: 'CALENDAR',
          priority: 'HIGH',
          dueDate,
        })
      })
      
      const newTask = result.current.tasks[result.current.tasks.length - 1]
      expect(newTask.title).toBe('Task with date')
      expect(newTask.dueDate).toEqual(dueDate)
    })
  })

  describe('updateTask', () => {
    it('should update task properties', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      const taskId = result.current.tasks[0].id
      
      act(() => {
        result.current.updateTask(taskId, {
          title: 'Updated Title',
          priority: 'URGENT',
        })
      })
      
      const updatedTask = result.current.tasks.find(t => t.id === taskId)
      expect(updatedTask?.title).toBe('Updated Title')
      expect(updatedTask?.priority).toBe('URGENT')
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      const taskId = result.current.tasks[0].id
      const initialLength = result.current.tasks.length
      
      act(() => {
        result.current.deleteTask(taskId)
      })
      
      expect(result.current.tasks).toHaveLength(initialLength - 1)
      expect(result.current.tasks.find(t => t.id === taskId)).toBeUndefined()
    })
  })

  describe('toggleTaskComplete', () => {
    it('should toggle task completion status', () => {
      const { result } = renderHook(() => useTasks(), { wrapper })
      const taskId = result.current.tasks[0].id
      const initialStatus = result.current.tasks[0].completed
      
      act(() => {
        result.current.toggleTaskComplete(taskId)
      })
      
      const task = result.current.tasks.find(t => t.id === taskId)
      expect(task?.completed).toBe(!initialStatus)
    })
  })
})