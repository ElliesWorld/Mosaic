import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../src/Interface/app'

describe('App', () => {
  it('renders Mosaic title', () => {
    render(<App />)
    const titleElement = screen.getByText(/Mosaic/i)
    expect(titleElement).toBeInTheDocument()
  })

  it('renders TodoList by default', () => {
    render(<App />)
    const todoTitle = screen.getByText(/To do list/i)
    expect(todoTitle).toBeInTheDocument()
  })
})