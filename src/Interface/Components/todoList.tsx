import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Mic, MicOff } from 'lucide-react'
import TaskItem from './taskItem'
import { useVoiceRecognition } from '../Hooks/useVoiceRecognition'
import type { Task } from '@types/index'

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Contact the Teacher about the report',
      description: '',
      priority: 'URGENT',
      completed: false,
      dueDate: new Date('2024-12-05'),
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Call Dad',
      description: '',
      priority: 'MEDIUM',
      completed: false,
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Buy gift to Grandma on bday',
      description: 'Birthday is on August 19th!',
      priority: 'URGENT',
      completed: false,
      dueDate: new Date('2024-12-08'),
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript, error } = useVoiceRecognition()
  const wasListeningRef = useRef(false)
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showListening, setShowListening] = useState(false)
  const listeningDelayRef = useRef<NodeJS.Timeout | null>(null)

  const handleAddTask = useCallback((title?: string) => {
    const taskTitle = title || newTaskTitle
    if (!taskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      priority: 'NORMAL',
      completed: false,
      listType: 'TODO',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('➕ Adding:', taskTitle)
    setTasks(prev => [...prev, newTask])
    setNewTaskTitle('')
  }, [newTaskTitle])

  // Delay showing "Listening..." message by 150ms
  useEffect(() => {
    if (isListening) {
      // Clear any existing delay
      if (listeningDelayRef.current) {
        clearTimeout(listeningDelayRef.current)
      }
      
      // Show "Listening..." after 150ms delay
      listeningDelayRef.current = setTimeout(() => {
        setShowListening(true)
      }, 150)
    } else {
      // Hide immediately when stopped
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

  // Auto-stop after getting transcript (with delay for final result)
  useEffect(() => {
    if (isListening && transcript) {
      console.log('📝 Got transcript, will auto-stop in 0.5 seconds...')
      
      // Clear existing timeout
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
      
      // Auto-stop after 0.5 seconds of no new speech
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
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: '#7EC8E3' }}>To do list</h2>
      </div>

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
        
        {supported ? (
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
        ) : (
          <div className="p-2 rounded-xl bg-gray-300" title="Voice not supported">
            <MicOff className="w-4 h-4 text-gray-500" />
          </div>
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