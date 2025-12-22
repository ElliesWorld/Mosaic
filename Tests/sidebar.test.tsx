import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from '../src/Interface/Components/sidebar'

describe('Sidebar Component', () => {
  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all menu items', () => {
    render(<Sidebar activeView="todo" onTabChange={mockOnTabChange} />)
    
    expect(screen.getByTitle('To-Do')).toBeInTheDocument()
    expect(screen.getByTitle('Shopping')).toBeInTheDocument()
    expect(screen.getByTitle('Calendar')).toBeInTheDocument()
    expect(screen.getByTitle('Memory')).toBeInTheDocument()
  })

  it('should call onTabChange when shopping clicked', () => {
    render(<Sidebar activeView="todo" onTabChange={mockOnTabChange} />)
    
    const shoppingButton = screen.getByTitle('Shopping')
    fireEvent.click(shoppingButton)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('shopping')
  })

  it('should call onTabChange when calendar clicked', () => {
    render(<Sidebar activeView="todo" onTabChange={mockOnTabChange} />)
    
    const calendarButton = screen.getByTitle('Calendar')
    fireEvent.click(calendarButton)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('calendar')
  })

  it('should call onTabChange when memory clicked', () => {
    render(<Sidebar activeView="todo" onTabChange={mockOnTabChange} />)
    
    const memoryButton = screen.getByTitle('Memory')
    fireEvent.click(memoryButton)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('memory')
  })

  it('should call onTabChange when todo clicked', () => {
    render(<Sidebar activeView="shopping" onTabChange={mockOnTabChange} />)
    
    const todoButton = screen.getByTitle('To-Do')
    fireEvent.click(todoButton)
    
    expect(mockOnTabChange).toHaveBeenCalledWith('todo')
  })
})