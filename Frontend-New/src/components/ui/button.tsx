import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 button-press",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-accent shadow-soft hover:shadow-soft-lg hover:scale-105",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-soft hover:shadow-soft-lg",
        outline:
          "border-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:border-primary/30 shadow-soft hover:shadow-soft-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-soft-lg",
        ghost: "hover:bg-neutral-100 hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent",
        gradient: "gradient-primary text-white shadow-soft hover:shadow-glow hover:scale-105",
        soft: "bg-soft text-gray-700 hover:bg-secondary shadow-soft hover:shadow-soft-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-12 w-12 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-2xl",
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
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <motion.div
        whileHover={{ scale: variant === "ghost" || variant === "link" ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={loading}
          {...props}
        >
          {loading && (
            <motion.div
              className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {children}
        </Comp>
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }