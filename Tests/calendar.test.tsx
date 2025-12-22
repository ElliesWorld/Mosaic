import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import Calendar from '../src/Interface/Components/calendar'
import { TasksProvider } from '../src/Interface/tasksContext'

// Mock react-big-calendar
jest.mock('react-big-calendar', () => ({
  Calendar: ({ events }: any) => (
    <div data-testid="calendar">
      {events.map((event: any) => (
        <div key={event.id} data-testid={`event-${event.id}`}>
          {event.title}
        </div>
      ))}
    </div>
  ),
  dateFnsLocalizer: jest.fn(),
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(<TasksProvider>{component}</TasksProvider>)
}

describe('Calendar Component', () => {
  it('should render calendar', () => {
    renderWithProvider(<Calendar />)
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
  })

  it('should display events from tasks with due dates', () => {
    renderWithProvider(<Calendar />)
    // Initial tasks with dates from TasksContext
    expect(screen.getByText('Buy gift to Grandma on bday')).toBeInTheDocument()
  })

  it('should render title', () => {
    renderWithProvider(<Calendar />)
    expect(screen.getByText('Calendar')).toBeInTheDocument()
  })
})