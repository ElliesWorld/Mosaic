import { render, screen } from '@testing-library/react'
import App from '../src/interface/app'

describe('app', () => {
  it('renders Mosaic title', () => {
    render(<app />)
    const titleElement = screen.getByText(/Mosaic/i)
    expect(titleElement).toBeInTheDocument()
  })

  it('renders TodoList by default', () => {
    render(<app />)
    const todoTitle = screen.getByText(/To do list/i)
    expect(todoTitle).toBeInTheDocument()
  })
})