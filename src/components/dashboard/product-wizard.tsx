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
  Loader2,
  Ruler,
  Tag,
  Eye,
  CircleDot,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/dashboard/button";
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
    id: "details",
    label: "Details",
    description: "Name & description",
    icon: Package,
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "Price & variants",
    icon: DollarSign,
  },
  {
    id: "media",
    label: "Media",
    description: "Product image",
    icon: ImageIcon,
  },
  {
    id: "review",
    label: "Review",
    description: "Confirm & publish",
    icon: Eye,
  },
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
    mode: "onChange",
  });

  const { watch, trigger } = form;
  const formData = watch();

  const handleNext = async () => {
    let stepValid = true;

    if (currentStep === 0) {
      stepValid = await trigger(["name", "description", "category"]);
    } else if (currentStep === 1) {
      stepValid = await trigger(["price", "sizes", "isAvailable"]);
    } else if (currentStep === 2) {
      stepValid = await trigger(["imageUrl"]);
    }

    if (stepValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error("Please fill in all required fields");
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
      x: direction > 0 ? 16 : -16,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 16 : -16,
      opacity: 0,
    }),
  };

  const completedFields = () => {
    let count = 0;
    const total = 7;
    if (formData.name) count++;
    if (formData.description) count++;
    if (formData.category) count++;
    if (formData.price > 0) count++;
    if (formData.sizes) count++;
    if (formData.imageUrl) count++;
    count++; // isAvailable always has a value
    return { count, total, percent: Math.round((count / total) * 100) };
  };

  const progress = completedFields();

  return (
    <div className="w-full max-w-5xl mx-auto flex gap-8">
      {/* Left Sidebar - Steps */}
      <div className="hidden lg:flex flex-col w-56 shrink-0">
        <div className="sticky top-8 space-y-1">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (index < currentStep) {
                    setDirection(index < currentStep ? -1 : 1);
                    setCurrentStep(index);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
                  isActive
                    ? "bg-primary/5 text-foreground"
                    : isCompleted
                    ? "text-foreground hover:bg-muted/50 cursor-pointer"
                    : "text-muted-foreground/60 cursor-default"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-muted text-muted-foreground/40"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate">{step.description}</span>
                </div>
              </button>
            );
          })}

          {/* Progress indicator */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Completion</span>
              <span className="text-xs font-semibold text-foreground">{progress.percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {progress.count} of {progress.total} fields completed
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="lg:hidden w-full">
        <div className="flex items-center gap-2 mb-6 px-1">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  index <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col min-h-[560px]">
          {/* Step Content */}
          <div className="flex-1 p-6 sm:p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full flex flex-col"
              >
                {/* Step Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-1">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground font-poppins">
                    {currentStep === 0 && "Product Details"}
                    {currentStep === 1 && "Pricing & Variants"}
                    {currentStep === 2 && "Product Image"}
                    {currentStep === 3 && "Review & Publish"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 font-poppins">
                    {currentStep === 0 && "Enter the basic information about your product."}
                    {currentStep === 1 && "Set the price, sizes, and availability."}
                    {currentStep === 2 && "Upload a clear photo to showcase your product."}
                    {currentStep === 3 && "Review everything before publishing."}
                  </p>
                </div>

                <div className="flex-1 max-w-lg">
                  {/* Step 0: Details */}
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g. Classic Leather Watch"
                          {...form.register("name")}
                          className="h-11 rounded-lg border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                        />
                        {form.formState.errors.name && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your product in detail..."
                          className="min-h-[120px] rounded-lg border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none text-sm leading-relaxed"
                          {...form.register("description")}
                        />
                        {form.formState.errors.description && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {form.formState.errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between font-normal h-11 rounded-lg border-border bg-background hover:bg-accent transition-all text-sm"
                            >
                              <span className={watch("category") ? "text-foreground" : "text-muted-foreground"}>
                                {watch("category") || "Select a category"}
                              </span>
                              <Layers className="h-4 w-4 opacity-40" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) p-1 rounded-xl border border-border shadow-lg"
                            align="start"
                          >
                            {["Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty"].map(
                              (cat) => (
                                <DropdownMenuItem
                                  key={cat}
                                  onClick={() => form.setValue("category", cat, { shouldValidate: true })}
                                  className="cursor-pointer py-2.5 px-3 rounded-lg text-sm"
                                >
                                  {cat}
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {form.formState.errors.category && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Pricing */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price (KES) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-sm font-medium text-muted-foreground">KES</span>
                          </div>
                          <Input
                            type="number"
                            id="price"
                            placeholder="0.00"
                            className="pl-14 h-12 rounded-lg border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-lg font-medium font-poppins tabular-nums"
                            {...form.register("price")}
                          />
                        </div>
                        {form.formState.errors.price && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {form.formState.errors.price.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Available Sizes</Label>
                        <div className="flex flex-wrap gap-2">
                          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                            const currentSizes =
                              watch("sizes")
                                ?.split(",")
                                .map((s) => s.trim())
                                .filter(Boolean) || [];
                            const isSelected = currentSizes.includes(size);

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => {
                                  let newSizes;
                                  if (isSelected) {
                                    newSizes = currentSizes.filter((s) => s !== size);
                                  } else {
                                    newSizes = [...currentSizes, size];
                                  }
                                  form.setValue("sizes", newSizes.join(", "), { shouldValidate: true });
                                }}
                                className={cn(
                                  "h-10 px-4 rounded-lg text-sm font-medium transition-all border",
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                )}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                        <Input
                          placeholder="Or type custom sizes (e.g. 40, 41, 42)"
                          {...form.register("sizes")}
                          className="h-11 rounded-lg border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                        />
                        {form.formState.errors.sizes && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {form.formState.errors.sizes.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="space-y-0.5">
                          <Label htmlFor="isAvailable" className="text-sm font-medium">
                            Available for purchase
                          </Label>
                          <p className="text-xs text-muted-foreground">Customers can find and buy this product</p>
                        </div>
                        <Switch
                          id="isAvailable"
                          checked={watch("isAvailable")}
                          onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Media */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-dashed border-border p-6 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="max-w-sm mx-auto">
                          <ImageUpload
                            value={watch("imageUrl")}
                            onChange={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                            endpoint="productImage"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Upload a high-quality image. Recommended size: 800x800px.
                      </p>
                      {form.formState.errors.imageUrl && (
                        <p className="text-xs text-red-500 flex items-center justify-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.imageUrl.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      {/* Product Preview Card */}
                      <div className="rounded-xl border border-border overflow-hidden bg-background">
                        <div className="flex flex-col sm:flex-row">
                          {/* Image */}
                          <div className="sm:w-40 sm:h-auto h-48 bg-muted shrink-0 overflow-hidden">
                            {formData.imageUrl ? (
                              <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 p-5 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-semibold text-lg text-foreground font-poppins leading-tight">
                                  {formData.name || "Untitled Product"}
                                </h3>
                                {formData.category && (
                                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                    <Tag className="h-3 w-3" />
                                    {formData.category}
                                  </span>
                                )}
                              </div>
                              <span className="text-base font-semibold text-foreground font-poppins tabular-nums whitespace-nowrap">
                                KES {Number(formData.price).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {formData.description || "No description."}
                            </p>

                            <div className="flex items-center gap-4 pt-1">
                              {formData.sizes && (
                                <div className="flex items-center gap-1.5">
                                  <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{formData.sizes}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <CircleDot
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    formData.isAvailable ? "text-emerald-500" : "text-muted-foreground"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    formData.isAvailable ? "text-emerald-600" : "text-muted-foreground"
                                  )}
                                >
                                  {formData.isAvailable ? "Active" : "Draft"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Field Summary */}
                      <div className="rounded-xl border border-border divide-y divide-border">
                        {[
                          { label: "Name", value: formData.name },
                          { label: "Description", value: formData.description, truncate: true },
                          { label: "Category", value: formData.category },
                          { label: "Price", value: formData.price ? `KES ${Number(formData.price).toLocaleString()}` : "" },
                          { label: "Sizes", value: formData.sizes },
                          { label: "Status", value: formData.isAvailable ? "Active" : "Draft" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <span
                              className={cn(
                                "text-sm font-medium text-right max-w-[60%]",
                                item.value ? "text-foreground" : "text-muted-foreground/40 italic",
                                item.truncate && "truncate"
                              )}
                            >
                              {item.value || "Not set"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 bg-muted/30 border-t border-border flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={cn(
                "gap-2 text-muted-foreground hover:text-foreground rounded-lg h-10 px-4 text-sm",
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-6 h-10 rounded-lg text-sm font-medium min-w-[140px]"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Publish Product
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-6 h-10 rounded-lg text-sm font-medium min-w-[120px]"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
