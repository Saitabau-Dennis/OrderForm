"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2, ExternalLink, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStoreSettings } from "@/lib/actions/store";

const THEMES = [
  {
    name: "Serene Sunrise",
    primary: "#F28B82",
    secondary: "#F7D7BA",
  },
  {
    name: "Modern Minimalist",
    primary: "#F8F9FA",
    secondary: "#343A40",
  },
  {
    name: "Ocean Breeze",
    primary: "#20B2AA",
    secondary: "#87CEEB",
  },
  {
    name: "Vintage Charm",
    primary: "#FFE4E1",
    secondary: "#D2B48C",
  },
  {
    name: "Tech Savvy",
    primary: "#00FFFF",
    secondary: "#00FF00",
  },
  {
    name: "Nature Inspired",
    primary: "#228B22",
    secondary: "#F5DEB3",
  },
];

const settingsSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  currency: z.string().default("KES"),
  logoUrl: z.string().optional(),
  brandColor: z.string().default("#30382F"),
  theme: z.string().default("Modern Minimalist"),
  isActive: z.boolean().default(true),
  deliveryZones: z.array(
    z.object({
      name: z.string().min(1, "Zone name is required"),
      price: z.coerce.number().min(0, "Price must be positive"),
    })
  ),
});

type SettingsValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: any;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      currency: initialData?.currency || "KES",
      logoUrl: initialData?.logoUrl || "",
      brandColor: initialData?.brandColor || "#30382F",
      theme: initialData?.theme || "Modern Minimalist",
      isActive: initialData?.isActive ?? true,
      deliveryZones: initialData?.deliveryZones || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryZones",
  });

  const name = form.watch("name");

  useEffect(() => {
    if (!initialData && name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
    }
  }, [name, initialData, form]);

  const onSubmit = async (data: SettingsValues) => {
    try {
      setLoading(true);
      const result = await updateStoreSettings(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTestWhatsApp = () => {
    const number = form.getValues("whatsappNumber");
    if (number) {
      window.open(`https://wa.me/${number}`, "_blank");
    } else {
      toast.error("Please enter a WhatsApp number first");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>
              Basic information about your store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Store"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-primary"
                  onClick={async () => {
                    const name = form.getValues("name");
                    if (!name) {
                      toast.error("Please enter a store name first");
                      return;
                    }

                    const toastId = toast.loading("Generating description...");
                    const { generateDescription } = await import("@/lib/actions/ai");
                    const result = await generateDescription(name, "store");

                    toast.dismiss(toastId);

                    if (result.error) {
                      toast.error(result.error);
                    } else if (result.description) {
                      form.setValue("description", result.description);
                      toast.success("Description generated!");
                    }
                  }}
                >
                   ✨ Generate with AI
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Tell us about your store... (or click Generate with AI)"
                className="min-h-[100px]"
                {...form.register("description")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Store Slug</Label>
              <Input
                id="slug"
                readOnly
                className="bg-muted"
                {...form.register("slug")}
              />
              <p className="text-xs text-muted-foreground">
                Your store URL: orderform.store/{form.watch("slug")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Card */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
            <CardDescription>
              Connect your WhatsApp for orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Input
                  id="whatsappNumber"
                  placeholder="2547..."
                  {...form.register("whatsappNumber")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleTestWhatsApp}
                  title="Test WhatsApp"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              {form.formState.errors.whatsappNumber && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.whatsappNumber.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Include country code without +.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Branding Card */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Customize your store's appearance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Logo</Label>
              <ImageUpload
                value={form.watch("logoUrl")}
                onChange={(file) => {
                  if (file) {
                    const url = URL.createObjectURL(file);
                    form.setValue("logoUrl", url);
                  } else {
                    form.setValue("logoUrl", "");
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <Label>Color Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEMES.map((theme) => (
                  <div
                    key={theme.name}
                    className={cn(
                      "cursor-pointer rounded-lg border-2 p-1 transition-all hover:border-primary",
                      form.watch("theme") === theme.name
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    onClick={() => {
                      form.setValue("theme", theme.name);
                      // Also update brand color for backward compatibility or specific usage
                      form.setValue("brandColor", theme.primary);
                    }}
                  >
                    <div className="flex h-16 w-full overflow-hidden rounded-md border shadow-sm">
                      <div
                        className="h-full w-1/2"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div
                        className="h-full w-1/2"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>
                    <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
                      {theme.name}
                    </p>
                  </div>
                ))}
              </div>
              {/* Hidden input for brandColor to maintain schema compatibility if needed */}
              <input type="hidden" {...form.register("brandColor")} />
            </div>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Manage store settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={form.watch("currency")}
                onValueChange={(value) => form.setValue("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>


          </CardContent>
        </Card>

        {/* Logistics Card */}
        <Card className="lg:col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Delivery Zones</CardTitle>
              <CardDescription>Manage your delivery areas.</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", price: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No delivery zones added yet.
              </p>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor={`deliveryZones.${index}.name`} className="sr-only">
                    Zone Name
                  </Label>
                  <Input
                    placeholder="Zone Name"
                    {...form.register(`deliveryZones.${index}.name` as const)}
                  />
                </div>
                <div className="grid gap-2 w-24">
                  <Label htmlFor={`deliveryZones.${index}.price`} className="sr-only">
                    Price
                  </Label>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...form.register(`deliveryZones.${index}.price` as const)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {form.formState.errors.deliveryZones && (
              <p className="text-sm text-red-500">
                {form.formState.errors.deliveryZones.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
