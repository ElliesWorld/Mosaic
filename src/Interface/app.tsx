import { useState } from 'react'
import { X, Minus } from 'lucide-react'
import Sidebar from './Components/sidebar'
import TodoList from './Components/todoList'
import ShoppingList from './Components/shoppingList'
import Calendar from './Components/calendar'
import MemoryBank from './Components/memoryBank'
import type { TabType } from '@types/index'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('todo')

  const handleClose = () => {
    window.close()
  }

  const handleMinimize = () => {
    // Will implement with Electron IPC later
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />
      case 'shopping':
        return <ShoppingList />
      case 'calendar':
        return <Calendar />
      case 'memory':
        return <MemoryBank />
      default:
        return <TodoList />
    }
  }

  return (
    <div className="h-screen w-screen flex p-2">
      {/* Main Container with Glass Effect */}
      <div className="glass-container w-full h-full flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Title Bar (draggable) */}
          <div className="drag-region h-10 flex items-center justify-between px-4 border-b border-blue-200/30">
            <h1 className="mosaic-logo">Mosaic</h1>
            <div className="no-drag flex gap-1">
              <button
                onClick={handleMinimize}
                className="p-1.5 hover:bg-blue-200/30 rounded-lg transition-colors"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-red-400/20 rounded-lg transition-colors"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App