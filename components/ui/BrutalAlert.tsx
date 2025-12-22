import { cn } from '@/lib/utils'
import { useState } from 'react'

interface BrutalAlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    shadow: 'shadow-brutal-sm-lime',
    icon: '✅',
    textColor: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-pedro-pink',
    shadow: 'shadow-brutal-sm-pink',
    icon: '❌',
    textColor: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    shadow: 'shadow-brutal-sm-yellow',
    icon: '⚠️',
    textColor: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-pedro-purple',
    shadow: 'shadow-brutal-sm-purple',
    icon: 'ℹ️',
    textColor: 'text-blue-800',
  },
}

export default function BrutalAlert({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}: BrutalAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const styles = alertStyles[type]

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'p-4 rounded-card brutal-border',
        styles.bg,
        styles.border,
        styles.shadow,
        'animate-in slide-in-from-top-2 duration-300',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">
          {styles.icon}
        </span>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-bold text-sm mb-1', styles.textColor)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', styles.textColor)}>
            {message}
          </p>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors',
              styles.textColor
            )}
            aria-label="Zamknij alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}