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

  // NEW TESTS BELOW

  it('should not add empty task when clicking button', () => {
    renderWithProvider(<TodoList />)
    
    const addButton = screen.getByRole('button', { name: /^Add$/i })
    const initialTasks = screen.getAllByTestId(/task-/)
    const initialCount = initialTasks.length
    
    fireEvent.click(addButton)
    
    const tasksAfter = screen.getAllByTestId(/task-/)
    expect(tasksAfter.length).toBe(initialCount)
  })

  it('should not add task when pressing Enter with empty input', () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const initialTasks = screen.getAllByTestId(/task-/)
    const initialCount = initialTasks.length
    
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    
    const tasksAfter = screen.getAllByTestId(/task-/)
    expect(tasksAfter.length).toBe(initialCount)
  })

  it('should hide date picker when clicking calendar button again', async () => {
    renderWithProvider(<TodoList />)
    
    const calendarButton = screen.getByTitle('Add due date')
    
    // Show date picker
    fireEvent.click(calendarButton)
    let dateInput = document.querySelector('input[type="date"]')
    expect(dateInput).toBeInTheDocument()
    
    // Hide date picker
    fireEvent.click(calendarButton)
    await waitFor(() => {
      dateInput = document.querySelector('input[type="date"]')
      expect(dateInput).not.toBeInTheDocument()
    })
  })

  it('should add task with selected due date', async () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const calendarButton = screen.getByTitle('Add due date')
    const addButton = screen.getByRole('button', { name: /^Add$/i })
    
    // Open date picker and select date
    fireEvent.click(calendarButton)
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } })
    
    // Add task
    fireEvent.change(input, { target: { value: 'Christmas task' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Christmas task')).toBeInTheDocument()
    })
  })

  it('should render voice button when voice is supported', () => {
    renderWithProvider(<TodoList />)
    const voiceButton = screen.getByTitle('Start voice input')
    expect(voiceButton).toBeInTheDocument()
  })

  it('should not add whitespace-only task', () => {
    renderWithProvider(<TodoList />)
    
    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: /^Add$/i })
    const initialTasks = screen.getAllByTestId(/task-/)
    const initialCount = initialTasks.length
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(addButton)
    
    const tasksAfter = screen.getAllByTestId(/task-/)
    expect(tasksAfter.length).toBe(initialCount)
  })
})