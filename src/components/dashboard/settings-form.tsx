"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, Trash2, ExternalLink, Plus, Zap, Store, User, Upload, Globe, MapPin, Palette, Phone, CreditCard, Sparkles, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStoreSettings } from "@/lib/actions/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const THEMES = [
  { name: "Midnight Luxe", primary: "#1A1A1A", secondary: "#D4AF37", description: "Bold black & gold for premium brands." },
  { name: "Organic Earth", primary: "#5D7052", secondary: "#F3E9D2", description: "Sage green & cream for natural vibes." },
  { name: "Vibrant Pop", primary: "#FF6B6B", secondary: "#FFE66D", description: "High-energy coral & yellow." },
  { name: "Oceanic Depth", primary: "#0F4C81", secondary: "#89C2D9", description: "Trustworthy deep blue & sky." },
  { name: "Soft Blush", primary: "#D88C9A", secondary: "#F2D0D9", description: "Elegant rose & pink tones." },
  { name: "Urban Concrete", primary: "#2D3436", secondary: "#E1E8EE", description: "Modern, minimal charcoal & gray." },
];

const settingsSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().default(""),
  slug: z.string().min(1, "Slug is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  currency: z.string().default("KES"),
  logoUrl: z.string().default(""),
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
  userData?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function SettingsForm({ initialData, userData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema) as any,
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
      deliveryZones: initialData?.deliveryZones?.map((dz: any) => ({
        name: dz.name,
        price: Number(dz.price)
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryZones",
  });

  const name = form.watch("name");

  useEffect(() => {
    if (!initialData && name) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
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
    if (number) window.open(`https://wa.me/${number}`, "_blank");
    else toast.error("Please enter a WhatsApp number first");
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="store" className="w-full space-y-8">
        <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent h-auto p-0 gap-8 rounded-none">
          <TabsTrigger 
            value="store" 
            className="rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all shadow-none"
          >
            <Store className="w-4 h-4 mr-2" />
            General Configuration
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 text-sm font-medium text-muted-foreground hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all shadow-none"
          >
            <User className="w-4 h-4 mr-2" />
            Account & Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="outline-none space-y-8 animate-in fade-in-50 duration-500">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-32">
            
            {/* Identity Group */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Store Identity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set the core details of your brand. This information will appear on your storefront and invoices.
                </p>
              </div>
              
              <Card className="border-border/60 shadow-sm">
                <CardContent className="p-6 space-y-8">
                  <div className="flex flex-col sm:flex-row gap-8 items-start">
                     <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Brand Logo</Label>
                        <div className="h-32 w-32 rounded-xl border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-all bg-muted/20">
                           <ImageUpload 
                              value={form.watch("logoUrl")} 
                              onChange={(url) => form.setValue("logoUrl", url)} 
                              endpoint="imageUploader" 
                              className="w-full h-full"
                           />
                           {!form.watch("logoUrl") && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground">
                                 <Upload className="w-5 h-5 mb-2 opacity-50" />
                                 <span className="text-[10px] font-semibold uppercase tracking-wider">Upload</span>
                              </div>
                           )}
                        </div>
                        <p className="text-[10px] text-muted-foreground w-32 text-center">
                           Recommended: 500x500px PNG or JPG
                        </p>
                     </div>

                     <div className="flex-1 space-y-6 w-full">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Store Name</Label>
                            <Input 
                              {...form.register("name")} 
                              className="h-10" 
                              placeholder="e.g. My Awesome Store"
                            />
                            {form.formState.errors.name && (
                              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Store URL Slug</Label>
                            <div className="flex rounded-md shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                orderform.store/
                              </span>
                              <Input 
                                {...form.register("slug")} 
                                className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                              />
                            </div>
                            {form.formState.errors.slug && (
                              <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                             <Label className="text-sm font-medium">Description / Bio</Label>
                             <span className="text-xs text-muted-foreground">Optional</span>
                          </div>
                          <Controller 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                                <RichTextEditor 
                                  value={field.value} 
                                  onChange={field.onChange}
                                  className="min-h-[120px] bg-background"
                                />
                              </div>
                            )}
                          />
                        </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Operations Group */}
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Contact & Currency</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  How customers reach you and pay for their orders.
                </p>
              </div>
              <Card className="border-border/60 shadow-sm">
                <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">WhatsApp Number</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          {...form.register("whatsappNumber")} 
                          className="pl-9" 
                          placeholder="254..." 
                        />
                      </div>
                      <Button type="button" variant="outline" size="icon" onClick={handleTestWhatsApp} title="Test Number">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    {form.formState.errors.whatsappNumber && (
                      <p className="text-xs text-destructive">{form.formState.errors.whatsappNumber.message}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">Orders will be sent to this WhatsApp number.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Store Currency</Label>
                    <Select disabled value="KES">
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">Currently locked to Kenyan Shilling.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Aesthetic Group */}
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Visual Style</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose a color theme that matches your brand personality.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {THEMES.map((theme) => {
                  const isActive = form.watch("theme") === theme.name;
                  return (
                    <div
                      key={theme.name}
                      onClick={() => { 
                        form.setValue("theme", theme.name); 
                        form.setValue("brandColor", theme.primary); 
                      }}
                      className={cn(
                        "group cursor-pointer rounded-xl border-2 p-1 transition-all duration-200 relative overflow-hidden",
                        isActive 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm"
                      )}
                    >
                      <div className="p-4 flex flex-col gap-4 h-full">
                        <div className="h-16 w-full rounded-lg flex overflow-hidden border border-border/10 shadow-sm shrink-0">
                          <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                          <div className="flex-1" style={{ backgroundColor: theme.secondary }} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <span className={cn("text-sm font-semibold", isActive ? "text-primary" : "text-foreground")}>
                              {theme.name}
                            </span>
                            {isActive && (
                              <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Logistics Group */}
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight">Delivery Zones</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Define where you deliver to and how much it costs.
                </p>
              </div>
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Regional Pricing</CardTitle>
                      <CardDescription>Add specific delivery fees for different areas.</CardDescription>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => append({ name: "", price: 0 })}
                      className="border-dashed"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Zone
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-border/60">
                     {fields.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                           No delivery zones added yet. Add one to start charging for delivery.
                        </div>
                     )}
                     {fields.map((field, index) => (
                       <div key={field.id} className="flex gap-4 p-4 items-center group hover:bg-muted/30 transition-colors">
                         <div className="flex-1 grid gap-4 md:grid-cols-2">
                           <div className="space-y-1">
                             <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Region Name</Label>
                             <Input 
                              placeholder="e.g. Nairobi CBD"
                              {...form.register(`deliveryZones.${index}.name` as const)} 
                              className="h-9" 
                            />
                             {form.formState.errors.deliveryZones?.[index]?.name && (
                               <p className="text-xs text-destructive">{form.formState.errors.deliveryZones[index]?.name?.message}</p>
                             )}
                           </div>
                           <div className="space-y-1">
                             <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Delivery Cost (KES)</Label>
                             <Input 
                               placeholder="0"
                               type="number"
                               {...form.register(`deliveryZones.${index}.price` as const)} 
                               className="h-9" 
                             />
                             {form.formState.errors.deliveryZones?.[index]?.price && (
                               <p className="text-xs text-destructive">{form.formState.errors.deliveryZones[index]?.price?.message}</p>
                             )}
                           </div>
                         </div>
                         <Button 
                           type="button" 
                           variant="ghost" 
                           size="icon" 
                           onClick={() => remove(index)} 
                           className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                     ))}
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
               <div className={cn("transition-all duration-300 ease-in-out flex items-center", form.formState.isDirty ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4")}>
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center">
                     <span className="h-2 w-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                     Unsaved changes
                  </p>
               </div>
               <Button type="submit" disabled={loading} size="lg" className="rounded-full shadow-lg shadow-primary/25 px-8 font-semibold min-w-[140px] h-12 text-base">
                 {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Save Changes"}
               </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="account" className="outline-none animate-in fade-in-50 duration-500 mt-0">
           <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <p className="text-muted-foreground font-medium">Coming Soon</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}