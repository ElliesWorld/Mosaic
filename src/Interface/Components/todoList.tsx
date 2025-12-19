import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Mic, MicOff, Calendar } from 'lucide-react'
import TaskItem from './taskItem'
import { useVoiceRecognition } from '../Hooks/useVoiceRecognition'
import { useTasks } from '../tasksContext'

export default function TodoList() {
  const { tasks: allTasks, addTask, toggleTaskComplete, deleteTask } = useTasks()
  
  // Filter to show TODO and CALENDAR tasks
  const tasks = allTasks.filter(task => task.listType === 'TODO' || task.listType === 'CALENDAR')

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript, error } = useVoiceRecognition()
  const wasListeningRef = useRef(false)
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showListening, setShowListening] = useState(false)
  const listeningDelayRef = useRef<NodeJS.Timeout | null>(null)

  const handleAddTask = useCallback((title?: string) => {
    const taskTitle = title || newTaskTitle
    if (!taskTitle.trim()) return

    console.log('➕ Adding:', taskTitle)
    addTask({
      title: taskTitle,
      priority: 'NORMAL',
      completed: false,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      listType: 'TODO',
    })
    setNewTaskTitle('')
    setNewTaskDueDate('')
    setShowDatePicker(false)
  }, [newTaskTitle, newTaskDueDate, addTask])

  // Delay showing "Listening..." message by 150ms
  useEffect(() => {
    if (isListening) {
      if (listeningDelayRef.current) {
        clearTimeout(listeningDelayRef.current)
      }
      
      listeningDelayRef.current = setTimeout(() => {
        setShowListening(true)
      }, 150)
    } else {
      if (listeningDelayRef.current) {
        clearTimeout(listeningDelayRef.current)
      }
      setShowListening(false)
    }

    return () => {
      if (listeningDelayRef.current) {
        clearTimeout(listeningDelayRef.current)
      }
    }
  }, [isListening])

  // Auto-stop after getting transcript
  useEffect(() => {
    if (isListening && transcript) {
      console.log('📝 Got transcript, will auto-stop in 0.5 seconds...')
      
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
      
      autoStopTimeoutRef.current = setTimeout(() => {
        if (isListening) {
          console.log('⏹️ Auto-stopping...')
          stopListening()
        }
      }, 500)
    }
    
    return () => {
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
    }
  }, [transcript, isListening, stopListening])

  // Process transcript when listening stops
  useEffect(() => {
    if (wasListeningRef.current && !isListening && transcript) {
      console.log('🎯 Processing transcript:', transcript)
      
      let text = transcript.trim()
      
      // Remove trigger words
      const triggers = ['add task', 'new task', 'add', 'create']
      for (const trigger of triggers) {
        if (text.toLowerCase().startsWith(trigger)) {
          text = text.substring(trigger.length).trim()
          break
        }
      }
      
      if (text) {
        text = text.charAt(0).toUpperCase() + text.slice(1)
        console.log('✅ Adding task:', text)
        handleAddTask(text)
        
        setTimeout(() => resetTranscript(), 1000)
      }
    }
    
    wasListeningRef.current = isListening
  }, [isListening, transcript, handleAddTask, resetTranscript])

  const handleToggleComplete = (id: string) => {
    toggleTaskComplete(id)
  }

  const handleDeleteTask = (id: string) => {
    deleteTask(id)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#7EC8E3' }}>To do list</h2>
      </div>

      <div className="space-y-2">
        {/* Task Title Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder={showListening ? "Listening..." : "Add a new task..."}
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-blue-200/50 focus:outline-none focus:ring-2 focus:ring-[#A8E6CF]/50 bg-white/70 backdrop-blur-sm"
            disabled={isListening}
          />
          
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${
              showDatePicker || newTaskDueDate
                ? 'bg-purple-400 text-white' 
                : 'bg-white/70 text-gray-600 hover:bg-purple-100'
            }`}
            title="Add due date"
          >
            <Calendar className="w-4 h-4" />
          </button>
          
          {supported && (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-red-400 animate-pulse cursor-not-allowed' 
                  : 'bg-blue-400 hover:bg-blue-500'
              }`}
              title={isListening ? 'Recording...' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
            </button>
          )}
          
          <button
            onClick={() => handleAddTask()}
            className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-1.5 font-medium shadow-sm hover:shadow"
            style={{ backgroundColor: '#A8E6CF' }}
            disabled={isListening}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Date Picker (collapsible) */}
        {showDatePicker && (
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50/70 backdrop-blur-sm rounded-xl">
            <Calendar className="w-4 h-4 text-purple-600" />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="flex-1 px-2 py-1 text-sm rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
            />
            {newTaskDueDate && (
              <button
                onClick={() => {
                  setNewTaskDueDate('')
                  setShowDatePicker(false)
                }}
                className="text-xs text-purple-600 hover:text-purple-800"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {showListening && (
        <div className="text-xs text-center py-2 px-3 rounded-lg bg-blue-100/70 text-blue-700 animate-pulse">
          🎤 Listening...
        </div>
      )}

      {transcript && (
        <div className="text-xs text-center py-2 px-3 rounded-lg bg-green-100/70 text-green-700">
          📝 "{transcript}"
        </div>
      )}

      {error && (
        <div className="text-xs text-center py-2 px-3 rounded-lg bg-yellow-100/70 text-yellow-700">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}