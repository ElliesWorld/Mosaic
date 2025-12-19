import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskItem from '../src/Interface/Components/taskItem'
import type { Task } from '../src/Interface/tasksContext'

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    completed: false,
    listType: 'TODO',
    priority: 'NORMAL',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockOnToggle = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render task title', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('should show unchecked checkbox for incomplete task', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('should show checked checkbox for completed task', () => {
    const completedTask = { ...mockTask, completed: true }
    render(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('should call onToggleComplete when checkbox clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('should call onDelete when delete button clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons[0] // First button is delete button
    fireEvent.click(deleteButton)
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should display task with description', () => {
    const taskWithDescription = { ...mockTask, description: 'Task details' }
    render(
      <TaskItem
        task={taskWithDescription}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('Task details')).toBeInTheDocument()
  })

  it('should render urgent tasks with special styling', () => {
    const urgentTask = { ...mockTask, priority: 'URGENT' as const }
    const { container } = render(
      <TaskItem
        task={urgentTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    // Check for urgent corner indicator
    expect(container.querySelector('.urgent-corner')).toBeInTheDocument()
  })

  it('should render high priority tasks', () => {
    const highTask = { ...mockTask, priority: 'HIGH' as const }
    render(
      <TaskItem
        task={highTask}
        onToggleComplete={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
})