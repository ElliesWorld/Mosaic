import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShoppingList from '../src/Interface/Components/shoppingList'

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

describe('ShoppingList Component', () => {
  it('should render shopping list title', () => {
    render(<ShoppingList />)
    expect(screen.getByText('Shopping List')).toBeInTheDocument()
  })

  it('should render initial items', () => {
    render(<ShoppingList />)
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Apples')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
  })

  it('should add new item', async () => {
    render(<ShoppingList />)
    
    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(input, { target: { value: 'Eggs' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Eggs')).toBeInTheDocument()
    })
  })

  it('should add item with quantity', async () => {
    render(<ShoppingList />)
    
    const nameInput = screen.getByPlaceholderText('Add item...')
    const quantityInput = screen.getByPlaceholderText('Quantity (optional)')
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(nameInput, { target: { value: 'Tomatoes' } })
    fireEvent.change(quantityInput, { target: { value: '2 kg' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Tomatoes')).toBeInTheDocument()
      expect(screen.getByText('2 kg')).toBeInTheDocument()
    })
  })

  it('should auto-categorize dairy items', async () => {
    render(<ShoppingList />)
    
    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(input, { target: { value: 'Cheese' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Dairy/)).toBeInTheDocument()
    })
  })

  it('should auto-categorize fruits', async () => {
    render(<ShoppingList />)
    
    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(input, { target: { value: 'Banana' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Fruits & Vegetables/)).toBeInTheDocument()
    })
  })

  it('should auto-categorize eggs as dairy', async () => {
    render(<ShoppingList />)
    
    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(input, { target: { value: 'Eggs' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Dairy/)).toBeInTheDocument()
    })
  })

  it('should show item count', () => {
    render(<ShoppingList />)
    expect(screen.getByText(/left/i)).toBeInTheDocument()
  })

  it('should clear input after adding item', async () => {
    render(<ShoppingList />)
    
    const input = screen.getByPlaceholderText('Add item...') as HTMLInputElement
    const addButton = screen.getByRole('button', { name: /add/i })
    
    fireEvent.change(input, { target: { value: 'Test Item' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})