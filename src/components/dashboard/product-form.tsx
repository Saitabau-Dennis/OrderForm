"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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


const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().optional(),
  isAvailable: z.boolean().default(true),
  imageUrl: z.string().optional(),
  sizes: z.string().optional(),
});

type ProductValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ProductForm({ initialData, onSuccess }: ProductFormProps) {
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
        result = await updateProduct(initialData._id, data);
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Main Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Product Details</h3>
              <p className="text-sm text-muted-foreground">Product title, description and pricing.</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Vintage Denim Jacket" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  className="min-h-[120px] resize-y"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (KES)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">KES</span>
                  </div>
                  <Input
                    type="number"
                    id="price"
                    placeholder="0.00"
                    className="pl-12"
                    {...form.register("price")}
                  />
                </div>
                {form.formState.errors.price && (
                  <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Column: Media & Organization */}
        <div className="space-y-6">

          {/* Media Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
             <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Media</h3>
            </div>
            <div className="p-6 pt-0">
              <ImageUpload
                value={form.watch("imageUrl")}
                onChange={(file) => {
                  if (file) {
                    const url = URL.createObjectURL(file);
                    form.setValue("imageUrl", url);
                  } else {
                    form.setValue("imageUrl", "");
                  }
                }}
              />
            </div>
          </div>

          {/* Organization Card */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
             <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Organization</h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {form.watch("category") || "Select category"}
                      <span className="opacity-50">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]" align="start">
                    {["Clothing", "Footwear", "Accessories", "Electronics", "Home", "Beauty"].map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => form.setValue("category", cat)}
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <Label>Sizes</Label>
                <div className="flex flex-wrap gap-2">
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
                          form.setValue("sizes", newSizes.join(", "));
                        }}
                        className={`
                          cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium transition-all border
                          ${isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-muted-foreground hover:bg-muted"
                          }
                        `}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
                <Input
                  placeholder="Custom sizes (e.g. 40, 41, 42)"
                  {...form.register("sizes")}
                  className="mt-2 text-sm"
                />
              </div>

               <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="isAvailable" className="text-sm font-medium">Availability</Label>
                  <p className="text-xs text-muted-foreground">Is this product in stock?</p>
                </div>
                 <Switch
                    id="isAvailable"
                    checked={form.watch("isAvailable")}
                    onCheckedChange={(checked) => form.setValue("isAvailable", checked)}
                  />
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
