import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
    'inline-flex items-center justify-center text-xs font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
    {
        variants: {
            variant: {
                admin: 'admin-button',
                visitor: 'visitor-button',
                outline: 'bg-transparent hover:opacity-80',
                ghost: 'bg-transparent hover:opacity-80',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 px-3 py-1.5 text-[10px]',
                lg: 'h-10 px-5 py-2.5 text-sm',
                icon: 'h-9 w-9',
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
