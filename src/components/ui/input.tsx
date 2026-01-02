import * as React from 'react'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'admin' | 'visitor'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = 'admin', ...props }, ref) => {
        return (
            <input
                type={type}
                className={`${variant === 'admin' ? 'admin-input' : 'visitor-input'} w-full ${className || ''}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
