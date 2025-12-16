import { useState, useCallback } from 'react'
import { Plus, Mic, MicOff, Trash2, Check } from 'lucide-react'
import { useVoiceRecognition } from '../Hooks/useVoiceRecognition'

interface ShoppingItem {
  id: string
  name: string
  quantity?: string
  category?: 'Frukt & Grönt' | 'Mejeri' | 'Kött & Fisk' | 'Bröd & Bakverk' | 'Övrigt'
  checked: boolean
  createdAt: Date
}

const categoryColors = {
  'Frukt & Grönt': '#A8E6CF',
  'Mejeri': '#FFD93D',
  'Kött & Fisk': '#FF6B9D',
  'Bröd & Bakverk': '#FFB347',
  'Övrigt': '#7EC8E3',
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Mjölk',
      quantity: '1 liter',
      category: 'Mejeri',
      checked: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Äpplen',
      quantity: '1 kg',
      category: 'Frukt & Grönt',
      checked: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Bröd',
      category: 'Bröd & Bakverk',
      checked: false,
      createdAt: new Date(),
    },
  ])

  const [newItemName, setNewItemName] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState('')
  const { isListening, transcript, startListening, stopListening, supported, resetTranscript, error } = useVoiceRecognition()
  const [showChecked, setShowChecked] = useState(true)

  const autoDetectCategory = (itemName: string): ShoppingItem['category'] => {
    const name = itemName.toLowerCase()
    
    // Frukt & Grönt
    if (name.match(/äpple|banan|tomat|gurka|sallad|morot|potatis|lök|citron|apelsin|päron|frukt|grönsak/i)) {
      return 'Frukt & Grönt'
    }
    
    // Mejeri
    if (name.match(/mjölk|ost|yoghurt|smör|grädde|fil|kesella/i)) {
      return 'Mejeri'
    }
    
    // Kött & Fisk
    if (name.match(/kött|fisk|kyckling|köttfärs|bacon|korv|lax|räkor/i)) {
      return 'Kött & Fisk'
    }
    
    // Bröd & Bakverk
    if (name.match(/bröd|bulle|kaka|mjöl|jäst|bakpulver/i)) {
      return 'Bröd & Bakverk'
    }
    
    return 'Övrigt'
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
          Inköpslista
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{uncheckedCount} kvar</span>
          {checkedCount > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <button
                onClick={handleClearChecked}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                Rensa {checkedCount} avklarade
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
            placeholder={isListening ? "Lyssnar..." : "Lägg till vara..."}
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
              title={isListening ? 'Spelar in...' : 'Röstinmatning'}
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
            Lägg till
          </button>
        </div>

        <input
          type="text"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Antal/Mängd (valfritt)"
          className="w-full px-3 py-2 text-sm rounded-xl border border-orange-200/50 focus:outline-none focus:ring-2 focus:ring-[#FFB347]/50 bg-white/70 backdrop-blur-sm"
          disabled={isListening}
        />
      </div>

      {/* Voice feedback */}
      {isListening && (
        <div className="text-xs text-center py-2 px-3 rounded-lg bg-orange-100/70 text-orange-700 animate-pulse">
          🎤 Lyssnar...
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

      {/* Toggle show checked */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showChecked"
          checked={showChecked}
          onChange={(e) => setShowChecked(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="showChecked" className="text-sm text-gray-600 cursor-pointer">
          Visa avklarade varor
        </label>
      </div>

      {/* Shopping items grouped by category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const visibleItems = showChecked 
            ? categoryItems 
            : categoryItems.filter(item => !item.checked)
          
          if (visibleItems.length === 0) return null

          return (
            <div key={category} className="space-y-2">
              <h3 
                className="text-sm font-semibold px-2 py-1 rounded-lg inline-block"
                style={{ 
                  backgroundColor: `${categoryColors[category as keyof typeof categoryColors]}40`,
                  color: categoryColors[category as keyof typeof categoryColors]
                }}
              >
                {category} ({visibleItems.length})
              </h3>
              
              <div className="space-y-2">
                {visibleItems.map((item) => (
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
          <p className="text-lg">Din inköpslista är tom</p>
          <p className="text-sm mt-2">Lägg till varor ovan</p>
        </div>
      )}
    </div>
  )
}