import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-accent shadow-soft",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-soft",
        outline: "text-gray-700 border-neutral-300 hover:bg-neutral-50 shadow-soft",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-soft",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-soft",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 shadow-soft",
        soft: "border-transparent bg-soft text-gray-700 hover:bg-secondary shadow-soft",
        gradient: "border-transparent gradient-primary text-white shadow-soft hover:shadow-glow",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

function Badge({ className, variant, size, pulse = false, children, ...props }: BadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(badgeVariants({ variant, size }), pulse && "animate-pulse-soft", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

function BadgeGroup({ className, children, ...props }: BadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export { Badge, BadgeGroup, badgeVariants }