import { useState, useCallback, useRef, useEffect } from 'react'
import { Plus, Mic, MicOff, Trash2, Check } from 'lucide-react'
import { useVoiceRecognition } from '../Hooks/useVoiceRecognition'

interface ShoppingItem {
  id: string
  name: string
  quantity?: string
  category?: 'Fruits & Vegetables' | 'Dairy' | 'Meat & Fish' | 'Bread & Bakery' | 'Other'
  checked: boolean
  createdAt: Date
}

const categoryColors = {
  'Fruits & Vegetables': '#A8E6CF',
  'Dairy': '#FFD93D',
  'Meat & Fish': '#FF6B9D',
  'Bread & Bakery': '#FFB347',
  'Other': '#7EC8E3',
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Milk',
      quantity: '1 liter',
      category: 'Dairy',
      checked: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Apples',
      quantity: '1 kg',
      category: 'Fruits & Vegetables',
      checked: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Bread',
      category: 'Bread & Bakery',
      checked: false,
      createdAt: new Date(),
    },
  ])

  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript, error } = useVoiceRecognition()
  const wasListeningRef = useRef(false)
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const autoDetectCategory = (itemName: string): ShoppingItem['category'] => {
    const name = itemName.toLowerCase()
    
    // Fruits & Vegetables
    if (name.match(/apple|banana|tomato|cucumber|lettuce|salad|carrot|potato|onion|lemon|orange|pear|fruit|vegetable|broccoli|pepper|spinach/i)) {
      return 'Fruits & Vegetables'
    }
    
    // Dairy
    if (name.match(/milk|cheese|yogurt|butter|cream|dairy|egg|eggs/i)) {
      return 'Dairy'
    }
    
    // Meat & Fish
    if (name.match(/meat|fish|chicken|beef|pork|bacon|sausage|salmon|shrimp|turkey|lamb/i)) {
      return 'Meat & Fish'
    }
    
    // Bread & Bakery
    if (name.match(/bread|bun|cake|flour|yeast|baking|cookie|muffin|bagel|croissant/i)) {
      return 'Bread & Bakery'
    }
    
    return 'Other'
  }

  const handleAddItem = useCallback((name?: string, quantity?: string) => {
    const itemName = name || newItemName
    if (!itemName.trim()) return

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: quantity || newItemQuantity || undefined,
      category: autoDetectCategory(itemName),
      checked: false,
      createdAt: new Date(),
    }

    console.log('➕ Adding item:', itemName)
    setItems(prev => [...prev, newItem])
    setNewItemName('')
    setNewItemQuantity('')
  }, [newItemName, newItemQuantity])

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
      
      // Remove trigger words like "add"
      const triggers = ['add item', 'add', 'buy']
      for (const trigger of triggers) {
        if (text.toLowerCase().startsWith(trigger)) {
          text = text.substring(trigger.length).trim()
          break
        }
      }
      
      if (text) {
        // Capitalize first letter
        text = text.charAt(0).toUpperCase() + text.slice(1)
        console.log('✅ Adding item:', text)
        handleAddItem(text)
        
        setTimeout(() => resetTranscript(), 1000)
      }
    }
    
    wasListeningRef.current = isListening
  }, [isListening, transcript, handleAddItem, resetTranscript])

  const handleToggleCheck = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleClearChecked = () => {
    setItems(items.filter(item => !item.checked))
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Övrigt'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  const uncheckedCount = items.filter(item => !item.checked).length
  const checkedCount = items.filter(item => item.checked).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: '#FFB347' }}>
          Shopping List
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{uncheckedCount} left</span>
          {checkedCount > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <button
                onClick={handleClearChecked}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear {checkedCount} checked
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add item form */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder={isListening ? "Listening..." : "Add item..."}
            className="flex-1 px-3 py-2 text-sm rounded-xl border border-orange-200/50 focus:outline-none focus:ring-2 focus:ring-[#FFB347]/50 bg-white/70 backdrop-blur-sm"
            disabled={isListening}
          />
          
          {supported && (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-red-400 animate-pulse cursor-not-allowed' 
                  : 'bg-orange-400 hover:bg-orange-500'
              }`}
              title={isListening ? 'Recording...' : 'Voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
            </button>
          )}
          
          <button
            onClick={() => handleAddItem()}
            className="px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-1.5 font-medium shadow-sm hover:shadow"
            style={{ backgroundColor: '#FFB347' }}
            disabled={isListening}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <input
          type="text"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Quantity (optional)"
          className="w-full px-3 py-2 text-sm rounded-xl border border-orange-200/50 focus:outline-none focus:ring-2 focus:ring-[#FFB347]/50 bg-white/70 backdrop-blur-sm"
          disabled={isListening}
        />
      </div>

      {/* Voice feedback */}
      {isListening && (
        <div className="text-xs text-center py-2 px-3 rounded-lg bg-orange-100/70 text-orange-700 animate-pulse">
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

      {/* Shopping items grouped by category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          if (categoryItems.length === 0) return null

          return (
            <div key={category} className="space-y-2">
              <h3 
                className="text-sm font-semibold px-2 py-1 rounded-lg inline-block"
                style={{ 
                  backgroundColor: `${categoryColors[category as keyof typeof categoryColors]}40`,
                  color: categoryColors[category as keyof typeof categoryColors]
                }}
              >
                {category} ({categoryItems.length})
              </h3>
              
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      item.checked 
                        ? 'bg-gray-50/50 backdrop-blur-sm opacity-60' 
                        : 'bg-white/70 backdrop-blur-sm shadow-sm hover:shadow'
                    }`}
                    style={{ 
                      borderLeft: `4px solid ${categoryColors[item.category || 'Övrigt']}` 
                    }}
                  >
                    <button
                      onClick={() => handleToggleCheck(item.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.checked
                          ? 'bg-green-400 border-green-400'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 text-white" />}
                    </button>

                    <div className="flex-1">
                      <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {item.name}
                      </div>
                      {item.quantity && (
                        <div className="text-xs text-gray-500">
                          {item.quantity}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Your shopping list is empty</p>
          <p className="text-sm mt-2">Add items above</p>
        </div>
      )}
    </div>
  )
}