import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50 btn-premium",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white hover:shadow-glow",
        premium: "bg-accent-primary text-white hover:bg-accent-secondary hover:shadow-glow",
        outline: "border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-background-tertiary",
        link: "text-accent-primary underline-offset-4 hover:underline",
        glass: "glass text-text-primary hover:bg-background-tertiary",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-lg px-6",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
