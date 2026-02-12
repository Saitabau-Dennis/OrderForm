"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/dashboard/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { cn } from "@/lib/utils";


export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().min(1, "Product image is required"),
  sizes: z.string().min(1, "At least one size/variant is required"),
});

export type ProductValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
  layout?: "default" | "sheet";
}

export function ProductForm({ initialData, onSuccess, layout = "default" }: ProductFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema) as any,
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
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SectionWrapper = ({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) => {
    if (layout === "sheet") {
      return (
        <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-border">
                <div className="space-y-0.5">
                    <h3 className="font-medium text-base text-foreground">{title}</h3>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </div>
            </div>
            <div className="p-5 space-y-5">
              {children}
            </div>
        </div>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", layout === "sheet" && "space-y-6")}>
        <div className={cn("grid gap-8", layout === "default" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 gap-6")}>

          {/* Main Column: Details */}
          <div className={cn("space-y-8", layout === "default" ? "lg:col-span-2" : "")}>

            <SectionWrapper title="Product Information" description="Essential details">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-normal text-muted-foreground">Product Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Vintage Denim Jacket"
                    {...form.register("name")}
                    className="h-10 rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30 transition-all font-normal text-sm placeholder:text-muted-foreground/50"
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
                  <Textarea
                    id="description"
                    placeholder="Tell your customers about this product..."
                    className="min-h-[100px] rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30 transition-all resize-y p-3 font-poppins leading-relaxed text-sm"
                    {...form.register("description")}
                  />
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
                      className="pl-12 h-10 rounded-3xl border-border bg-secondary/50 focus:bg-card focus:border-primary/30 transition-all font-medium font-poppins text-sm tabular-nums"
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
          <div className="space-y-8">

            <SectionWrapper title="Media" description="Product images">
                <div className="bg-secondary/50 rounded-3xl p-2 border border-dashed border-border">
                    <ImageUpload
                    value={form.watch("imageUrl")}
                    onChange={(url) => form.setValue("imageUrl", url, { shouldDirty: true })}
                    endpoint="productImage"
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
                      <Button variant="outline" className="w-full justify-between font-normal h-10 rounded-3xl border-primary/20 bg-card hover:bg-secondary hover:border-primary/40 transition-all text-sm shadow-sm">
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
                    className="h-10 rounded-3xl border-border bg-secondary/50 text-sm"
                  />
                  {form.formState.errors.sizes && (
                    <p className="text-xs text-red-500 mt-1">
                        {form.formState.errors.sizes.message}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-border">
                    <div className="flex items-center justify-between p-3 rounded-3xl bg-primary/5 border border-border">
                        <div className="space-y-0.5">
                            <Label htmlFor="isAvailable" className="text-sm font-medium text-primary">In Stock</Label>
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

        <div className="flex items-center justify-end gap-3 pt-2 pb-8">
            {layout === "sheet" && (
                <Button variant="outline" type="button" onClick={() => onSuccess()} className="h-10 px-6 rounded-2xl border-border/60 hover:bg-muted text-sm font-medium transition-all">
                    Cancel
                </Button>
            )}
            <Button
                size="default"
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all rounded-3xl px-6 h-10 font-medium text-sm w-full sm:w-auto"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {initialData ? "Save Changes" : "Create Product"}
            </Button>
        </div>
      </form>
  );
}
