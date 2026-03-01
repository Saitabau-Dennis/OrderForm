"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { cn } from "@/lib/utils";

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
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().min(1, "Product image is required"),
  sizes: z.string().min(1, "At least one size/variant is required"),
});

export type ProductValues = z.infer<typeof productSchema>;
type ProductInitialData = Partial<ProductValues> & { id: string };

interface ProductFormProps {
  initialData?: ProductInitialData | null;
  onSuccess: () => void;
  layout?: "default" | "sheet";
}

export function ProductForm({ initialData, onSuccess, layout = "default" }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const isSheet = layout === "sheet";

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price ? Number(initialData.price) : 0,
      category: initialData?.category || "",
      isAvailable: initialData?.isAvailable ?? true,
      imageUrl: initialData?.imageUrl || "",
      sizes: initialData?.sizes || "",
    },
  });

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
        <section className="py-6 border-b border-border/70 first:pt-0 last:border-b-0">
          <div className="mb-4 space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
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
        <div className={cn("grid", layout === "default" ? "grid-cols-1 gap-8 lg:grid-cols-3" : "grid-cols-1 gap-0")}>

          {/* Main Column: Details */}
          <div className={cn(layout === "default" ? "space-y-8 lg:col-span-2" : "space-y-0")}>

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
            </SectionWrapper>
          </div>

          {/* Side Column: Media & Organization */}
          <div className={cn(layout === "default" ? "space-y-8" : "space-y-0")}>

            <SectionWrapper title="Media" description="Product images">
                <div className={cn(
                  "p-2 border border-dashed border-border",
                  isSheet ? "rounded-md bg-muted/20" : "rounded-3xl bg-secondary/50"
                )}>
                    <ImageUpload
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
            </SectionWrapper>

            <SectionWrapper title="Organization" description="Categorization & Stock">
                <div className="space-y-2">
                  <Label className="text-sm font-normal text-muted-foreground">Category</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className={cn(
                        "w-full justify-between font-normal h-10 transition-all text-sm",
                        isSheet
                          ? "rounded-md border-border bg-background hover:bg-muted"
                          : "rounded-3xl border-primary/20 bg-card hover:bg-secondary hover:border-primary/40 shadow-sm"
                      )}>
                        {form.watch("category") ? (
                          <span className="text-primary font-medium">{form.watch("category")}</span>
                        ) : (
                          <span className="text-muted-foreground">Select category</span>
                        )}
                        <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[280px] p-2 rounded-3xl border-none shadow-xl" align="start">
                      {["Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty"].map((cat) => (
                        <DropdownMenuItem
                          key={cat}
                          onClick={() => form.setValue("category", cat, { shouldDirty: true })}
                          className="rounded-2xl p-2 cursor-pointer focus:bg-primary/5 focus:text-primary font-normal text-sm"
                        >
                          {cat}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {form.formState.errors.category && (
                    <p className="text-xs text-red-500 mt-1">
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
                            "cursor-pointer w-8 h-8 flex items-center justify-center rounded-2xl text-xs font-medium transition-all border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm transform scale-105"
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
          isSheet ? "pt-6 mt-6 border-t border-border/70" : "pt-2 pb-8"
        )}>
            {isSheet && (
                <Button variant="outline" type="button" onClick={() => onSuccess()} className="h-9 px-4 rounded-md border-border hover:bg-muted text-sm font-medium transition-all">
                    Cancel
                </Button>
            )}
            <Button
                size="default"
                type="submit"
                disabled={loading}
                className={cn(
                  "bg-primary text-primary-foreground hover:bg-primary/90 transition-all h-9 font-medium text-sm",
                  isSheet
                    ? "rounded-md px-4 shadow-none hover:translate-y-0"
                    : "rounded-3xl px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
                )}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {initialData ? "Save Changes" : "Create Product"}
            </Button>
        </div>
      </form>
  );
}
