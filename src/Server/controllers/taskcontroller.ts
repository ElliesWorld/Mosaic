import { Request, Response } from 'express'
import { PrismaClient } from '../../../generated/prisma/index.js'

const prisma = new PrismaClient()

export const taskController = {
  // Get all tasks
  getAllTasks: async (req: Request, res: Response) => {
    try {
      const { listType } = req.query
      
      const tasks = await prisma.task.findMany({
        where: listType ? { listType: listType as string } : undefined,
        orderBy: { createdAt: 'desc' },
      })
      
      res.json(tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      res.status(500).json({ error: 'Failed to fetch tasks' })
    }
  },

  // Get task by ID
  getTaskById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const task = await prisma.task.findUnique({
        where: { id },
      })
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }
      
      res.json(task)
    } catch (error) {
      console.error('Error fetching task:', error)
      res.status(500).json({ error: 'Failed to fetch task' })
    }
  },

  // Create new task
  createTask: async (req: Request, res: Response) => {
    try {
      const { title, description, priority, completed, dueDate, listType } = req.body
      
      if (!title || !listType) {
        return res.status(400).json({ error: 'Title and listType are required' })
      }
      
      const task = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          completed: completed ?? false,
          dueDate: dueDate ? new Date(dueDate) : null,
          listType,
        },
      })
      
      res.status(201).json(task)
    } catch (error) {
      console.error('Error creating task:', error)
      res.status(500).json({ error: 'Failed to create task' })
    }
  },

  // Update task
  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { title, description, priority, completed, dueDate, listType } = req.body
      
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(priority !== undefined && { priority }),
          ...(completed !== undefined && { completed }),
          ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
          ...(listType !== undefined && { listType }),
        },
      })
      
      res.json(task)
    } catch (error) {
      console.error('Error updating task:', error)
      res.status(500).json({ error: 'Failed to update task' })
    }
  },

  // Delete task
  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      await prisma.task.delete({
        where: { id },
      })
      
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting task:', error)
      res.status(500).json({ error: 'Failed to delete task' })
    }
  },

  // Toggle task completion
  toggleTaskComplete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      
      const task = await prisma.task.findUnique({ where: { id } })
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }
      
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { completed: !task.completed },
      })
      
      res.json(updatedTask)
    } catch (error) {
      console.error('Error toggling task:', error)
      res.status(500).json({ error: 'Failed to toggle task completion' })
    }
  },
}