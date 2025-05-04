
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        purple: "bg-purple-400 text-white hover:bg-purple-500",
        neonblue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300",
        heroGradient: "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px]",
        accent: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300",
        modern: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] font-medium",
        outlineModern: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300",
        premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] font-medium",
        vibrant: "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] font-medium",
        cta: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 hover:translate-y-[-2px] font-medium",
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 px-8 py-3 text-base",
        xxl: "h-14 px-10 py-4 text-lg rounded-xl",
        hero: "h-14 px-8 py-4 text-lg rounded-lg",
        pill: "h-10 px-6 py-2 rounded-full",
        pillLg: "h-12 px-8 py-3 rounded-full text-base",
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
