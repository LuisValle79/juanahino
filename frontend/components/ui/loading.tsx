import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ size = 'md', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size], className)} />
  )
}

interface LoadingCardProps {
  text?: string
  className?: string
}

export function LoadingCard({ text = "Cargando...", className }: LoadingCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loading size="lg" className="mb-4" />
        <p className="text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}

interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ text, size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loading size={size} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  text?: string
  className?: string
}

export function LoadingOverlay({ text = "Cargando...", className }: LoadingOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="text-center">
        <Loading size="lg" className="mb-4" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className, 
  disabled,
  onClick,
  ...props 
}: LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "h-10 px-4 py-2",
        className
      )}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading && <Loading size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

interface LoadingTableRowProps {
  columns: number
  rows?: number
}

export function LoadingTableRow({ columns, rows = 5 }: LoadingTableRowProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            index === lines - 1 && "w-3/4" // Última línea más corta
          )}
        />
      ))}
    </div>
  )
}