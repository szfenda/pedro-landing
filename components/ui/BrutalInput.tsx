import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
  showPasswordToggle?: boolean
}

const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ label, error, helper, showPasswordToggle = false, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-pedro-dark">
          {label}
          {props.required && <span className="text-pedro-pink ml-1">*</span>}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full brutal-border rounded-button px-4 py-3',
              'bg-white text-pedro-dark placeholder-gray-500',
              'transition-all duration-300',
              'focus:outline-none focus:ring-4 focus:ring-pedro-lime focus:ring-opacity-50',
              'focus:-translate-y-1 focus:shadow-brutal-lime',
              error && 'border-pedro-pink shadow-brutal-pink',
              className
            )}
            {...props}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pedro-dark hover:text-pedro-purple transition-colors"
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-pedro-pink font-medium">
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-gray-600">
            {helper}
          </p>
        )}
      </div>
    )
  }
)

BrutalInput.displayName = 'BrutalInput'

export default BrutalInput