import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    'inline-flex items-center justify-center text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                admin: 'admin-button',
                visitor: 'visitor-button',
                outline: 'border-2 bg-transparent hover:shadow-[4px_4px_0] hover:translate-x-[-2px] hover:translate-y-[-2px]',
                ghost: 'border-2 border-transparent hover:border-inherit',
                destructive: 'bg-red-600 text-white border-2 border-red-600 hover:bg-red-700 hover:border-red-700',
            },
            size: {
                default: 'h-11 px-6 py-3',
                sm: 'h-9 px-4 py-2 text-xs',
                lg: 'h-13 px-8 py-4 text-base',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'admin',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
