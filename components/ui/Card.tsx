'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hover = true, ...props }, ref) => {
        return (
            <div
                className={cn(
                    'card-brutal',
                    hover && 'hover:shadow-brutal-lime hover:-translate-y-2',
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export default Card