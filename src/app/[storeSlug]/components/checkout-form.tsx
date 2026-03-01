"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MessageCircle, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStore } from "./store-context";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid delivery address"),
  notes: z.string().optional(),
  discountCode: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "mpesa"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
  totalAmount: number;
  currency: string;
}

export function CheckoutForm({ onSubmit, isLoading, totalAmount, currency }: CheckoutFormProps) {
  const { brandColor } = useStore();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      discountCode: "",
      paymentMethod: "whatsapp",
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 font-dm-sans">

      {/* 1. Contact */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 pb-3 border-b border-stone-100">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-stone-700">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className={cn("h-12 rounded-xl border-stone-200 bg-white font-dm-sans focus:border-stone-400 transition-colors", errors.name && "border-red-300")}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-stone-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={cn("h-12 rounded-xl border-stone-200 bg-white font-dm-sans focus:border-stone-400 transition-colors", errors.email && "border-red-300")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-stone-700">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                {...register("phone")}
                className={cn("h-12 rounded-xl border-stone-200 bg-white font-dm-sans focus:border-stone-400 transition-colors", errors.phone && "border-red-300")}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Delivery */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 pb-3 border-b border-stone-100">
          Delivery
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-stone-700">Delivery Address</Label>
            <Textarea
              id="address"
              placeholder="Street name, Apartment, Region..."
              {...register("address")}
              className={cn("min-h-[80px] rounded-xl border-stone-200 bg-white font-dm-sans resize-none focus:border-stone-400 transition-colors", errors.address && "border-red-300")}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-medium text-stone-700">
              Notes <span className="text-stone-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions?"
              {...register("notes")}
              className="min-h-[60px] rounded-xl border-stone-200 bg-white font-dm-sans resize-none focus:border-stone-400 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discountCode" className="text-sm font-medium text-stone-700">
              Discount Code <span className="text-stone-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="discountCode"
              placeholder="Enter your reward code"
              {...register("discountCode")}
              className="h-12 rounded-xl border-stone-200 bg-white font-dm-sans uppercase focus:border-stone-400 transition-colors"
            />
            <p className="text-xs text-stone-400">
              Reward codes are one-time and tied to your phone number.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Payment */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 pb-3 border-b border-stone-100">
          Payment
        </h3>
        <RadioGroup value={paymentMethod} onValueChange={(val) => setValue("paymentMethod", val as "whatsapp" | "mpesa")} className="space-y-3">
          <Label
            htmlFor="whatsapp"
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
              paymentMethod === "whatsapp" ? "border-stone-900 bg-stone-50" : "border-stone-200 bg-white hover:border-stone-300"
            )}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="whatsapp" id="whatsapp" className="border-stone-300" />
              <div>
                <span className="font-semibold text-stone-900 text-sm">WhatsApp</span>
                <p className="text-xs text-stone-400">Complete order via chat</p>
              </div>
            </div>
            <MessageCircle className={cn("h-5 w-5", paymentMethod === "whatsapp" ? "text-stone-900" : "text-stone-300")} />
          </Label>

          <Label
            htmlFor="mpesa"
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
              paymentMethod === "mpesa"
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 bg-white hover:border-stone-300"
            )}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="mpesa" id="mpesa" className="border-stone-300" />
              <div>
                <span className="font-semibold text-stone-900 text-sm">M-Pesa</span>
                <p className="text-xs text-stone-400">Receive an STK push on your phone</p>
              </div>
            </div>
            <CreditCard className={cn("h-5 w-5", paymentMethod === "mpesa" ? "text-stone-900" : "text-stone-300")} />
          </Label>
        </RadioGroup>
      </div>

      {/* Submit */}
      <div className="pt-4 space-y-4">
        <Button
          type="submit"
          className="w-full h-14 rounded-xl text-sm font-bold transition-all active:scale-[0.99] shadow-md"
          style={{ backgroundColor: brandColor, color: "white" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            <>Place Order — {currency} {totalAmount.toLocaleString()}</>
          )}
        </Button>
        <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure checkout by <span className="[font-family:var(--font-instrument-serif)] text-base font-normal tracking-tight ml-0.5">Orderform</span>
        </div>
      </div>
    </form>
  );
}
