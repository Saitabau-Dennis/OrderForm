"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MessageCircle, CreditCard, Banknote, ShieldCheck } from "lucide-react";
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
  paymentMethod: z.enum(["whatsapp", "mpesa"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
  totalAmount: number;
    currency: string;
    hideSummary?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading, totalAmount, currency, hideSummary = false }: CheckoutFormProps) {
  const { brandColor } = useStore();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      paymentMethod: "whatsapp",
    },
  });

  const { register, handleSubmit, setValue, formState: { errors } } = form;
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-6">

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">1</div>
            <h3 className="font-bold text-gray-900 font-sora">Contact Information</h3>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              {...register("name")}
              className={cn("h-11 bg-gray-50 border-gray-100 focus:bg-white transition-all", errors.name && "border-red-300 focus:border-red-300")}
            />
            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</Label>
               <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={cn("h-11 bg-gray-50 border-gray-100 focus:bg-white transition-all", errors.email && "border-red-300 focus:border-red-300")}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
               <Label htmlFor="phone" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Phone</Label>
               <Input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                {...register("phone")}
                className={cn("h-11 bg-gray-50 border-gray-100 focus:bg-white transition-all", errors.phone && "border-red-300 focus:border-red-300")}
              />
              {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">2</div>
            <h3 className="font-bold text-gray-900 font-sora">Delivery Details</h3>
        </div>

        <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Delivery Address</Label>
            <Textarea
                id="address"
                placeholder="Street name, Apartment, Region..."
                {...register("address")}
                className={cn("min-h-[80px] bg-gray-50 border-gray-100 focus:bg-white transition-all resize-none", errors.address && "border-red-300 focus:border-red-300")}
            />
            {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
             <Label htmlFor="notes" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Order Notes (Optional)</Label>
            <Textarea
                id="notes"
                placeholder="Any special instructions for delivery?"
                {...register("notes")}
                className="min-h-[60px] bg-gray-50 border-gray-100 focus:bg-white transition-all resize-none"
            />
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">3</div>
            <h3 className="font-bold text-gray-900 font-sora">Payment Method</h3>
        </div>

        <RadioGroup value={paymentMethod} onValueChange={(val) => setValue("paymentMethod", val as "whatsapp" | "mpesa")} className="grid gap-3">

            <Label
              htmlFor="whatsapp"
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all",
                paymentMethod === "whatsapp" ? "border-green-500 bg-green-50" : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="whatsapp" id="whatsapp" className="border-gray-300 text-green-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900">Pay via WhatsApp</span>
                        <span className="text-xs text-gray-500">Complete order with agent</span>
                    </div>
                </div>
                <MessageCircle className="h-5 w-5 text-green-600" />
            </Label>

            <Label
              htmlFor="mpesa"
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all relative overflow-hidden grayscale opacity-60 cursor-not-allowed",
                paymentMethod === "mpesa" ? "border-green-600 bg-green-50" : "border-gray-100 bg-gray-50"
              )}
            >
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="mpesa" id="mpesa" disabled className="border-gray-300 text-green-600" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">M-Pesa</span>
                            <span className="bg-gray-200 text-gray-600 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Coming Soon</span>
                        </div>
                        <span className="text-xs text-gray-500">Automatic payment execution</span>
                    </div>
                </div>
                 <CreditCard className="h-5 w-5 text-gray-400" />
            </Label>
        </RadioGroup>
      </div>

       {/* Order Summary & Actions */}
       <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-gray-900">
                <span>Total to Pay</span>
                <span className="text-xl">{currency} {totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-100">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure checkout powered by OrderForm</span>
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                style={{
                  backgroundColor: brandColor,
                  color: "white"
                }}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                    </>
                ) : (
                    paymentMethod === "whatsapp" ? "Complete on WhatsApp" : "Pay with M-Pesa"
                )}
            </Button>
       </div>
    </form>
  );
}
