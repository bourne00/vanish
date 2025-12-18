'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { hapticFeedback } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, onClick, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'font-bold uppercase tracking-wider border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantStyles = {
      primary: 'border-vanish-green bg-vanish-green text-vanish-black hover:bg-vanish-black hover:text-vanish-green hover:glow-border active:bg-vanish-green-dark',
      secondary: 'border-vanish-green bg-transparent text-vanish-green hover:bg-vanish-green hover:text-vanish-black active:bg-vanish-green-dim',
      danger: 'border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-black active:bg-red-600',
    }
    
    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      hapticFeedback('medium')
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse">...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

