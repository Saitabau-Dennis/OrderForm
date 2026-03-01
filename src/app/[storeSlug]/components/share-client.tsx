"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Sparkles,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStore } from "./store-context";
import { ImageUpload } from "@/components/ui/image-upload";
import { submitReview } from "@/lib/actions/reviews";
import { toast } from "sonner";

interface ShareClientProps {
  store: {
    id: string;
    slug: string;
  };
  products: Array<{
    id: string;
    name: string;
  }>;
}

export function ShareClient({ store, products }: ShareClientProps) {
  const router = useRouter();
  const { brandColor } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    customerPhone: "",
    orderRef: "",
    comment: "",
    rating: 5,
    imageUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Please upload a photo of your purchase");
      return;
    }
    setLoading(true);
    try {
      const res = await submitReview({
        storeId: store.id,
        productId: formData.productId || undefined,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        orderRef: formData.orderRef,
        rating: formData.rating,
        comment: formData.comment,
        imageUrl: formData.imageUrl
      });
      if (res.success) {
        setSuccess(true);
        toast.success("Review submitted for approval");
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-dm-sans">
        <CheckCircle2 className="h-12 w-12 mb-6" style={{ color: brandColor }} />
        <h1 className="text-3xl font-extrabold text-stone-900 font-dm-sans mb-3">Thank you!</h1>
        <p className="text-stone-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Your review is pending approval. Once approved, your discount code will be available in your review confirmation.
        </p>

        <Button
          onClick={() => router.push(`/${store.slug}`)}
          className="rounded-xl h-12 px-10 text-sm font-semibold text-white"
          style={{ backgroundColor: brandColor }}
        >
          Back to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-dm-sans">
      <div className="container mx-auto px-5 md:px-8 pt-28 max-w-lg">

        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-800 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" /> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-[-0.03em] font-dm-sans mb-3">
            Share your purchase
          </h1>
          <p className="text-stone-500 leading-relaxed">
            Upload a photo from your purchase. After approval, you'll get a discount code for your next order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">Photo</Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              endpoint="imageUploader"
            />
          </div>

          {/* Name + Product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">Your Name</Label>
              <Input
                placeholder="Sarah J."
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="h-12 rounded-xl border-stone-200 bg-white font-dm-sans"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">Phone Number</Label>
              <Input
                placeholder="0712 345 678"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="h-12 rounded-xl border-stone-200 bg-white font-dm-sans"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">Order Reference</Label>
              <Input
                placeholder="e.g. FASH1234"
                value={formData.orderRef}
                onChange={(e) => setFormData({ ...formData, orderRef: e.target.value })}
                className="h-12 rounded-xl border-stone-200 bg-white font-dm-sans"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700">
                Product <span className="text-stone-400 font-normal">(optional)</span>
              </Label>
              <Select value={formData.productId} onValueChange={(val) => setFormData({ ...formData, productId: val })}>
                <SelectTrigger className="h-12 rounded-xl border-stone-200 bg-white font-dm-sans">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-stone-200">
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="rounded-lg">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">Rating</Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <Star className={cn("h-7 w-7", formData.rating >= star ? "fill-amber-400 text-amber-400" : "text-stone-200")} />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-stone-700">Your thoughts</Label>
            <Textarea
              placeholder="What did you love about it?"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="min-h-[100px] rounded-xl border-stone-200 bg-white font-dm-sans resize-none"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: brandColor }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
