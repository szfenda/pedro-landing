'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface BrutalTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export default function BrutalTabs({ 
  tabs, 
  defaultTab, 
  onTabChange, 
  className 
}: BrutalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tab Navigation */}
      <div className="flex gap-2 p-2 bg-gray-100 rounded-card brutal-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-6 py-3 rounded-button font-bold transition-all duration-300',
              'brutal-border',
              activeTab === tab.id
                ? 'bg-pedro-lime text-pedro-dark shadow-brutal-sm-purple'
                : 'bg-white text-pedro-dark hover:-translate-y-1 hover:shadow-brutal-sm-lime'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-right-2 duration-300"
        >
          {activeTabContent}
        </div>
      </div>
    </div>
  )
}