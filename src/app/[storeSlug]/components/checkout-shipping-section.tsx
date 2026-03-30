import type { CheckoutFieldErrors, DeliveryZone } from "./checkout-form-types"

type ShippingSectionProps = {
  deliveryMethod: "delivery" | "shop_pickup"
  shipToDifferentAddress: boolean
  shippingRecipientName: string
  shippingRecipientPhone: string
  shippingAddressLine1: string
  shippingAddressLine2: string
  shippingZoneId: string
  deliveryZones: DeliveryZone[]
  orderNotes: string
  fieldErrors: CheckoutFieldErrors
  formatPrice: (price: number) => string
  getFieldClass: (hasError: boolean) => string
  onToggleShipToDifferentAddress: (checked: boolean) => void
  onShippingRecipientNameChange: (value: string) => void
  onShippingRecipientPhoneChange: (value: string) => void
  onShippingAddressLine1Change: (value: string) => void
  onShippingAddressLine2Change: (value: string) => void
  onShippingZoneIdChange: (value: string) => void
  onOrderNotesChange: (value: string) => void
}

export function CheckoutShippingSection({
  deliveryMethod,
  shipToDifferentAddress,
  shippingRecipientName,
  shippingRecipientPhone,
  shippingAddressLine1,
  shippingAddressLine2,
  shippingZoneId,
  deliveryZones,
  orderNotes,
  fieldErrors,
  formatPrice,
  getFieldClass,
  onToggleShipToDifferentAddress,
  onShippingRecipientNameChange,
  onShippingRecipientPhoneChange,
  onShippingAddressLine1Change,
  onShippingAddressLine2Change,
  onShippingZoneIdChange,
  onOrderNotesChange,
}: ShippingSectionProps) {
  return (
    <div className="space-y-5 border border-[#E2E2DD] bg-[#FCFCFA] p-5 sm:p-6 lg:sticky lg:top-24">
      <div className="flex items-center gap-2">
        <input
          id="ship-different-address"
          type="checkbox"
          checked={shipToDifferentAddress}
          onChange={(event) => onToggleShipToDifferentAddress(event.target.checked)}
          className="h-4 w-4 rounded-none border-[#BEBEB8] text-[#1A1A1A] focus:ring-[#1A1A1A]"
        />
        <label htmlFor="ship-different-address" className="text-lg font-semibold leading-tight text-[#1A1A1A] sm:text-[23px]">
          Ship To A Different Address?
        </label>
      </div>
      <p className="text-sm leading-relaxed text-[#696964]">
        Enable this if the delivery recipient address is different from the billing details.
      </p>

      {deliveryMethod === "delivery" && shipToDifferentAddress ? (
        <div className="space-y-4 rounded-none border border-[#E8E8E5] p-5">
          <p className="text-sm font-semibold text-[#1A1A1A]">Shipping address</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="shipping-recipient-name" className="text-[13px] font-medium text-[#1A1A1A]">
                Recipient name <span className="text-red-500">*</span>
              </label>
              <input
                id="shipping-recipient-name"
                type="text"
                value={shippingRecipientName}
                onChange={(event) => onShippingRecipientNameChange(event.target.value)}
                placeholder="Full recipient name"
                className={`${getFieldClass(Boolean(fieldErrors.shippingRecipientName))} h-11 px-3`}
                aria-invalid={Boolean(fieldErrors.shippingRecipientName)}
                aria-describedby={fieldErrors.shippingRecipientName ? "checkout-shipping-recipient-name-error" : undefined}
              />
              {fieldErrors.shippingRecipientName ? (
                <p id="checkout-shipping-recipient-name-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.shippingRecipientName}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="shipping-recipient-phone" className="text-[13px] font-medium text-[#1A1A1A]">
                Recipient phone <span className="text-red-500">*</span>
              </label>
              <input
                id="shipping-recipient-phone"
                type="tel"
                value={shippingRecipientPhone}
                onChange={(event) => onShippingRecipientPhoneChange(event.target.value)}
                placeholder="+254 712345678"
                className={`${getFieldClass(Boolean(fieldErrors.shippingRecipientPhone))} h-11 px-3`}
                aria-invalid={Boolean(fieldErrors.shippingRecipientPhone)}
                aria-describedby={fieldErrors.shippingRecipientPhone ? "checkout-shipping-recipient-phone-error" : undefined}
              />
              {fieldErrors.shippingRecipientPhone ? (
                <p id="checkout-shipping-recipient-phone-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.shippingRecipientPhone}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="shipping-address-1" className="text-[13px] font-medium text-[#1A1A1A]">
              Street address <span className="text-red-500">*</span>
            </label>
            <input
              id="shipping-address-1"
              type="text"
              value={shippingAddressLine1}
              onChange={(event) => onShippingAddressLine1Change(event.target.value)}
              placeholder="House number and street name"
              className={`${getFieldClass(Boolean(fieldErrors.shippingAddressLine1))} h-11 px-3`}
              aria-invalid={Boolean(fieldErrors.shippingAddressLine1)}
              aria-describedby={fieldErrors.shippingAddressLine1 ? "checkout-shipping-address-error" : undefined}
            />
            <input
              id="shipping-address-2"
              type="text"
              value={shippingAddressLine2}
              onChange={(event) => onShippingAddressLine2Change(event.target.value)}
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="h-11 w-full rounded-none border border-[#E8E8E5] bg-transparent px-3 text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            />
            {fieldErrors.shippingAddressLine1 ? (
              <p id="checkout-shipping-address-error" className="text-xs text-red-600" role="alert">
                {fieldErrors.shippingAddressLine1}
              </p>
            ) : null}
          </div>

          {deliveryZones.length > 0 ? (
            <div className="space-y-1.5">
              <label htmlFor="shipping-zone" className="text-[13px] font-medium text-[#1A1A1A]">
                Town / City <span className="text-red-500">*</span>
              </label>
              <select
                id="shipping-zone"
                value={shippingZoneId}
                onChange={(event) => onShippingZoneIdChange(event.target.value)}
                className={`${getFieldClass(Boolean(fieldErrors.shippingZoneId))} h-11 px-3`}
                aria-invalid={Boolean(fieldErrors.shippingZoneId)}
                aria-describedby={fieldErrors.shippingZoneId ? "checkout-shipping-zone-error" : undefined}
              >
                <option value="">Select city</option>
                {deliveryZones.map((zone) => (
                  <option key={`shipping-zone-${zone.id}`} value={zone.id}>
                    {zone.name} — {formatPrice(zone.price)}
                  </option>
                ))}
              </select>
              {fieldErrors.shippingZoneId ? (
                <p id="checkout-shipping-zone-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.shippingZoneId}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="order-notes" className="text-[13px] font-medium text-[#1A1A1A]">
          Order notes (optional)
        </label>
        <textarea
          id="order-notes"
          rows={7}
          value={orderNotes}
          onChange={(event) => onOrderNotesChange(event.target.value)}
          placeholder="Notes about your order, e.g. special notes for delivery."
          className="w-full resize-y rounded-none border border-[#D7D7D2] bg-transparent p-3 text-sm text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
        />
      </div>
    </div>
  )
}
