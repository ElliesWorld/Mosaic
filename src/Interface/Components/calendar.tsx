import { useState, useCallback } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { sv } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../../Styles/calendar.css'
import { useTasks } from '../tasksContext'

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
  const { tasks, addTask, deleteTask } = useTasks()

  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())

  // Convert tasks with due dates to calendar events
  const events: CalendarEvent[] = tasks
    .filter(task => task.dueDate)
    .map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate!,
      end: task.dueDate!,
      description: task.description,
      color: task.priority === 'URGENT' ? '#FF6B9D' : 
             task.priority === 'HIGH' ? '#FFB347' :
             task.priority === 'MEDIUM' ? '#FFD93D' : '#A8E6CF',
    }))

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = window.prompt('New Event name')
      if (title) {
        addTask({
          title,
          completed: false,
          dueDate: start,
          listType: 'CALENDAR',
          priority: 'NORMAL',
        })
      }
    },
    [addTask]
  )

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const task = tasks.find(t => t.id === event.id)
    if (!task) return

    const message = task.description 
      ? `${event.title}\n\n${task.description}\n\nDelete this event?`
      : `${event.title}\n\nDelete this event?`
    
    const shouldDelete = window.confirm(message)
    if (shouldDelete) {
      deleteTask(event.id)
    }
  }, [tasks, deleteTask])

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => {
    const task = tasks.find(t => t.id === event.id)
    const style = {
      backgroundColor: event.color || '#7EC8E3',
      borderRadius: '8px',
      opacity: task?.completed ? 0.5 : 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '0.85rem',
      padding: '2px 5px',
      textDecoration: task?.completed ? 'line-through' : 'none',
    }
    return { style }
  }

  return (
    <div className="space-y-4 h-full">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#7EC8E3' }}>
          Calendar
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {tasks.filter(t => t.dueDate).length} events scheduled
        </p>
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