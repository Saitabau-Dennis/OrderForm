export function StorefrontLoader({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className || ""}`} aria-live="polite" aria-busy="true">
      <div className="relative aspect-square w-[65px] text-[#263245]">
        <span className="luma-spin-orb" />
        <span className="luma-spin-orb luma-spin-delay" />
      </div>
    </div>
  )
}
