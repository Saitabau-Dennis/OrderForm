"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Package, 
  ImageIcon, 
  DollarSign, 
  Layers, 
  Info,
  Sparkles,
  Loader2,
  Ruler,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { createProduct } from "@/lib/actions/products";
import { productSchema, ProductValues } from "@/components/dashboard/product-form";

interface ProductWizardProps {
  onSuccess: () => void;
}

const steps = [
  {
    id: "intro",
    label: "Start",
    title: "Introduction",
    icon: Sparkles
  },
  {
    id: "details",
    label: "Details",
    title: "Product Info",
    icon: Package
  },
  {
    id: "pricing",
    label: "Pricing",
    title: "Price & Stock",
    icon: DollarSign
  },
  {
    id: "media",
    label: "Media",
    title: "Images",
    icon: ImageIcon
  },
  {
    id: "review",
    label: "Review",
    title: "Confirm",
    icon: Check
  }
];

export function ProductWizard({ onSuccess }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(0);

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      isAvailable: true,
      imageUrl: "",
      sizes: "",
    },
    mode: "onChange"
  });

  const { watch, trigger } = form;
  const formData = watch();

  const handleNext = async () => {
    let stepValid = true;

    if (currentStep === 1) { // Details step
      stepValid = await trigger(["name", "description", "category"]);
    } else if (currentStep === 2) { // Pricing step
      stepValid = await trigger(["price", "sizes", "isAvailable"]);
    } else if (currentStep === 3) { // Media step
      stepValid = await trigger(["imageUrl"]);
    }

    if (stepValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error("Please fill in all required fields to continue");
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await createProduct(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Product created successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
      filter: "blur(5px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
      filter: "blur(5px)"
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Horizontal Stepper */}
      <div className="mb-10">
        <div className="relative flex justify-between items-center w-full px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2 rounded-full" />
            <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative group cursor-default">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white",
                            isActive 
                                ? "border-primary text-primary shadow-lg scale-110" 
                                : isCompleted 
                                    ? "border-primary bg-primary text-white" 
                                    : "border-gray-100 text-gray-300"
                        )}>
                            <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                        </div>
                        <span className={cn(
                            "absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                            isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-gray-300"
                        )}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary/5 overflow-hidden min-h-[500px] flex flex-col relative">
        
        {/* Step Content */}
        <div className="flex-1 p-8 sm:p-12">
             <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="h-full flex flex-col"
                >
                    {/* Header for each step */}
                    <div className="mb-8 text-center space-y-2">
                        <h2 className="text-3xl font-medium font-raleway text-primary tracking-tight">
                            {steps[currentStep].title}
                        </h2>
                        {currentStep === 0 && <p className="text-muted-foreground font-instrument-sans">Follow the steps to add your item</p>}
                        {currentStep === 1 && <p className="text-muted-foreground font-instrument-sans">Enter the basic details of your product</p>}
                        {currentStep === 2 && <p className="text-muted-foreground font-instrument-sans">Set your price and stock status</p>}
                        {currentStep === 3 && <p className="text-muted-foreground font-instrument-sans">Upload a photo to showcase your item</p>}
                        {currentStep === 4 && <p className="text-muted-foreground font-instrument-sans">Verify your details before publishing</p>}
                    </div>

                    <div className="flex-1 max-w-xl mx-auto w-full">
                        {/* Step 0: Intro */}
                        {currentStep === 0 && (
                            <div className="flex flex-col items-center justify-center space-y-8 py-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl opacity-60" />
                                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-primary/10 relative">
                                        <ShoppingBag className="w-16 h-16 text-primary" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4 text-center">
                                    <p className="text-lg text-muted-foreground font-instrument-sans leading-relaxed max-w-md">
                                        Add a new product to your catalog by following this step-by-step process.
                                    </p>
                                    
                                    <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm flex items-start gap-3 text-left border border-blue-100 max-w-md mx-auto mt-4">
                                        <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                                        <p>Ensure your images are clear and your descriptions are detailed to help customers make decisions.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base font-medium">Product Name <span className="text-red-500">*</span></Label>
                                    <Input 
                                        id="name" 
                                        placeholder="e.g. Classic Leather Watch" 
                                        {...form.register("name")} 
                                        className="h-14 rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-primary/20 transition-all text-lg shadow-sm font-normal"
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <Info className="h-3 w-3" />
                                            {form.formState.errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-base font-medium">Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your product..."
                                        className="min-h-[160px] rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-primary/20 transition-all resize-none shadow-sm p-4 text-base font-normal"
                                        {...form.register("description")}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <Info className="h-3 w-3" />
                                            {form.formState.errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-base font-medium">Category <span className="text-red-500">*</span></Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between font-normal h-14 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-primary/20 transition-all shadow-sm">
                                            <span className={watch("category") ? "text-foreground" : "text-muted-foreground"}>
                                                {watch("category") || "Select category"}
                                            </span>
                                            <Layers className="h-4 w-4 opacity-50" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[300px] p-2 rounded-xl border-none shadow-xl" align="start">
                                        {["Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty"].map((cat) => (
                                            <DropdownMenuItem
                                            key={cat}
                                            onClick={() => form.setValue("category", cat, { shouldValidate: true })}
                                            className="cursor-pointer py-3 px-4 rounded-lg focus:bg-primary/5 focus:text-primary text-base font-medium"
                                            >
                                            {cat}
                                            </DropdownMenuItem>
                                        ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {form.formState.errors.category && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <Info className="h-3 w-3" />
                                            {form.formState.errors.category.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-3">
                                    <Label htmlFor="price" className="text-base font-medium">Price (KES) <span className="text-red-500">*</span></Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 z-10">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                        </div>
                                        <Input
                                            type="number"
                                            id="price"
                                            placeholder="0.00"
                                            className="pl-20 h-16 rounded-2xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-primary/20 transition-all text-2xl font-medium font-sora shadow-sm"
                                            {...form.register("price")}
                                        />
                                    </div>
                                    {form.formState.errors.price && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <Info className="h-3 w-3" />
                                            {form.formState.errors.price.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base font-medium flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-primary" />
                                        Available Sizes
                                    </Label>
                                    <div className="flex flex-wrap gap-3">
                                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                                        const currentSizes = watch("sizes")?.split(",").map(s => s.trim()).filter(Boolean) || [];
                                        const isSelected = currentSizes.includes(size);

                                        return (
                                            <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                let newSizes;
                                                if (isSelected) {
                                                newSizes = currentSizes.filter(s => s !== size);
                                                } else {
                                                newSizes = [...currentSizes, size];
                                                }
                                                form.setValue("sizes", newSizes.join(", "), { shouldValidate: true });
                                            }}
                                            className={cn(
                                                "w-12 h-12 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center",
                                                isSelected
                                                ? "bg-primary text-white shadow-primary/20 scale-105"
                                                : "bg-white text-gray-500 border border-gray-100 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                                            )}
                                            >
                                            {size}
                                            </button>
                                        );
                                        })}
                                    </div>
                                    <Input
                                        placeholder="Add custom sizes"
                                        {...form.register("sizes")}
                                        className="h-12 rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-primary/20 transition-all mt-2 font-normal"
                                    />
                                    {form.formState.errors.sizes && (
                                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                            <Info className="h-3 w-3" />
                                            {form.formState.errors.sizes.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm">
                                    <div className="space-y-1">
                                        <Label htmlFor="isAvailable" className="text-base font-medium text-foreground">In Stock</Label>
                                        <p className="text-sm text-muted-foreground">Product is available for purchase</p>
                                    </div>
                                    <Switch
                                        id="isAvailable"
                                        checked={watch("isAvailable")}
                                        onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
                                        className="data-[state=checked]:bg-primary scale-110"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Media */}
                        {currentStep === 3 && (
                            <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-full bg-gray-50/50 rounded-3xl border-2 border-dashed border-primary/20 p-8 flex flex-col justify-center items-center hover:bg-primary/[0.02] transition-colors group">
                                    <div className="w-full max-w-sm transform transition-all group-hover:scale-[1.02] duration-300">
                                        <ImageUpload
                                            value={watch("imageUrl")}
                                            onChange={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                                            endpoint="productImage"
                                        />
                                    </div>
                                    <p className="mt-6 text-sm text-muted-foreground text-center">
                                        Upload a clear image of your product.
                                    </p>
                                </div>
                                {form.formState.errors.imageUrl && (
                                    <p className="text-xs text-red-500 flex items-center justify-center gap-1 mt-2">
                                        <Info className="h-3 w-3" />
                                        {form.formState.errors.imageUrl.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0" />
                                    
                                    <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                        <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-md">
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-4 py-1">
                                            <div>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-2xl font-raleway text-foreground">{formData.name || "Untitled Product"}</h3>
                                                        {formData.category && (
                                                            <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                                                                {formData.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xl font-medium font-sora text-primary bg-primary/5 px-3 py-1 rounded-lg">
                                                        KES {formData.price}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Description</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                    {formData.description || "No description provided."}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6 pt-2">
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1">Sizes</span>
                                                    <span className="font-medium text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{formData.sizes || "N/A"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                                                    <div className={cn("flex items-center gap-1.5 font-medium text-sm px-2 py-1 rounded-md", formData.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                                                        <span className={cn("w-2 h-2 rounded-full", formData.isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                                        {formData.isAvailable ? "Active" : "Draft"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Review your information before finalizing.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
             </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:px-12 bg-white border-t border-gray-50 flex items-center justify-between">
            <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
                className={cn(
                    "gap-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-xl h-12 px-6", 
                    currentStep === 0 && "opacity-0 pointer-events-none"
                )}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            {currentStep === steps.length - 1 ? (
                 <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all px-8 h-12 rounded-xl text-base font-medium min-w-[160px]"
                >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Confirm & Publish
                </Button>
            ) : (
                <Button 
                    onClick={handleNext}
                    className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all px-8 h-12 rounded-xl text-base font-medium min-w-[140px]"
                >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
