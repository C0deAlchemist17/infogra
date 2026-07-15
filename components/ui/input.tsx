import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border border-border-subtle bg-background-tertiary/50 px-8 py-4 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-400 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2 focus:ring-offset-background-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
