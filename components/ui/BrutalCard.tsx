import { cn } from '@/lib/utils'

interface BrutalCardProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'lime' | 'pink'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  className?: string
}

const variants = {
  default: 'bg-white text-pedro-dark shadow-brutal-purple',
  purple: 'bg-pedro-purple text-white shadow-brutal-lime',
  lime: 'bg-pedro-lime text-pedro-dark shadow-brutal-purple',
  pink: 'bg-pedro-pink text-white shadow-brutal-dark',
}

const sizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
}

export default function BrutalCard({
  children,
  variant = 'default',
  size = 'md',
  hover = false,
  className,
}: BrutalCardProps) {
  return (
    <div
      className={cn(
        'brutal-border rounded-card',
        variants[variant],
        sizes[size],
        hover && 'transition-all duration-300 hover:-translate-y-2 hover:shadow-brutal-lime',
        className
      )}
    >
      {children}
    </div>
  )
}