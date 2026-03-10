"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/dashboard/dashboard-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { createProduct, getStoreCategories, updateProduct } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

// Converts rich-text HTML into plain text for "required description" checks.
const stripRichText = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().refine((value) => stripRichText(value).length > 0, {
    message: "Description is required",
  }),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.union([z.literal(""), z.coerce.number().int().min(0)]).optional().default(""),
  optionStocks: z.record(z.string(), z.coerce.number().int().min(0)).optional().default({}),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().min(1, "Product image is required"),
  galleryImages: z.array(z.string()).default([]),
  sizes: z.string().min(1, "At least one size/variant is required"),
});

type ProductFormInput = z.input<typeof productSchema>;
export type ProductValues = z.output<typeof productSchema>;
type ProductInitialData = Partial<ProductValues> & { id: string };

interface ProductFormProps {
  initialData?: ProductInitialData | null;
  onSuccess: () => void;
  onCancel?: () => void;
  layout?: "default" | "sheet";
}

export function ProductForm({ initialData, onSuccess, onCancel, layout = "default" }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty"
  ]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryWrapperRef = useRef<HTMLDivElement>(null);

  const isSheet = layout === "sheet";

  useEffect(() => {
    // Merge defaults with store-specific categories already used in past products.
    const loadCategories = async () => {
      try {
        const response = await getStoreCategories();
        if (response.success && response.categories) {
          // Merge default suggestions with store's existing arbitrary categories
          const merged = new Set([...response.categories, "Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty", "Men", "Women", "Unisex"]);
          setCategories(Array.from(merged));
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    // Close custom category dropdown on outside clicks.
    function handleClickOutside(event: MouseEvent) {
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const form = useForm<ProductFormInput, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: buildDefaultValues(initialData),
  });

  useEffect(() => {
    // Keep form values in sync when editing a different product in the same mounted sheet.
    form.reset(buildDefaultValues(initialData));
  }, [form, initialData]);

  const onSubmit = async (data: ProductValues) => {
    try {
      setLoading(true);

      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(initialData ? "Product updated" : "Product created");
      onSuccess();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SectionWrapper = ({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) => {
    if (isSheet) {
      return (
        <section className="rounded-xl border border-border bg-white px-5 py-5 sm:px-6">
          <div className="mb-4 space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="space-y-5">{children}</div>
        </section>
      );
    }

    return (
      <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <div className="flex flex-col space-y-0.5">
            <h3 className="font-medium text-lg text-foreground">{title}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="p-8 space-y-8">
          {children}
        </div>
      </div>
    );
  };

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn(isSheet ? "space-y-0" : "space-y-8")}>
        <div className={cn("grid", layout === "default" ? "grid-cols-1 gap-8 lg:grid-cols-3" : "grid-cols-1 gap-6")}>

          {/* Main Column: Details */}
          <div className={cn(layout === "default" ? "space-y-8 lg:col-span-2" : "space-y-6")}>

            <SectionWrapper title="Product Information" description="Essential details">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-normal text-muted-foreground">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Vintage Denim Jacket"
                    {...form.register("name")}
                    className={cn(
                      "h-10 transition-all font-normal text-sm",
                      isSheet
                        ? "rounded-md border-border bg-background focus:bg-background focus:border-primary/30"
                        : "rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30 placeholder:text-muted-foreground/50"
                    )}
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500">
                        {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-normal text-muted-foreground">Description <span className="text-red-500">*</span></Label>
                  </div>
                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Tell your customers about this product..."
                        toolbar="advanced"
                        className={cn(
                          "transition-all text-sm",
                          isSheet ? "min-h-[170px]" : "min-h-[190px]"
                        )}
                      />
                    )}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Use headings, bold/italic text, lists, quotes, code blocks, and undo/redo.
                  </p>
                  {form.formState.errors.description && (
                    <p className="text-xs text-red-500">
                        {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-normal text-muted-foreground">Price <span className="text-red-500">*</span></Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-primary font-medium font-poppins text-sm">KES</span>
                    </div>
                    <Input
                      type="number"
                      id="price"
                      placeholder="0.00"
                      className={cn(
                        "pl-12 h-10 transition-all font-medium font-poppins text-sm tabular-nums",
                        isSheet
                          ? "rounded-md border-border bg-background focus:bg-background focus:border-primary/30"
                          : "rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30"
                      )}
                      {...form.register("price")}
                    />
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-xs text-red-500">
                        {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-normal text-muted-foreground">Available Stock <span className="text-xs">(optional)</span></Label>
                  <Input
                    type="number"
                    id="stock"
                    min={0}
                    placeholder="e.g. 300 (leave empty to use option stock only)"
                    className={cn(
                      "h-10 transition-all font-medium text-sm tabular-nums",
                      isSheet
                        ? "rounded-md border-border bg-background focus:bg-background focus:border-primary/30"
                        : "rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30"
                    )}
                    {...form.register("stock", {
                      setValueAs: (value) => (value === "" ? "" : Number(value)),
                    })}
                  />
                  {form.formState.errors.stock && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.stock.message}
                    </p>
                  )}
                </div>
            </SectionWrapper>
          </div>

          {/* Side Column: Media & Organization */}
          <div className={cn(layout === "default" ? "space-y-8" : "space-y-6")}>

            <SectionWrapper title="Media" description="Product images">
                <div className={cn(
                  "p-2 border border-dashed border-border min-h-[220px]",
                  isSheet ? "rounded-md bg-muted/20" : "rounded-3xl bg-secondary/50"
                )}>
                    <ImageUpload
                    className="h-[204px]"
                    value={form.watch("imageUrl")}
                    onChange={(url) => form.setValue("imageUrl", url, { shouldDirty: true })}
                    endpoint="productImage"
                    label="Upload product image"
                    helperText="PNG, JPG up to 4MB"
                    />
                </div>
                {form.formState.errors.imageUrl && (
                    <p className="text-xs text-red-500 mt-1">
                        {form.formState.errors.imageUrl.message}
                    </p>
                )}

                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-normal text-muted-foreground">Additional images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-md px-3 text-xs"
                      onClick={() => {
                        const current = form.getValues("galleryImages") || [];
                        form.setValue("galleryImages", [...current, ""], { shouldDirty: true });
                      }}
                    >
                      Add image
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Optional extra images for product gallery.</p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {(form.watch("galleryImages") || []).map((url, index) => (
                      <div key={`gallery-${index}`} className="rounded-md border border-border p-2 bg-background/60">
                        <div className="h-44">
                          <ImageUpload
                            value={url}
                            onChange={(nextUrl) => {
                              const current = [...(form.getValues("galleryImages") || [])];
                              current[index] = nextUrl;
                              form.setValue("galleryImages", current, { shouldDirty: true });
                            }}
                            endpoint="productImage"
                            label={`Upload image ${index + 1}`}
                            helperText="PNG, JPG up to 4MB"
                          />
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 rounded-md px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              const current = [...(form.getValues("galleryImages") || [])];
                              current.splice(index, 1);
                              form.setValue("galleryImages", current, { shouldDirty: true });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </SectionWrapper>

            <SectionWrapper title="Organization" description="Categorization & Stock">
                <div className="space-y-2 relative" ref={categoryWrapperRef}>
                  <Label htmlFor="category" className="text-sm font-normal text-muted-foreground">Category <span className="text-red-500">*</span></Label>
                  <Input
                    id="category"
                    placeholder="e.g. Vintage Apparel"
                    autoComplete="off"
                    {...form.register("category")}
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                    className={cn(
                      "h-10 transition-all font-normal text-sm w-full",
                      isSheet
                        ? "rounded-md border-border bg-background focus:bg-background focus:border-primary/30"
                        : "rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30 placeholder:text-muted-foreground/50"
                    )}
                  />

                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-[220px] w-full overflow-y-auto rounded-2xl border border-border bg-card px-2 py-2 text-foreground shadow-[0_18px_40px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 slide-in-from-top-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                       {categories
                        // Optional simple text-based filter based on what they are currently typing:
                        .filter(cat => {
                           const currentInput = form.watch("category") || "";
                           return currentInput.trim() === "" || cat.toLowerCase().includes(currentInput.toLowerCase());
                        })
                        .map((cat) => (
                          <div
                            key={cat}
                            onMouseDown={(e) => {
                              // Prevent input from losing focus immediately before onClick registers
                              e.preventDefault();
                            }}
                            onClick={() => {
                              form.setValue("category", cat, { shouldDirty: true, shouldValidate: true });
                              setIsCategoryDropdownOpen(false);
                            }}
                            className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-normal text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                          >
                           {cat}
                          </div>
                      ))}
                      {categories.filter(cat => {
                           const currentInput = form.watch("category") || "";
                           return currentInput.trim() === "" || cat.toLowerCase().includes(currentInput.toLowerCase());
                      }).length === 0 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                           Press enter to create &quot;{form.watch("category")}&quot;
                        </div>
                      )}
                    </div>
                  )}

                  {form.formState.errors.category && (
                    <p className="text-xs text-red-500 mt-1 relative z-0">
                        {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <Label className="text-sm font-normal text-muted-foreground">
                      Sizes / Variants
                  </Label>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {["XS", "S", "M", "L", "XL"].map((size) => {
                      const currentSizes = form.watch("sizes")?.split(",").map(s => s.trim()).filter(Boolean) || [];
                      const isSelected = currentSizes.includes(size);

                      return (
                        <div
                          key={size}
                          onClick={() => {
                            let newSizes;
                            if (isSelected) {
                              newSizes = currentSizes.filter(s => s !== size);
                            } else {
                              newSizes = [...currentSizes, size];
                            }
                            form.setValue("sizes", newSizes.join(", "), { shouldDirty: true });
                          }}
                          className={cn(
                            "cursor-pointer w-8 h-8 flex items-center justify-center rounded-2xl text-xs font-normal transition-all border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                          )}
                        >
                          {size}
                        </div>
                      );
                    })}
                  </div>
                  <Input
                    placeholder="Custom sizes (e.g. 40, 41, 42)"
                    {...form.register("sizes")}
                    className={cn(
                      "h-10 border-border text-sm",
                      isSheet ? "rounded-md bg-background" : "rounded-3xl bg-secondary/50"
                    )}
                  />
                  {form.formState.errors.sizes && (
                    <p className="text-xs text-red-500 mt-1">
                        {form.formState.errors.sizes.message}
                    </p>
                  )}
                </div>

                {form.watch("sizes")?.trim() ? (
                  <div className="space-y-2 pt-1">
                    <Label className="text-sm font-normal text-muted-foreground">
                      Stock by Size/Option <span className="text-xs">(optional)</span>
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Array.from(
                        new Set(
                          form
                            .watch("sizes")
                            ?.split(",")
                            .map((value) => value.trim())
                            .filter(Boolean) || []
                        )
                      ).map((option) => (
                        <div key={`option-stock-${option}`} className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{option}</Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            className={cn(
                              "h-9 border-border text-sm",
                              isSheet ? "rounded-md bg-background" : "rounded-3xl bg-secondary/50"
                            )}
                            value={String((form.watch("optionStocks")?.[option] ?? ""))}
                            onChange={(event) => {
                              const current = { ...(form.getValues("optionStocks") || {}) };
                              if (event.target.value === "") {
                                delete current[option];
                              } else {
                                current[option] = Math.max(0, Math.trunc(Number(event.target.value)));
                              }
                              form.setValue("optionStocks", current, { shouldDirty: true });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Set stock per option (e.g. shoe sizes 37-40, clothing sizes S-XL). Leave blank for unlimited per option.
                    </p>
                  </div>
                ) : null}

                <div className="pt-3 mt-3 border-t border-border">
                    <div className={cn(
                      "flex items-center justify-between p-3 border border-border",
                      isSheet ? "rounded-md bg-muted/20" : "rounded-3xl bg-primary/5"
                    )}>
                        <div className="space-y-0.5">
                            <Label htmlFor="isAvailable" className={cn("text-sm font-medium", isSheet ? "text-foreground" : "text-primary")}>In Stock</Label>
                            <p className="text-[10px] text-muted-foreground">Available for purchase</p>
                        </div>
                        <Switch
                            id="isAvailable"
                            checked={form.watch("isAvailable")}
                            onCheckedChange={(checked) => form.setValue("isAvailable", checked, { shouldDirty: true })}
                            className="scale-90 data-[state=checked]:bg-primary"
                        />
                    </div>
                </div>
            </SectionWrapper>

          </div>
        </div>

        <div className={cn(
          "flex items-center justify-end gap-3",
          isSheet ? "sticky bottom-0 mt-8 border-t border-border/70 bg-card/95 px-1 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80" : "pt-2 pb-8"
        )}>
            {isSheet && (
                <Button variant="outline" type="button" size="sm" onClick={() => onCancel?.()}>
                    Cancel
                </Button>
            )}
            <Button
                size="default"
                type="submit"
                disabled={loading}
                className={cn(!isSheet && "w-full sm:w-auto")}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {initialData ? "Save Changes" : "Create Product"}
            </Button>
        </div>
      </form>
  );
}

function normalizeGalleryImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function buildDefaultValues(initialData?: ProductInitialData | null): ProductValues {
  const optionStocksRaw = (initialData as { optionStocks?: unknown } | undefined)?.optionStocks;
  const normalizedOptionStocks = Array.isArray(optionStocksRaw)
    ? Object.fromEntries(
        optionStocksRaw
          .map((entry) => {
            if (!entry || typeof entry !== "object") return null;
            const row = entry as { optionValue?: unknown; stock?: unknown };
            if (typeof row.optionValue !== "string") return null;
            const parsedStock = Number(row.stock);
            if (!Number.isFinite(parsedStock)) return null;
            return [row.optionValue, Math.max(0, Math.trunc(parsedStock))] as const;
          })
          .filter((entry): entry is readonly [string, number] => Boolean(entry))
      )
    : optionStocksRaw && typeof optionStocksRaw === "object"
      ? (optionStocksRaw as Record<string, number>)
      : {};

  return {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ? Number(initialData.price) : 0,
    stock: typeof initialData?.stock === "number" ? initialData.stock : "",
    optionStocks: normalizedOptionStocks,
    category: initialData?.category || "",
    isAvailable: initialData?.isAvailable ?? true,
    imageUrl: initialData?.imageUrl || "",
    galleryImages: normalizeGalleryImages((initialData as { galleryImages?: unknown } | undefined)?.galleryImages),
    sizes: initialData?.sizes || "",
  };
}
