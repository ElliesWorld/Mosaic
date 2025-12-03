import { CheckSquare, ShoppingCart, Calendar as CalendarIcon, Sparkles } from 'lucide-react'
import type { TabType } from '@types/index'

interface SidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'todo' as TabType, icon: CheckSquare, color: '#A8E6CF', ringColor: 'ring-[#A8E6CF]', label: 'To-Do' },
  { id: 'shopping' as TabType, icon: ShoppingCart, color: '#FFB4A2', ringColor: 'ring-[#FFB4A2]', label: 'Shopping' },
  { id: 'calendar' as TabType, icon: CalendarIcon, color: '#7EC8E3', ringColor: 'ring-[#7EC8E3]', label: 'Calendar' },
  { id: 'memory' as TabType, icon: Sparkles, color: '#B8A4DC', ringColor: 'ring-[#B8A4DC]', label: 'Memory' },
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="sidebar-compact">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`sidebar-blob ${isActive ? `sidebar-blob-active ${tab.ringColor}` : ''}`}
            title={tab.label}
            style={isActive ? { backgroundColor: `${tab.color}30` } : {}}
          >
            <Icon 
              className="w-5 h-5 transition-colors" 
              style={{ color: isActive ? tab.color : '#6B7280' }}
              strokeWidth={2.5}
            />
          </button>
        )
      })}
    </div>
  )
}