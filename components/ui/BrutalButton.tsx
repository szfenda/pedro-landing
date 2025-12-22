import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'lime' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-pedro-purple text-white shadow-brutal-dark hover:shadow-brutal-lime',
  secondary: 'bg-white text-pedro-dark shadow-brutal-purple hover:shadow-brutal-lime',
  lime: 'bg-pedro-lime text-pedro-dark shadow-brutal-purple hover:shadow-brutal-dark',
  outline: 'bg-transparent text-pedro-dark border-pedro-dark hover:bg-pedro-lime hover:shadow-brutal-purple',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'brutal-border rounded-button font-bold transition-all duration-300',
          'hover:-translate-y-1 active:scale-98',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

BrutalButton.displayName = 'BrutalButton'

export default BrutalButton