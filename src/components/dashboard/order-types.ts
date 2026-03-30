export interface DashboardOrderItem {
  name: string
  quantity: number
  price: number | string
  variant?: string | null
}

export interface DashboardOrder {
  id: string
  displayId?: string | null
  orderNumber?: number | null
  customerName: string
  customerPhone: string
  status: string
  createdAt: string | Date
  totalAmount: number | string
  subtotal?: number | string | null
  deliveryFee?: number | string | null
  fulfillmentMethod?: "SHOP_PICKUP" | "DELIVERY" | string
  shipToDifferentAddress?: boolean
  billingAddressLine1?: string | null
  billingAddressLine2?: string | null
  billingZoneId?: string | null
  shippingRecipientName?: string | null
  shippingRecipientPhone?: string | null
  shippingAddressLine1?: string | null
  shippingAddressLine2?: string | null
  shippingZoneId?: string | null
  deliveryAddress?: string | null
  deliveryZone?: string | null
  notes?: string | null
  items?: DashboardOrderItem[]
}

export interface OrdersStats {
  total: number
  pending: number
  processing: number
  completed: number
  cancelled: number
  thisWeek: number
  thisWeekOrders: number
  thisMonth: number
  thisMonthOrders: number
}
