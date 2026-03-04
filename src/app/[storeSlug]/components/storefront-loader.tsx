import { Loader2 } from "lucide-react"

export function StorefrontLoader({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className || ""}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading store...</p>
    </div>
  )
}
