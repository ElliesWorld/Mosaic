import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Web Speech API
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    onstart: null,
    onend: null,
    onerror: null,
    onresult: null,
  })),
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: window.SpeechRecognition,
})

// Mock taskService API calls to return resolved promises
jest.mock('../src/services/taskService', () => ({
  taskAPI: {
    getAllTasks: jest.fn().mockResolvedValue([]),
    getTaskById: jest.fn().mockResolvedValue({}),
    createTask: jest.fn().mockImplementation((task) => 
      Promise.resolve({ 
        ...task, 
        id: Date.now().toString(), 
        createdAt: new Date(), 
        updatedAt: new Date() 
      })
    ),
    updateTask: jest.fn().mockImplementation((id, updates) => 
      Promise.resolve({ 
        id, 
        ...updates, 
        updatedAt: new Date() 
      })
    ),
    deleteTask: jest.fn().mockResolvedValue(undefined),
    toggleTaskComplete: jest.fn().mockImplementation((id) => 
      Promise.resolve({ 
        id, 
        completed: true, 
        updatedAt: new Date() 
      })
    ),
  },
}))