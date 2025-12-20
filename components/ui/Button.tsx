'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useRipple } from '@/hooks/useRipple'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'purple' | 'lime' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'purple', size = 'md', children, onClick, ...props }, ref) => {
        const createRipple = useRipple()
        
        const baseClasses = 'btn-brutal font-bold transition-all duration-300 will-animate relative overflow-hidden'
        
        const variants = {
            purple: 'btn-brutal-purple',
            lime: 'btn-brutal-lime',
            dark: 'bg-pedro-dark text-white shadow-brutal-lime hover:shadow-brutal-purple'
        }
        
        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg'
        }

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            createRipple(e)
            onClick?.(e)
        }

        return (
            <button
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                onClick={handleClick}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button