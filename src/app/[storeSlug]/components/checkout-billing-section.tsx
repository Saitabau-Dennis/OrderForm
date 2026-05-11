import type {
  CheckoutFieldErrors,
  CheckoutFormData,
  DeliveryZone,
} from "./checkout-form-types"

type BillingSectionProps = {
  firstNamePart: string
  lastNamePart: string
  fieldErrors: CheckoutFieldErrors
  formData: CheckoutFormData
  hasAnyShippingMethod: boolean
  enableDelivery: boolean
  enableShopPickup: boolean
  shopPickupInstructions?: string | null
  shipToDifferentAddress: boolean
  deliveryZones: DeliveryZone[]
  billingAddressLineTwo: string
  emailAddress: string
  formatPrice: (price: number) => string
  getFieldClass: (hasError: boolean) => string
  onNameChange: (nextName: string) => void
  onFieldValueChange: (field: keyof CheckoutFormData, value: string) => void
  onBillingAddressLineTwoChange: (value: string) => void
  onEmailAddressChange: (value: string) => void
}

export function CheckoutBillingSection({
  firstNamePart,
  lastNamePart,
  fieldErrors,
  formData,
  hasAnyShippingMethod,
  enableDelivery,
  enableShopPickup,
  shopPickupInstructions,
  shipToDifferentAddress,
  deliveryZones,
  billingAddressLineTwo,
  emailAddress,
  formatPrice,
  getFieldClass,
  onNameChange,
  onFieldValueChange,
  onBillingAddressLineTwoChange,
  onEmailAddressChange,
}: BillingSectionProps) {
  const billingAddressRequired =
    formData.deliveryMethod === "delivery" && !shipToDifferentAddress
  const billingZoneRequired =
    formData.deliveryMethod === "delivery" &&
    deliveryZones.length > 0 &&
    !shipToDifferentAddress
  const showBillingAddressFields =
    formData.deliveryMethod === "delivery" && !shipToDifferentAddress

  return (
    <div className="space-y-5 border border-[#E2E2DD] p-4 sm:p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] sm:text-[30px]">Billing Details</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="first-name" className="text-[13px] font-medium text-[#1A1A1A]">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="first-name"
            type="text"
            value={firstNamePart}
            onChange={(event) => {
              const nextName = [event.target.value, lastNamePart].filter(Boolean).join(" ")
              onNameChange(nextName)
            }}
            className={`${getFieldClass(Boolean(fieldErrors.name))} h-11 px-3`}
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="last-name" className="text-[13px] font-medium text-[#1A1A1A]">
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            id="last-name"
            type="text"
            value={lastNamePart}
            onChange={(event) => {
              const nextName = [firstNamePart, event.target.value].filter(Boolean).join(" ")
              onNameChange(nextName)
            }}
            className={`${getFieldClass(Boolean(fieldErrors.name))} h-11 px-3`}
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </div>
      </div>

      {fieldErrors.name ? (
        <p id="checkout-name-error" className="text-xs text-red-600" role="alert">
          {fieldErrors.name}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <p className="text-[13px] font-medium text-[#1A1A1A]">
          Country / Region <span className="text-red-500">*</span>
        </p>
        <p className="text-[22px] font-semibold leading-none tracking-tight text-[#1A1A1A] sm:text-[24px]">Kenya</p>
      </div>

      {hasAnyShippingMethod ? (
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-[#1A1A1A]">
            Shipping Method <span className="text-red-500">*</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {enableDelivery ? (
              <label className="flex cursor-pointer items-center gap-2 rounded-none border border-[#DADAD5] px-3 py-2">
                <input
                  type="radio"
                  name="delivery-method"
                  checked={formData.deliveryMethod === "delivery"}
                  onChange={() => onFieldValueChange("deliveryMethod", "delivery")}
                  className="h-4 w-4 accent-[#1A1A1A]"
                />
                <span className="text-sm text-[#1A1A1A]">Delivery</span>
              </label>
            ) : null}
            {enableShopPickup ? (
              <label className="flex cursor-pointer items-center gap-2 rounded-none border border-[#DADAD5] px-3 py-2">
                <input
                  type="radio"
                  name="delivery-method"
                  checked={formData.deliveryMethod === "shop_pickup"}
                  onChange={() => onFieldValueChange("deliveryMethod", "shop_pickup")}
                  className="h-4 w-4 accent-[#1A1A1A]"
                />
                <span className="text-sm text-[#1A1A1A]">Shop Pickup (Free)</span>
              </label>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-none border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          This store has no shipping method enabled. Please contact the store owner.
        </div>
      )}

      {showBillingAddressFields ? (
        <>
          <div className="space-y-1.5">
            <label htmlFor="deliveryAddress" className="text-[13px] font-medium text-[#1A1A1A]">
              Billing street address{" "}
              {billingAddressRequired ? (
                <span className="text-red-500">*</span>
              ) : (
                <span className="text-[#737373]">(optional)</span>
              )}
            </label>
            <input
              id="deliveryAddress"
              type="text"
              value={formData.deliveryAddress}
              onChange={(event) => onFieldValueChange("deliveryAddress", event.target.value)}
              placeholder="House number and street name"
              className={`${getFieldClass(Boolean(fieldErrors.deliveryAddress))} h-11 px-3`}
              aria-invalid={Boolean(fieldErrors.deliveryAddress)}
              aria-describedby={fieldErrors.deliveryAddress ? "checkout-address-error" : undefined}
            />
            <input
              id="deliveryAddress-2"
              type="text"
              value={billingAddressLineTwo}
              onChange={(event) => onBillingAddressLineTwoChange(event.target.value)}
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="h-11 w-full rounded-none border border-[#E8E8E5] bg-transparent px-3 text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            />
            {fieldErrors.deliveryAddress ? (
              <p id="checkout-address-error" className="text-xs text-red-600" role="alert">
                {fieldErrors.deliveryAddress}
              </p>
            ) : null}
          </div>

          {deliveryZones.length > 0 ? (
            <div className="space-y-1.5">
              <label htmlFor="zone" className="text-[13px] font-medium text-[#1A1A1A]">
                Town / City{" "}
                {billingZoneRequired ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-[#737373]">(optional)</span>
                )}
              </label>
              <select
                id="zone"
                value={formData.zoneId}
                onChange={(event) => onFieldValueChange("zoneId", event.target.value)}
                className={`${getFieldClass(Boolean(fieldErrors.zoneId))} h-11 px-3`}
                aria-invalid={Boolean(fieldErrors.zoneId)}
                aria-describedby={fieldErrors.zoneId ? "checkout-zone-error" : undefined}
              >
                <option value="">Select city</option>
                {deliveryZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {formatPrice(zone.price)}
                  </option>
                ))}
              </select>
              {fieldErrors.zoneId ? (
                <p id="checkout-zone-error" className="text-xs text-red-600" role="alert">
                  {fieldErrors.zoneId}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : formData.deliveryMethod === "shop_pickup" ? (
        <div className="rounded-none border border-[#DADAD5] bg-[#EEF2EC] px-3 py-2 text-sm text-[#4B4B46]">
          {shopPickupInstructions?.trim() || "You can pick up your order from the shop after confirmation."}
        </div>
      ) : null}

      <div className="space-y-1.5 border-t border-[#ECECE8] pt-5">
        <label htmlFor="phone" className="text-[13px] font-medium text-[#1A1A1A]">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(event) => onFieldValueChange("phone", event.target.value)}
          placeholder="+254 712345678"
          className={`${getFieldClass(Boolean(fieldErrors.phone))} h-11 px-3`}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "checkout-phone-error" : undefined}
        />
        {fieldErrors.phone ? (
          <p id="checkout-phone-error" className="text-xs text-red-600" role="alert">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email-address" className="text-[13px] font-medium text-[#1A1A1A]">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          id="email-address"
          type="email"
          value={emailAddress}
          onChange={(event) => onEmailAddressChange(event.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-none border border-[#E8E8E5] bg-transparent px-3 text-sm text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
        />
      </div>
    </div>
  )
}
