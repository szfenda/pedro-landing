import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  error?: string
  className?: string
}

export default function DashboardCard({
  title,
  children,
  actions,
  loading = false,
  error,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'bg-white brutal-border rounded-card shadow-brutal-purple p-6',
        'transition-all duration-300',
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-xl font-bold text-pedro-dark">
          {title}
        </h3>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-pedro-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-pedro-pink font-medium mb-2">Wystąpił błąd</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}