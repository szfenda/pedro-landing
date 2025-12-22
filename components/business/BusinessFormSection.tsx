import { cn } from '@/lib/utils'

interface BusinessFormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  isValid: boolean
  isActive: boolean
  onActivate: () => void
  className?: string
}

export default function BusinessFormSection({
  title,
  description,
  children,
  isValid,
  isActive,
  onActivate,
  className,
}: BusinessFormSectionProps) {
  return (
    <fieldset
      className={cn(
        'brutal-border rounded-card bg-white transition-all duration-300',
        isActive ? 'shadow-brutal-lime' : 'shadow-brutal-purple',
        className
      )}
    >
      <legend className="sr-only">{title}</legend>
      
      {/* Section Header */}
      <div
        className={cn(
          'p-6 border-b-3 border-pedro-dark cursor-pointer transition-all duration-300',
          'hover:bg-pedro-light/50',
          isActive && 'bg-pedro-lime/10'
        )}
        onClick={onActivate}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline text-xl font-bold text-pedro-dark flex items-center gap-3">
              {/* Validation indicator */}
              <span
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                  isValid
                    ? 'bg-pedro-lime border-pedro-dark text-pedro-dark'
                    : 'bg-white border-pedro-dark text-pedro-dark'
                )}
              >
                {isValid ? '✓' : '○'}
              </span>
              {title}
            </h3>
            {description && (
              <p className="text-gray-600 mt-1 ml-9">{description}</p>
            )}
          </div>
          
          {/* Expand/collapse indicator */}
          <div
            className={cn(
              'w-8 h-8 rounded-full bg-pedro-dark text-white flex items-center justify-center transition-transform duration-300',
              isActive ? 'rotate-180' : 'rotate-0'
            )}
          >
            ↓
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </fieldset>
  )
}