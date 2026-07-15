import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20",
        secondary: "border-border-subtle bg-background-tertiary/50 text-text-secondary hover:text-text-primary",
        outline: "border-border-medium text-text-primary hover:bg-background-tertiary",
        glass: "glass text-text-primary hover:bg-background-tertiary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {}

function Tag({ className, variant, ...props }: TagProps) {
  return (
    <div className={cn(tagVariants({ variant }), className)} {...props} />
  )
}

export { Tag, tagVariants }
