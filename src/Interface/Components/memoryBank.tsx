import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, Mic, MicOff, Trash2, Pin, Search } from 'lucide-react'
import { useVoiceRecognition } from '../Hooks/useVoiceRecognition'
import { format } from 'date-fns'

interface Memory {
  id: string
  content: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

export default function MemoryBank() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      content: 'Build a productivity app with voice features',
      pinned: true,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      content: 'Remember to appreciate the small moments in life',
      pinned: false,
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2024-12-05'),
    },
  ])

  const [newMemoryContent, setNewMemoryContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript, error } = useVoiceRecognition()
  const wasListeningRef = useRef(false)
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAddMemory = useCallback((content?: string) => {
    const memoryContent = content || newMemoryContent
    if (!memoryContent.trim()) return

    const newMemory: Memory = {
      id: Date.now().toString(),
      content: memoryContent,
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('➕ Adding memory:', memoryContent)
    setMemories(prev => [newMemory, ...prev])
    setNewMemoryContent('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [newMemoryContent])

  // Auto-stop after getting transcript
  useEffect(() => {
    if (isListening && transcript) {
      console.log('📝 Got transcript, will auto-stop in 0.8 seconds...')
      
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
      
      autoStopTimeoutRef.current = setTimeout(() => {
        if (isListening) {
          console.log('⏹️ Auto-stopping...')
          stopListening()
        }
      }, 800)
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
      
      if (text) {
        // Capitalize first letter
        text = text.charAt(0).toUpperCase() + text.slice(1)
        console.log('✅ Adding memory:', text)
        handleAddMemory(text)
        
        setTimeout(() => resetTranscript(), 1000)
      }
    }
    
    wasListeningRef.current = isListening
  }, [isListening, transcript, handleAddMemory, resetTranscript])

  const handleTogglePin = (id: string) => {
    setMemories(memories.map(memory => 
      memory.id === id ? { ...memory, pinned: !memory.pinned, updatedAt: new Date() } : memory
    ))
  }

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter(memory => memory.id !== id))
  }

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMemoryContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  // Filter and search memories
  const filteredMemories = memories
    .filter(memory => {
      // Filter by search query
      if (searchQuery && !memory.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      // Then by date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  const pinnedCount = memories.filter(m => m.pinned).length
  const totalCount = memories.length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#C4A1FF' }}>
          Memory Bank
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{totalCount} memories</span>
          {pinnedCount > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span>{pinnedCount} pinned</span>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-300/50 bg-white/70 backdrop-blur-sm"
        />
      </div>

      {/* Add Memory Form */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">New Memory</span>
        </div>

        <textarea
          ref={textareaRef}
          value={newMemoryContent}
          onChange={handleTextareaChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleAddMemory()
            }
          }}
          placeholder={isListening ? "Listening..." : "Write your quick note..."}
          className="w-full px-3 py-2 text-sm rounded-xl border border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-300/50 bg-white/70 backdrop-blur-sm resize-none overflow-hidden"
          disabled={isListening}
          rows={1}
          style={{ minHeight: '40px' }}
        />

        <div className="flex gap-2">
          {supported && (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`flex-1 p-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isListening 
                  ? 'bg-red-400 animate-pulse cursor-not-allowed' 
                  : 'bg-purple-400 hover:bg-purple-500'
              }`}
              title={isListening ? 'Recording...' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
              <span className="text-sm text-white font-medium">
                {isListening ? 'Recording...' : 'Voice'}
              </span>
            </button>
          )}
          
          <button
            onClick={() => handleAddMemory()}
            className="flex-1 px-4 py-2 text-sm rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
            style={{ backgroundColor: '#C4A1FF' }}
            disabled={isListening}
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">Add Memory</span>
          </button>
        </div>

        {/* Voice feedback */}
        {isListening && (
          <div className="text-xs text-center py-2 px-3 rounded-lg bg-purple-100/70 text-purple-700 animate-pulse">
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
      </div>

      {/* Memories List */}
      <div className="space-y-2">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">
              {searchQuery ? 'No memories found' : 'Your memory bank is empty'}
            </p>
            <p className="text-sm mt-2">
              {searchQuery ? 'Try a different search' : 'Add your first memory above'}
            </p>
          </div>
        ) : (
          filteredMemories.map((memory) => {
            return (
              <div
                key={memory.id}
                className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow transition-all ${
                  memory.pinned ? 'ring-2 ring-purple-300' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 whitespace-pre-wrap break-words">
                      {memory.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{format(memory.createdAt, 'MMM d, yyyy')}</span>
                      {memory.pinned && (
                        <>
                          <span>•</span>
                          <span className="text-purple-600 font-medium">Pinned</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(memory.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        memory.pinned
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      title={memory.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className={`w-4 h-4 ${memory.pinned ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}