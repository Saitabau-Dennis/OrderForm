import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalizes mixed legacy/current order identifiers into a consistent display format.
export function formatOrderId(orderRef: number | string): string {
  if (typeof orderRef === "number") {
    return `ORD-${orderRef.toString().padStart(4, "0")}`
  }

  const raw = `${orderRef || ""}`.trim().toUpperCase()
  if (!raw) return "ORD-0000"

  if (/^[A-Z]+-[A-Z0-9]+$/.test(raw)) {
    return raw
  }

  const lettersAndDigits = raw.match(/^([A-Z]+)(\d+)$/)
  if (lettersAndDigits) {
    return `${lettersAndDigits[1]}-${lettersAndDigits[2]}`
  }

  if (/^\d+$/.test(raw)) {
    return `ORD-${raw.padStart(4, "0")}`
  }

  const sanitized = raw.replace(/[^A-Z0-9]/g, "")
  if (!sanitized) return "ORD-0000"

  if (sanitized.length > 10) {
    return `ORD-${sanitized.substring(sanitized.length - 6)}`
  }

  return `ORD-${sanitized}`
}
