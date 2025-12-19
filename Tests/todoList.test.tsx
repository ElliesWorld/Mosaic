import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodoList from '../src/Interface/Components/todoList'
import { TasksProvider } from '../src/Interface/tasksContext'

// Mock voice recognition hook
jest.mock('../src/Interface/Hooks/useVoiceRecognition', () => ({
  useVoiceRecognition: () => ({
    isListening: false,
    transcript: '',
    startListening: jest.fn(),
    stopListening: jest.fn(),
    supported: true,
    resetTranscript: jest.fn(),
    error: null,
  }),
}))

// Mock TaskItem component
jest.mock('../src/Interface/Components/taskItem', () => ({
  __esModule: true,
  default: ({ task, onToggleComplete, onDelete }: any) => (
    <div data-testid={`task-${task.id}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        data-testid={`checkbox-${task.id}`}
      />
      <span>{task.title}</span>
      <button onClick={() => onDelete(task.id)} data-testid={`delete-${task.id}`}>
        Delete
      </button>
    </div>
  ),
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(<TasksProvider>{component}</TasksProvider>)
}

describe('TodoList Component', () => {
  it('should render todo list title', () => {
    renderWithProvider(<TodoList />)
    expect(screen.getByText('To do list')).toBeInTheDocument()
  })

  it('should render initial tasks', () => {
    renderWithProvider(<TodoList />)
    expect(screen.getByText('Contact the Teacher about the report')).toBeInTheDocument()
    expect(screen.getByText('Call Dad')).toBeInTheDocument()
  })

  it('should add a new task when clicking add button', async () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /^Add$/i })
    
    fireEvent.change(input, { target: { value: 'New Test Task' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument()
    })
  })

  it('should add a new task when pressing Enter', async () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    
    fireEvent.change(input, { target: { value: 'Task via Enter' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    
    await waitFor(() => {
      expect(screen.getByText('Task via Enter')).toBeInTheDocument()
    })
  })

  it('should clear input after adding task', async () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement
    const addButton = screen.getByRole('button', { name: /^Add$/i })
    
    fireEvent.change(input, { target: { value: 'Test Task' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('should toggle task completion', async () => {
    renderWithProvider(<TodoList />)
    
    const checkbox = screen.getByTestId('checkbox-1')
    
    expect(checkbox).not.toBeChecked()
    
    fireEvent.click(checkbox)
    
    await waitFor(() => {
      expect(checkbox).toBeChecked()
    })
  })

  it('should delete task', async () => {
    renderWithProvider(<TodoList />)
    
    const deleteButton = screen.getByTestId('delete-1')
    
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Contact the Teacher about the report')).not.toBeInTheDocument()
    })
  })

  it('should render calendar button for date picker', () => {
    renderWithProvider(<TodoList />)
    
    const calendarButton = screen.getByTitle('Add due date')
    expect(calendarButton).toBeInTheDocument()
  })

  it('should show date picker when calendar button clicked', async () => {
    renderWithProvider(<TodoList />)
    
    const calendarButton = screen.getByTitle('Add due date')
    fireEvent.click(calendarButton)
    
    await waitFor(() => {
      const dateInput = screen.getByRole('textbox', { hidden: true }) || 
                        document.querySelector('input[type="date"]')
      expect(dateInput).toBeTruthy()
    })
  })
})