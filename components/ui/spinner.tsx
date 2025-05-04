import type React from "react"
import { Loader2 } from "lucide-react"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div role="status" {...props}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

