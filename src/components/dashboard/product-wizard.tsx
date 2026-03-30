"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Layers3, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { productSchema } from "@/components/dashboard/product-form";
import { Button } from "@/components/dashboard/dashboard-button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { createProduct } from "@/lib/actions/products";
import { buildVariantStockKey } from "@/lib/inventory";
import { cn } from "@/lib/utils";

interface ProductWizardProps {
  onSuccess: () => void;
  freshToken?: string | null;
}

type StoredVariant = {
  name: string;
  options: string[];
};

type VariantStockEntry = {
  key: string;
  label: string;
};

type VariantDraft = StoredVariant & {
  id: string;
  valueInput: string;
};

const CATEGORY_OPTIONS = ["Men", "Women", "Unisex"];
const PRODUCT_WIZARD_DRAFT_KEY = "product-wizard-draft-v1";
const PRODUCT_WIZARD_FRESH_TOKEN_KEY = "product-wizard-fresh-token-consumed";

const wizardSchema = productSchema.extend({
  galleryImages: z.array(z.string()).default([]),
  optionStocks: z.record(z.string(), z.coerce.number().int().min(0)).default({}),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        options: z.array(z.string().min(1)).min(1),
      }),
    )
    .default([]),
});

type WizardFormInput = z.input<typeof wizardSchema>;
type WizardFormValues = z.output<typeof wizardSchema>;

const stripRichText = (value?: string) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const makeVariantId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const createVariantDraft = (name = "", options: string[] = []): VariantDraft => ({
  id: makeVariantId(),
  name,
  options,
  valueInput: "",
});

function buildVariantStockEntries(variants: StoredVariant[]): VariantStockEntry[] {
  if (variants.length === 0) return [];

  if (variants.length === 1) {
    return variants[0].options.map((option) => ({
      key: option.trim().toLowerCase(),
      label: option,
    }));
  }

  const combine = (
    index: number,
    current: Array<{ name: string; value: string }>
  ): VariantStockEntry[] => {
    if (index >= variants.length) {
      const key = buildVariantStockKey(current);
      const label = current.map((part) => `${part.name}: ${part.value}`).join(" / ");
      return [{ key, label }];
    }

    const group = variants[index];
    const entries: VariantStockEntry[] = [];
    for (const option of group.options) {
      entries.push(
        ...combine(index + 1, [...current, { name: group.name, value: option }])
      );
    }
    return entries;
  };

  return combine(0, []);
}

const STEPS = [
  {
    id: "basic-info",
    label: "Basic Info",
    fields: ["name", "category", "description"] as Array<keyof WizardFormValues>,
  },
  {
    id: "media-gallery",
    label: "Media / Gallery",
    fields: ["imageUrl"] as Array<keyof WizardFormValues>,
  },
  {
    id: "price-inventory",
    label: "Price & Inventory",
    fields: ["price", "stock", "isAvailable"] as Array<keyof WizardFormValues>,
  },
  {
    id: "variants",
    label: "Variants",
    fields: ["sizes"] as Array<keyof WizardFormValues>,
  },
  {
    id: "preview",
    label: "Preview",
    fields: [] as Array<keyof WizardFormValues>,
  },
] as const;

