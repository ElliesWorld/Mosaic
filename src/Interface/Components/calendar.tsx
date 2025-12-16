import { useState, useCallback } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { sv } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../Styles/calendar.css'

// Setup the localizer with date-fns
const locales = {
  'sv': sv,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  color?: string
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Submit Report to Teacher',
      start: new Date(2024, 11, 5, 14, 0), // Dec 5, 2024, 2:00 PM
      end: new Date(2024, 11, 5, 15, 0),
      description: 'Important deadline',
      color: '#FF6B9D',
    },
    {
      id: '2',
      title: "Grandma's Birthday",
      start: new Date(2024, 11, 8, 0, 0), // Dec 8, 2024
      end: new Date(2024, 11, 8, 23, 59),
      description: 'Birthday on August 19th',
      color: '#FF6B9D',
    },
  ])

  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = window.prompt('New Event name')
      if (title) {
        setEvents((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            title,
            start,
            end,
            color: '#A8E6CF',
          },
        ])
      }
    },
    []
  )

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    alert(`Event: ${event.title}\n${event.description || ''}`)
  }, [])

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: event.color || '#7EC8E3',
      borderRadius: '8px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '0.85rem',
      padding: '2px 5px',
    }
    return { style }
  }

  return (
    <div className="space-y-4 h-full">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#7EC8E3' }}>
          Calendar
        </h2>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm" style={{ height: 'calc(100vh - 150px)' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>
    </div>
  )
}