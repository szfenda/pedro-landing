import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  completedSteps: number[]
  onStepClick?: (step: number) => void
}

export default function ProgressIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop - Horizontal */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep
          const isClickable = onStepClick && (isCompleted || stepNumber <= currentStep)

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'w-12 h-12 rounded-full border-3 font-bold text-sm transition-all duration-300',
                  'flex items-center justify-center',
                  isCompleted && 'bg-pedro-lime border-pedro-dark text-pedro-dark',
                  isCurrent && !isCompleted && 'bg-pedro-purple border-pedro-dark text-white',
                  !isCurrent && !isCompleted && 'bg-white border-gray-300 text-gray-400',
                  isClickable && 'hover:-translate-y-1 hover:shadow-brutal-sm-lime cursor-pointer',
                  !isClickable && 'cursor-not-allowed'
                )}
              >
                {isCompleted ? '✓' : stepNumber}
              </button>

              {/* Step Label */}
              <div className="ml-3 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    (isCurrent || isCompleted) ? 'text-pedro-dark' : 'text-gray-400'
                  )}
                >
                  {step}
                </p>
              </div>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        isCompleted ? 'bg-pedro-lime w-full' : 'bg-gray-200 w-0'
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile - Vertical */}
      <div className="md:hidden space-y-4 mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = completedSteps.includes(stepNumber)
          const isCurrent = stepNumber === currentStep
          const isClickable = onStepClick && (isCompleted || stepNumber <= currentStep)

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'w-10 h-10 rounded-full border-3 font-bold text-sm transition-all duration-300',
                  'flex items-center justify-center flex-shrink-0',
                  isCompleted && 'bg-pedro-lime border-pedro-dark text-pedro-dark',
                  isCurrent && !isCompleted && 'bg-pedro-purple border-pedro-dark text-white',
                  !isCurrent && !isCompleted && 'bg-white border-gray-300 text-gray-400',
                  isClickable && 'hover:-translate-y-1 hover:shadow-brutal-sm-lime cursor-pointer',
                  !isClickable && 'cursor-not-allowed'
                )}
              >
                {isCompleted ? '✓' : stepNumber}
              </button>

              {/* Step Label */}
              <div className="ml-4 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    (isCurrent || isCompleted) ? 'text-pedro-dark' : 'text-gray-400'
                  )}
                >
                  {step}
                </p>
              </div>

              {/* Progress Line (vertical) */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 mt-10 w-0.5 h-8 bg-gray-200">
                  <div
                    className={cn(
                      'w-full transition-all duration-500',
                      isCompleted ? 'bg-pedro-lime h-full' : 'bg-gray-200 h-0'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}