"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Camera, 
  Star, 
  CheckCircle2, 
  Upload, 
  Sparkles,
  Loader2,
  Gift
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
  store: any;
  products: any[];
}

export function ShareClient({ store, products }: ShareClientProps) {
  const router = useRouter();
  const { brandColor } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
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
        rating: formData.rating,
        comment: formData.comment,
        imageUrl: formData.imageUrl
      });

      if (res.success) {
        setSuccess(true);
        toast.success("Thank you for sharing!");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-8 ring-8 ring-green-50/50">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-sora mb-4">You're Amazing!</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto mb-10 font-light leading-relaxed">
          Thank you for sharing your purchase. We've received your photo and it will be featured on our store once approved.
        </p>
        
        {store.rewardConfig?.isEnabled && (
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] w-full max-w-sm mb-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <Gift className="h-8 w-8 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Your Reward Code</p>
                    <h2 className="text-3xl font-black font-sora tracking-widest">{store.rewardConfig.couponCode}</h2>
                    <p className="text-sm text-gray-400">{store.rewardConfig.successMessage || "Use this code for a discount on your next order."}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                    <Sparkles className="h-32 w-32" />
                </div>
            </div>
        )}

        <Button 
            onClick={() => router.push(`/${store.slug}`)}
            className="rounded-full px-10 h-14 text-base font-bold transition-all hover:scale-105"
            style={{ backgroundColor: brandColor }}
        >
          Back to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="container mx-auto px-4 md:px-6 pt-28">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-16">
            <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors mb-4"
            >
                <ArrowLeft className="h-3 w-3" /> Go Back
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 font-sora tracking-tighter leading-none">
                Share the <span className="italic" style={{ color: brandColor }}>Love.</span>
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed">
                Upload a photo of your purchase and get featured on our store gallery.
            </p>
        </div>

        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* 1. The Photo */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-900 text-white text-xs font-bold">1</div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Upload Your Photo</h3>
                    </div>
                    <div className="relative group">
                        <ImageUpload 
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            endpoint="imageUploader"
                        />
                    </div>
                </div>

                {/* 2. Details */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-t border-gray-100 pt-12">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-900 text-white text-xs font-bold">2</div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">A Few Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Name</Label>
                            <Input 
                                placeholder="e.g. Sarah J."
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product (Optional)</Label>
                            <Select 
                                value={formData.productId} 
                                onValueChange={(val) => setFormData({ ...formData, productId: val })}
                            >
                                <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all">
                                    <SelectValue placeholder="Select an item" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={p.id} className="cursor-pointer focus:bg-gray-50 rounded-lg">
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</Label>
                        <div className="flex items-center gap-2 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="transition-transform active:scale-90"
                                >
                                    <Star 
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            formData.rating >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                        )} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</Label>
                        <Textarea 
                            placeholder="Tell us what you loved about it..."
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all resize-none"
                            required
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-white flex items-center justify-center gap-3 tracking-tight uppercase"
                        style={{ backgroundColor: brandColor }}
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-6 w-6 fill-current" />
                                Submit to Gallery
                            </>
                        )}
                    </Button>
                    <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest font-bold">
                        Photos are approved by store owner before being public
                    </p>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}
