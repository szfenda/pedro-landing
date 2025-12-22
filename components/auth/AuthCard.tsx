'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrutalCard from '@/components/ui/BrutalCard'
import BrutalTabs from '@/components/ui/BrutalTabs'
import LoginTab from './LoginTab'
import RegisterTab from './RegisterTab'
import ResetPasswordTab from './ResetPasswordTab'

interface AuthCardProps {
  defaultTab?: 'login' | 'register' | 'reset'
}

export default function AuthCard({ defaultTab = 'login' }: AuthCardProps) {
  const [currentView, setCurrentView] = useState<'tabs' | 'reset'>(
    defaultTab === 'reset' ? 'reset' : 'tabs'
  )
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab === 'register' ? 'register' : 'login'
  )
  const router = useRouter()

  const handleAuthSuccess = () => {
    // Redirect to resolver to determine next step
    router.push('/resolver')
  }

  const handleSwitchToReset = () => {
    setCurrentView('reset')
  }

  const handleBackToLogin = () => {
    setCurrentView('tabs')
    setActiveTab('login')
  }

  const handleSwitchToRegister = () => {
    setCurrentView('tabs')
    setActiveTab('register')
  }

  const handleSwitchToLogin = () => {
    setCurrentView('tabs')
    setActiveTab('login')
  }

  if (currentView === 'reset') {
    return (
      <BrutalCard size="lg" className="w-full max-w-md mx-auto">
        <ResetPasswordTab onBackToLogin={handleBackToLogin} />
      </BrutalCard>
    )
  }

  const tabs = [
    {
      id: 'login',
      label: 'Zaloguj się',
      content: (
        <LoginTab
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToReset={handleSwitchToReset}
        />
      ),
    },
    {
      id: 'register',
      label: 'Załóż konto',
      content: (
        <RegisterTab
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      ),
    },
  ]

  return (
    <BrutalCard size="lg" className="w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold text-pedro-dark mb-2">
          Dołącz do PEDRO
        </h1>
        <p className="text-gray-600">
          Web służy do onboardingu i rozliczeń. Produkt jest w aplikacji mobilnej.
        </p>
      </div>

      <BrutalTabs
        tabs={tabs}
        defaultTab={activeTab}
        onTabChange={setActiveTab}
      />
    </BrutalCard>
  )
}