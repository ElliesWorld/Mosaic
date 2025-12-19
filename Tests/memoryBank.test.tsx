import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MemoryBank from '../src/Interface/Components/memoryBank'

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

// Mock date-fns format
jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Dec 5, 2024'),
}))

describe('MemoryBank Component', () => {
  it('should render memory bank title', () => {
    render(<MemoryBank />)
    expect(screen.getByText('Memory Bank')).toBeInTheDocument()
  })

  it('should render initial memories', () => {
    render(<MemoryBank />)
    expect(screen.getByText('Build a productivity app with voice features')).toBeInTheDocument()
    expect(screen.getByText('Remember to appreciate the small moments in life')).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<MemoryBank />)
    const searchInput = screen.getByPlaceholderText('Search memories...')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render textarea for new memory', () => {
    render(<MemoryBank />)
    const textarea = screen.getByPlaceholderText('Write your quick note...')
    expect(textarea).toBeInTheDocument()
  })

  it('should add new memory', async () => {
    render(<MemoryBank />)
    
    const textarea = screen.getByPlaceholderText('Write your quick note...')
    const addButton = screen.getByRole('button', { name: /add memory/i })
    
    fireEvent.change(textarea, { target: { value: 'New memory note' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('New memory note')).toBeInTheDocument()
    })
  })

  it('should clear textarea after adding memory', async () => {
    render(<MemoryBank />)
    
    const textarea = screen.getByPlaceholderText('Write your quick note...') as HTMLTextAreaElement
    const addButton = screen.getByRole('button', { name: /add memory/i })
    
    fireEvent.change(textarea, { target: { value: 'Test memory' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(textarea.value).toBe('')
    })
  })

  it('should pin memory', async () => {
    render(<MemoryBank />)
    
    const pinButtons = screen.getAllByTitle('Pin')
    fireEvent.click(pinButtons[0])
    
    await waitFor(() => {
      expect(screen.getAllByText(/Pinned/)).toHaveLength(2)
    })
  })

  it('should delete memory', async () => {
    render(<MemoryBank />)
    
    const deleteButtons = screen.getAllByTitle('Delete')
    const memoryText = 'Build a productivity app with voice features'
    
    expect(screen.getByText(memoryText)).toBeInTheDocument()
    
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      expect(screen.queryByText(memoryText)).not.toBeInTheDocument()
    })
  })

  it('should filter memories by search query', async () => {
    render(<MemoryBank />)
    
    const searchInput = screen.getByPlaceholderText('Search memories...')
    
    fireEvent.change(searchInput, { target: { value: 'productivity' } })
    
    await waitFor(() => {
      expect(screen.getByText('Build a productivity app with voice features')).toBeInTheDocument()
      expect(screen.queryByText('Remember to appreciate the small moments in life')).not.toBeInTheDocument()
    })
  })

  it('should display memory count', () => {
    render(<MemoryBank />)
    expect(screen.getByText(/2 memories/)).toBeInTheDocument()
  })

  it('should display pinned count', () => {
    render(<MemoryBank />)
    expect(screen.getByText(/1 pinned/)).toBeInTheDocument()
  })
})