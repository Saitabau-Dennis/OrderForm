"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { productSchema } from "@/components/dashboard/product-form";
import { Button } from "@/components/dashboard/dashboard-button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { createProduct, getStoreCategories } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

interface ProductWizardProps {
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = ["Men","Women","Unisex"];
const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const wizardSchema = productSchema.extend({
  // Wizard permits empty image so merchants can publish quickly and update media later.
  imageUrl: z.string().optional().default(""),
});
type WizardFormInput = z.input<typeof wizardSchema>;
type WizardFormValues = z.output<typeof wizardSchema>;

const stripRichText = (value?: string) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const STEPS = [
  {
    id: "details",
    label: "Product Details",
    description: "Enter the product basics",
    fields: ["name", "description", "category"] as Array<keyof WizardFormValues>,
  },
  {
    id: "pricing",
    label: "Pricing Setup",
    description: "Set prices and variants",
    fields: ["price", "sizes", "isAvailable"] as Array<keyof WizardFormValues>,
  },
  {
    id: "media",
    label: "Product Media",
    description: "Upload one product image",
    fields: ["imageUrl"] as Array<keyof WizardFormValues>,
  },
  {
    id: "review",
    label: "Summary",
    description: "Review and confirm",
    fields: [] as Array<keyof WizardFormValues>,
  },
] as const;

export function ProductWizard({ onSuccess }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<string[]>([
    "Men", "Women", "Unisex"
  ]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getStoreCategories();
        if (response.success && response.categories) {
          const merged = new Set([...response.categories, "Men", "Women", "Unisex"]);
          setCategories(Array.from(merged));
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const form = useForm<WizardFormInput, unknown, WizardFormValues>({
    resolver: zodResolver(wizardSchema),
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

  const formData = form.watch();
  const plainDescription = stripRichText(formData.description);
  const selectedSizes = (formData.sizes || "")
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    if (nextStep < currentStep) {
      setCurrentStep(nextStep);
      return;
    }

    // Validate only the current step fields before allowing forward navigation.
    const valid = await form.trigger(STEPS[currentStep].fields);
    if (!valid) {
      toast.error("Please complete required fields first.");
      return;
    }

    setCurrentStep(nextStep);
  };

  const onSubmit = async (data: WizardFormValues) => {
    if (currentStep !== STEPS.length - 1) {
      setCurrentStep(STEPS.length - 1);
      toast.error("Please review the summary before creating the product.");
      return;
    }

    try {
      setLoading(true);
      const result = await createProduct(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Product created successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateClick = form.handleSubmit(onSubmit);

  return (
    <div className="mx-auto max-w-[1200px] min-h-[540px] rounded-xl border border-border bg-card p-6 sm:p-8">
      <div>
        <p className="text-base font-medium text-foreground">New Product Steps</p>
        <p className="text-sm text-muted-foreground mt-1">
          Follow the simple 4 steps to complete product setup.
        </p>
      </div>

      <div className="mt-10 grid min-h-[430px] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-full">
          <div className="relative h-full flex flex-col justify-between">
            <div className="absolute right-3 top-4 bottom-4 border-r-2 border-dotted border-border/80" />

            {STEPS.map((step, index) => {
              const isDone = index < currentStep;
              const isActive = index === currentStep;

              return (
                <Button
                  key={step.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => goToStep(index)}
                  className="h-auto w-full items-start justify-between gap-3 px-0 py-4 text-left hover:bg-transparent"
                >
                  <div className="pr-2">
                    <p className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>

                  <span
                    className={cn(
                      "relative z-10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-medium bg-card",
                      isDone
                        ? "border-primary text-primary"
                        : isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                </Button>
              );
            })}
          </div>
        </aside>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="min-w-0 h-full flex flex-col"
        >
          <div className="max-w-3xl flex-1">
            {currentStep === 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">Product Name</Label>
                  <p className="text-[11px] text-muted-foreground">Customer-facing name used in product listings.</p>
                  <Input id="name" placeholder="e.g. Classic Leather Watch" className="h-10 rounded-md" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
                </div>

                <div className="space-y-1.5 relative" ref={categoryWrapperRef}>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="text-[11px] text-muted-foreground">Helps shoppers find the product faster.</p>
                  <Input
                    id="category"
                    placeholder="e.g. Vintage Apparel"
                    autoComplete="off"
                    {...form.register("category")}
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                    className="h-10 rounded-md bg-background w-full"
                  />

                  {isCategoryDropdownOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 rounded-md border border-border/80 bg-white shadow-xl max-h-[220px] overflow-y-auto py-1 px-1 animate-in fade-in slide-in-from-top-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                       {categories
                        .filter(cat => {
                           const currentInput = form.watch("category") || "";
                           return currentInput.trim() === "" || cat.toLowerCase().includes(currentInput.toLowerCase());
                        })
                        .map((cat) => (
                          <div
                            key={cat}
                            onMouseDown={(e) => {
                              e.preventDefault();
                            }}
                            onClick={() => {
                              form.setValue("category", cat, { shouldDirty: true, shouldValidate: true });
                              setIsCategoryDropdownOpen(false);
                            }}
                            className="rounded-sm p-2 cursor-pointer hover:bg-muted font-normal text-sm transition-colors flex items-center"
                          >
                           {cat}
                          </div>
                      ))}
                      {categories.filter(cat => {
                           const currentInput = form.watch("category") || "";
                           return currentInput.trim() === "" || cat.toLowerCase().includes(currentInput.toLowerCase());
                      }).length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                           Press enter to create &quot;{form.watch("category")}&quot;
                        </div>
                      )}
                    </div>
                  )}

                  {form.formState.errors.category && <p className="text-xs text-red-500 relative z-0">{form.formState.errors.category.message}</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="description" className="text-sm text-muted-foreground">Description</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Add highlights, materials, care details, or key selling points.
                  </p>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Describe your product..."
                        toolbar="advanced"
                        className="min-h-[170px]"
                      />
                    )}
                  />
                  {form.formState.errors.description && (
                    <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-sm text-muted-foreground">Price</Label>
                  <p className="text-[11px] text-muted-foreground">Set the selling price in Kenyan Shillings.</p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">KES</span>
                    <Input id="price" type="number" placeholder="0.00" className="h-10 rounded-md pl-12" {...form.register("price")} />
                  </div>
                  {form.formState.errors.price && <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sizes" className="text-sm text-muted-foreground">Sizes / Variants</Label>
                  <p className="text-[11px] text-muted-foreground">List options customers can choose at checkout.</p>
                  <Input id="sizes" placeholder="e.g. XS, S, M" className="h-10 rounded-md" {...form.register("sizes")} />
                  {form.formState.errors.sizes && <p className="text-xs text-red-500">{form.formState.errors.sizes.message}</p>}
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-1.5">
                  {SIZE_PRESETS.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <Button
                        key={size}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const next = isSelected
                            ? selectedSizes.filter((value) => value !== size)
                            : [...selectedSizes, size];
                          form.setValue("sizes", next.join(", "), { shouldValidate: true });
                        }}
                        className={cn(
                          "h-7 rounded-sm border px-2.5 text-xs font-normal",
                          isSelected
                            ? "border-primary text-primary bg-primary/5"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>

                <div className="md:col-span-2 rounded-md border border-border bg-muted/20 px-3 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Available for purchase</p>
                    <p className="text-xs text-muted-foreground">Switch off to keep as draft.</p>
                  </div>
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => form.setValue("isAvailable", checked, { shouldValidate: true })}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-4">
                  <div className="rounded-md border border-border bg-muted/10 p-4">
                    <p className="text-sm font-medium text-foreground">Product Image</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Use a clear square image so the product looks good in listings.
                    </p>

                    <div className="mt-4 h-[260px]">
                      <ImageUpload
                        value={formData.imageUrl}
                        onChange={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                        endpoint="productImage"
                        label="Upload product image"
                        helperText="PNG, JPG up to 4MB"
                      />
                    </div>
                  </div>

                  {form.formState.errors.imageUrl && <p className="text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>}
                </div>

                <div className="space-y-3">
                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm text-foreground">
                      {formData.imageUrl ? "Image uploaded" : "No image uploaded yet"}
                    </p>
                  </div>

                  <div className="rounded-md border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview</p>
                    <div className="h-48 rounded-sm overflow-hidden bg-muted">
                      {formData.imageUrl ? (
                        <Image src={formData.imageUrl} alt="Preview" width={360} height={360} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Tip: Keep the product centered and use even lighting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="max-w-4xl grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  <div className="h-56 rounded-sm overflow-hidden bg-muted">
                    {formData.imageUrl ? (
                      <Image src={formData.imageUrl} alt="Preview" width={420} height={420} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-sm font-medium text-foreground truncate">{formData.name || "Untitled product"}</p>
                    <p className="text-xs text-muted-foreground">{formData.category || "No category selected"}</p>
                    <p className="text-sm text-foreground">
                      KES {Number(formData.price || 0).toLocaleString()}
                    </p>
                    <span
                      className={cn(
                        "inline-flex rounded-sm border px-2 py-0.5 text-[11px]",
                        formData.isAvailable
                          ? "border-primary/30 text-primary bg-primary/5"
                          : "border-border text-muted-foreground bg-background",
                      )}
                    >
                      {formData.isAvailable ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-muted/20">
                    <p className="text-sm font-medium text-foreground">Review Summary</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Confirm details, then click Create to publish.
                    </p>
                  </div>

                  {[
                    { label: "Product Name", value: formData.name || "-", step: 0, complete: Boolean(formData.name) },
                    { label: "Category", value: formData.category || "-", step: 0, complete: Boolean(formData.category) },
                    {
                      label: "Description",
                      value: plainDescription || "-",
                      step: 0,
                      complete: Boolean(plainDescription),
                    },
                    {
                      label: "Price",
                      value: Number(formData.price) > 0 ? `KES ${Number(formData.price).toLocaleString()}` : "-",
                      step: 1,
                      complete: Number(formData.price) > 0,
                    },
                    { label: "Sizes", value: formData.sizes || "-", step: 1, complete: Boolean(formData.sizes) },
                    { label: "Status", value: formData.isAvailable ? "Active" : "Draft", step: 1, complete: true },
                    { label: "Image", value: formData.imageUrl ? "Uploaded" : "Missing", step: 2, complete: Boolean(formData.imageUrl) },
                  ].map((item) => (
                    <div key={item.label} className="grid grid-cols-[140px_minmax(0,1fr)_64px] items-start border-b last:border-b-0 border-border">
                      <div className="px-3 py-2.5 text-sm text-muted-foreground bg-muted/10">{item.label}</div>
                      <div className="px-3 py-2.5 min-w-0">
                        <p className="text-sm text-foreground break-words">{item.value}</p>
                        {!item.complete && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">Missing</p>
                        )}
                      </div>
                      <div className="px-2 py-2.5">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => setCurrentStep(item.step)}
                          className="h-auto p-0 text-xs font-normal text-primary hover:text-primary/80"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0 || loading}
              className={cn("h-9 rounded-xl", currentStep === 0 && "opacity-40 pointer-events-none")}
            >
              Previous
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => goToStep(currentStep + 1)}
                className="h-9 rounded-xl px-6"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleCreateClick}
                disabled={loading}
                className="h-9 rounded-xl px-6 min-w-[120px]"
              >
                {loading ? "Creating..." : "Create Product"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
