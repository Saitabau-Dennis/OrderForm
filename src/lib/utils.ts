import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOrderId(orderNumber: number | string): string {
  // If it's a UUID (long string), take the last 6 chars as fallback
  // ignoring this case if we primarily use orderNumber
  if (typeof orderNumber === 'string' && orderNumber.length > 10) {
      return `ORD-${orderNumber.substring(orderNumber.length - 6).toUpperCase()}`;
  }
  
  // Otherwise, pad the number
  const num = typeof orderNumber === 'string' ? parseInt(orderNumber, 10) : orderNumber;
  if (isNaN(num)) return `ORD-${orderNumber}`;
  
  return `ORD-${num.toString().padStart(4, '0')}`;
}