export function ProductWizard({ onSuccess, freshToken }: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const [isDraftPersistenceEnabled, setIsDraftPersistenceEnabled] = useState(true);
  const categories = CATEGORY_OPTIONS;
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([createVariantDraft()]);
  const categoryWrapperRef = useRef<HTMLDivElement>(null);
  const initialFreshTokenRef = useRef<string | null>(freshToken ?? null);

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
      stock: 0,
      category: "",
      isAvailable: true,
      imageUrl: "",
      galleryImages: [],
      sizes: "",
      optionStocks: {},
      variants: [],
    },
    mode: "onChange",
  });

  const formData = form.watch();
  const plainDescription = stripRichText(formData.description);

  useEffect(() => {
    try {
      const initialFreshToken = initialFreshTokenRef.current;
      if (initialFreshToken) {
        const consumedFreshToken = window.sessionStorage.getItem(PRODUCT_WIZARD_FRESH_TOKEN_KEY);
        if (consumedFreshToken !== initialFreshToken) {
          window.localStorage.removeItem(PRODUCT_WIZARD_DRAFT_KEY);
          window.sessionStorage.setItem(PRODUCT_WIZARD_FRESH_TOKEN_KEY, initialFreshToken);
        }
      }

      const raw = window.localStorage.getItem(PRODUCT_WIZARD_DRAFT_KEY);
      if (!raw) {
        setIsDraftHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        currentStep?: number;
        formValues?: Partial<WizardFormValues>;
        variantDrafts?: VariantDraft[];
      };

      const safeFormValues = wizardSchema.partial().safeParse(parsed.formValues);
      if (safeFormValues.success && safeFormValues.data) {
        form.reset({
          ...form.getValues(),
          ...safeFormValues.data,
        });
      }

      if (Array.isArray(parsed.variantDrafts) && parsed.variantDrafts.length > 0) {
        setVariantDrafts(
          parsed.variantDrafts.map((variant) => ({
            id: typeof variant.id === "string" && variant.id.length > 0 ? variant.id : makeVariantId(),
            name: typeof variant.name === "string" ? variant.name : "",
            options: Array.isArray(variant.options)
              ? variant.options.filter((value): value is string => typeof value === "string")
              : [],
            valueInput: typeof variant.valueInput === "string" ? variant.valueInput : "",
          })),
        );
      }

      if (typeof parsed.currentStep === "number") {
        setCurrentStep(Math.min(Math.max(parsed.currentStep, 0), STEPS.length - 1));
      }
    } catch (error) {
      console.error("Failed to restore wizard draft", error);
    } finally {
      setIsDraftHydrated(true);
    }
  }, [form]);

  const selectedVariants = useMemo<StoredVariant[]>(
    () =>
      variantDrafts
        .map((variant) => ({
          name: variant.name.trim(),
          options: variant.options
            .map((option) => option.trim())
            .filter(Boolean),
        }))
        .filter((variant) => variant.name.length > 0 && variant.options.length > 0),
    [variantDrafts],
  );
  const variantStockEntries = useMemo(
    () => buildVariantStockEntries(selectedVariants),
    [selectedVariants]
  );

  useEffect(() => {
    form.setValue("variants", selectedVariants, { shouldDirty: true });
    form.setValue(
      "sizes",
      Array.from(new Set(selectedVariants.flatMap((variant) => variant.options))).join(", "),
      { shouldValidate: currentStep >= 3, shouldDirty: true },
    );
  }, [currentStep, form, selectedVariants]);

  useEffect(() => {
    if (!isDraftHydrated || !isDraftPersistenceEnabled) return;

    try {
      window.localStorage.setItem(
        PRODUCT_WIZARD_DRAFT_KEY,
        JSON.stringify({
          currentStep,
          formValues: formData,
          variantDrafts,
        }),
      );
    } catch (error) {
      console.error("Failed to save wizard draft", error);
    }
  }, [currentStep, formData, isDraftHydrated, isDraftPersistenceEnabled, variantDrafts]);

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    if (nextStep < currentStep) {
      setCurrentStep(nextStep);
      return;
    }

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
      toast.error("Please review the preview before creating the product.");
      return;
    }

    try {
      setLoading(true);
      const result = await createProduct({
        ...data,
        galleryImages: (data.galleryImages || []).filter(Boolean),
        variants: selectedVariants,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Stop persistence first so a post-submit rerender can't write the old draft back.
      setIsDraftPersistenceEnabled(false);
      window.localStorage.removeItem(PRODUCT_WIZARD_DRAFT_KEY);
      toast.success("Product created successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const setGallerySlot = (index: number, url: string) => {
    const next = [...(form.getValues("galleryImages") || [])];
    next[index] = url;
    form.setValue("galleryImages", next, { shouldDirty: true });
  };

  const addPresetVariant = (preset: "clothing" | "shoe" | "custom") => {
    if (preset === "clothing") {
      setVariantDrafts((prev) => [...prev, createVariantDraft("Clothing Size")]);
      return;
    }
    if (preset === "shoe") {
      setVariantDrafts((prev) => [...prev, createVariantDraft("Shoe Size")]);
      return;
    }
    setVariantDrafts((prev) => [...prev, createVariantDraft()]);
  };

  const removeVariantOption = (id: string) => {
    setVariantDrafts((prev) =>
      prev.length > 1 ? prev.filter((variant) => variant.id !== id) : prev,
    );
  };

  const updateVariantName = (id: string, value: string) => {
    setVariantDrafts((prev) =>
      prev.map((variant) => (variant.id === id ? { ...variant, name: value } : variant)),
    );
  };

  const updateVariantValueInput = (id: string, value: string) => {
    setVariantDrafts((prev) =>
      prev.map((variant) => (variant.id === id ? { ...variant, valueInput: value } : variant)),
    );
  };

  const applyPresetToVariant = (id: string, preset: "clothing" | "shoe") => {
    setVariantDrafts((prev) =>
      prev.map((variant) => {
        if (variant.id !== id) return variant;
        if (preset === "clothing") {
          return { ...variant, name: "Clothing Size", options: [], valueInput: "" };
        }
        return { ...variant, name: "Shoe Size", options: [], valueInput: "" };
      }),
    );
  };

  const addVariantValues = (id: string) => {
    setVariantDrafts((prev) =>
      prev.map((variant) => {
        if (variant.id !== id) return variant;

        const nextValues = variant.valueInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        if (nextValues.length === 0) return variant;

        return {
          ...variant,
          options: Array.from(new Set([...variant.options, ...nextValues])),
          valueInput: "",
        };
      }),
    );
  };

  const removeVariantValue = (id: string, value: string) => {
    setVariantDrafts((prev) =>
      prev.map((variant) =>
        variant.id === id
          ? { ...variant, options: variant.options.filter((option) => option !== value) }
          : variant,
      ),
    );
  };

  const handleCreateClick = form.handleSubmit(onSubmit);

  return (
    <div className="mx-auto flex min-h-[620px] max-w-[1200px] flex-col rounded-xl border border-border bg-card p-6 sm:p-8">
      <div>
        <p className="text-sm font-medium text-foreground">New Product Wizard</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Complete the steps below to publish your product.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-5 border-b border-border">
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
                className={cn(
                  "h-auto min-w-fit rounded-none border-b-2 border-transparent px-0 py-3 text-left hover:bg-transparent",
                  isActive
                    ? "border-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-inherit")}>
                  {step.label}
                  {isDone && <span className="ml-1.5 text-primary">✓</span>}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="mt-8 flex min-w-0 flex-1 flex-col"
      >
        <div className="max-w-5xl flex-1">
          {currentStep === 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Product Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Classic Leather Watch"
                  className="h-10 rounded-md"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="relative space-y-1.5" ref={categoryWrapperRef}>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Vintage Apparel"
                  autoComplete="off"
                  {...form.register("category")}
                  onFocus={() => setIsCategoryDropdownOpen(true)}
                  className="h-10 rounded-md bg-background"
                />

                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-[220px] w-full overflow-y-auto rounded-md border border-border/80 bg-white px-1 py-1 shadow-xl">
                    {categories
                      .filter((cat) => {
                        const currentInput = form.watch("category") || "";
                        return (
                          currentInput.trim() === "" ||
                          cat.toLowerCase().includes(currentInput.toLowerCase())
                        );
                      })
                      .map((cat) => (
                        <div
                          key={cat}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            form.setValue("category", cat, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="cursor-pointer rounded-sm p-2 text-xs transition-colors hover:bg-muted"
                        >
                          {cat}
                        </div>
                      ))}
                  </div>
                )}

                {form.formState.errors.category && (
                  <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="description" className="text-xs text-muted-foreground">
                  Description
                </Label>
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
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
                <div>
                  <Label className="text-sm font-semibold text-foreground">
                    Main Product Image <span className="text-red-500">*</span>
                  </Label>
                  <div className="mt-3 h-[340px]">
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(url) =>
                        form.setValue("imageUrl", url, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      endpoint="productImage"
                      label="Drop your image here, or click to browse"
                      helperText="SVG, PNG, JPG up to 5MB"
                    />
                  </div>
                  {form.formState.errors.imageUrl && (
                    <p className="mt-2 text-xs text-red-500">{form.formState.errors.imageUrl.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-foreground">
                    Product Gallery <span className="font-normal text-muted-foreground">(Optional)</span>
                  </Label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-[124px]">
                        <ImageUpload
                          value={formData.galleryImages?.[index] || ""}
                          onChange={(url) => setGallerySlot(index, url)}
                          endpoint="productImage"
                          label="Add Image"
                          helperText=""
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-300/70 bg-yellow-50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 text-yellow-700" />
                  <div>
                    <p className="text-xs font-medium text-yellow-900">Image Guidelines</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-yellow-800">
                      <li>Use high-resolution images (min 1000x1000px)</li>
                      <li>White or transparent background preferred</li>
                      <li>Show product from multiple angles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs text-muted-foreground">
                  Price
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    KES
                  </span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="h-10 rounded-md pl-12"
                    {...form.register("price")}
                  />
                </div>
                {form.formState.errors.price && (
                  <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock" className="text-xs text-muted-foreground">
                  Available Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  placeholder="e.g. 300"
                  className="h-10 rounded-md"
                  {...form.register("stock", {
                    setValueAs: (value) => Number(value),
                  })}
                />
                {form.formState.errors.stock && (
                  <p className="text-xs text-red-500">{form.formState.errors.stock.message}</p>
                )}
              </div>

              <div className="rounded-md border border-border bg-muted/20 px-3 py-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-foreground">Inventory Status</p>
                    <p className="text-xs text-muted-foreground">
                      Mark whether this product can be purchased now.
                    </p>
                  </div>
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) =>
                      form.setValue("isAvailable", checked, { shouldValidate: true })
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/20 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background">
                  <Layers3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">Product Variants</h3>
                <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                  Add clothing sizes, shoe numbers, or any custom variant like color/material.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addPresetVariant("clothing")}
                    className="h-10 rounded-lg border-primary/60 px-4 text-primary"
                  >
                    Add Clothing Sizes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addPresetVariant("shoe")}
                    className="h-10 rounded-lg border-primary/60 px-4 text-primary"
                  >
                    Add Shoe Numbers
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addPresetVariant("custom")}
                    className="h-10 rounded-lg border-primary/60 px-4 text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Variant
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {variantDrafts.map((variant) => (
                  <div key={variant.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={variant.name}
                        onChange={(event) => updateVariantName(variant.id, event.target.value)}
                        placeholder="Option name (e.g., Size, Color)"
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPresetToVariant(variant.id, "clothing")}
                        className="h-10 whitespace-nowrap"
                      >
                        Clothing
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyPresetToVariant(variant.id, "shoe")}
                        className="h-10 whitespace-nowrap"
                      >
                        Shoes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariantOption(variant.id)}
                        disabled={variantDrafts.length === 1}
                        className="h-10 w-10 text-muted-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={`${variant.id}-${option}`}
                          type="button"
                          onClick={() => removeVariantValue(variant.id, option)}
                          className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-1 text-xs text-foreground"
                        >
                          {option}
                          <Trash2 className="ml-1.5 h-3 w-3 text-muted-foreground" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Input
                        value={variant.valueInput}
                        onChange={(event) => updateVariantValueInput(variant.id, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addVariantValues(variant.id);
                          }
                        }}
                        placeholder="Add value... (e.g. S, M, L or 40, 41)"
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addVariantValues(variant.id)}
                        className="h-10"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedVariants.length > 0 ? (
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs font-medium text-foreground">Stock by Option</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Set quantity for every size/variant value.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {variantStockEntries.map((entry) => (
                      <div key={`wizard-option-stock-${entry.key}`} className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{entry.label}</Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          className="h-9 rounded-md"
                          value={String((formData.optionStocks?.[entry.key] ?? ""))}
                          onChange={(event) => {
                            const current = { ...(form.getValues("optionStocks") || {}) };
                            if (event.target.value === "") {
                              delete current[entry.key];
                            } else {
                              current[entry.key] = Math.max(0, Math.trunc(Number(event.target.value)));
                            }
                            form.setValue("optionStocks", current, { shouldDirty: true });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {form.formState.errors.sizes && (
                <p className="text-xs text-red-500">{form.formState.errors.sizes.message}</p>
              )}
              {form.formState.errors.optionStocks && (
                <p className="text-xs text-red-500">{form.formState.errors.optionStocks.message as string}</p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <p className="mb-2 text-xs text-muted-foreground">Preview</p>
                <div className="h-56 overflow-hidden rounded-sm bg-muted">
                  {formData.imageUrl ? (
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={420}
                      height={420}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="truncate text-xs font-medium text-foreground">
                    {formData.name || "Untitled product"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.category || "No category selected"}
                  </p>
                  <p className="text-xs text-foreground">
                    KES {Number(formData.price || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stock: {Number(formData.stock || 0).toLocaleString()}
                  </p>
                  <span
                    className={cn(
                      "inline-flex rounded-sm border px-2 py-0.5 text-[11px]",
                      formData.isAvailable
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {formData.isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-border">
                <div className="border-b border-border bg-muted/20 px-4 py-3">
                  <p className="text-xs font-medium text-foreground">Review Summary</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Confirm details, then click Create Product.
                  </p>
                </div>

                {[
                  { label: "Product Name", value: formData.name || "-", step: 0 },
                  { label: "Category", value: formData.category || "-", step: 0 },
                  { label: "Description", value: plainDescription || "-", step: 0 },
                  {
                    label: "Price",
                    value:
                      Number(formData.price) > 0
                        ? `KES ${Number(formData.price).toLocaleString()}`
                        : "-",
                    step: 2,
                  },
                  {
                    label: "Availability",
                    value: formData.isAvailable ? "In Stock" : "Out of Stock",
                    step: 2,
                  },
                  {
                    label: "Stock Qty",
                    value: Number(formData.stock).toLocaleString(),
                    step: 2,
                  },
                  {
                    label: "Option Stock",
                    value: Object.keys(formData.optionStocks || {}).length
                      ? `${Object.keys(formData.optionStocks || {}).length} option(s) set`
                      : "Not set",
                    step: 3,
                  },
                  {
                    label: "Main Image",
                    value: formData.imageUrl ? "Uploaded" : "Missing",
                    step: 1,
                  },
                  {
                    label: "Gallery",
                    value: (formData.galleryImages || []).filter(Boolean).length
                      ? `${(formData.galleryImages || []).filter(Boolean).length} image(s)`
                      : "No gallery images",
                    step: 1,
                  },
                  {
                    label: "Variants",
                    value: selectedVariants.length
                      ? selectedVariants
                          .map((variant) => `${variant.name}: ${variant.options.join(", ")}`)
                          .join(" | ")
                      : "-",
                    step: 3,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[130px_minmax(0,1fr)_64px] items-start border-b border-border last:border-b-0"
                  >
                    <div className="bg-muted/10 px-3 py-2.5 text-xs text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="min-w-0 px-3 py-2.5">
                      <p className="break-words text-xs text-foreground">{item.value}</p>
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

        <div className="mt-8 flex w-full items-center justify-between border-t border-border pt-5">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0 || loading}
            className={cn(
              "h-10 min-w-[120px] rounded-lg",
              currentStep === 0 && "invisible pointer-events-none",
            )}
          >
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={() => goToStep(currentStep + 1)}
              className="h-10 min-w-[120px] rounded-lg px-6"
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleCreateClick}
              disabled={loading}
              className="h-10 min-w-[120px] rounded-lg px-6"
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
