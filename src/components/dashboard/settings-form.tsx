"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import {
  Loader2,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/dashboard/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  secondaryColor: z.string().default("#95D5B2"),
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
  const [activeTab, setActiveTab] = useState<"config" | "account">("config");

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
      secondaryColor: initialData?.secondaryColor || "#95D5B2",
      theme: initialData?.theme || "Modern Minimalist",
      isActive: initialData?.isActive ?? true,
      deliveryZones:
        initialData?.deliveryZones?.map((dz: any) => ({
          name: dz.name,
          price: Number(dz.price),
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
      form.reset(data);
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
    <div className="w-full relative">
      {/* ─── Fixed Banner ─── */}
      <div className="-mt-3 -mx-4 md:-mx-10 sticky top-[64px] z-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00311F] via-[#003D28] to-[#005535]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-56 w-56 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute bottom-0 left-20 -mb-10 h-36 w-36 rounded-full bg-white/[0.04] blur-2xl" />
          <div className="absolute top-1/2 right-1/4 h-1 w-1 rounded-full bg-white/20" />
          <div className="absolute bottom-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-white/10" />

          <div className="relative z-10 px-4 pt-10 pb-5 md:px-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Store Settings
            </h1>
            <p className="text-white/50 mt-1 text-sm max-w-lg">
              Manage your store's identity, shipping, and account details.
            </p>

            {/* Tabs inside the banner */}
            <div className="flex gap-1 mt-6 -mb-5 relative z-20">
              <button
                type="button"
                onClick={() => setActiveTab("config")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200",
                  activeTab === "config"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-white/60 hover:text-white/90 hover:bg-white/[0.06]"
                )}
              >
                Configuration
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200",
                  activeTab === "account"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-white/60 hover:text-white/90 hover:bg-white/[0.06]"
                )}
              >
                Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="px-0 md:px-0 py-8">
        <AnimatePresence mode="wait">
          {/* ─── Configuration Tab ─── */}
          {activeTab === "config" && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pb-32">

                {/* ── Store Identity ── */}
                <section className="space-y-5">
                  <SectionLabel title="Store Identity" description="Your store's brand, name, and logo." />

                  <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
                    <div className="p-6 space-y-8">
                      <div className="flex flex-col sm:flex-row gap-8 items-start">
                        {/* Logo */}
                        <div className="space-y-2.5">
                          <Label className="text-sm font-normal text-muted-foreground">Logo</Label>
                          <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-all duration-300 bg-muted/5 cursor-pointer">
                            <ImageUpload
                              value={form.watch("logoUrl")}
                              onChange={(url) => form.setValue("logoUrl", url)}
                              endpoint="imageUploader"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground/50 max-w-[128px] leading-relaxed">
                            512×512px, PNG or SVG
                          </p>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 space-y-5 w-full">
                          <div className="grid gap-5 md:grid-cols-2">
                            <FieldGroup label="Store Name" error={form.formState.errors.name?.message}>
                              <Input
                                {...form.register("name")}
                                className="h-11 bg-white rounded-xl border-2 border-input focus-visible:border-primary/40"
                                placeholder="e.g. My Awesome Store"
                              />
                            </FieldGroup>

                            <FieldGroup label="Store URL" error={form.formState.errors.slug?.message}>
                              <div className="flex rounded-xl overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <span className="inline-flex items-center px-3 border-2 border-r-0 border-input bg-muted/20 text-muted-foreground text-xs font-medium rounded-l-xl">
                                  orderform.store/
                                </span>
                                <Input
                                  {...form.register("slug")}
                                  className="rounded-l-none rounded-r-xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-11 border-2"
                                />
                              </div>
                            </FieldGroup>
                          </div>

                          <FieldGroup label="Description">
                            <Controller
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <div className="border-2 border-input rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary/40 transition-all">
                                  <RichTextEditor
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    className="min-h-[120px] bg-white"
                                  />
                                </div>
                              )}
                            />
                          </FieldGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="opacity-40" />

                {/* ── Operations ── */}
                <section className="space-y-5">
                  <SectionLabel title="Operations" description="Contact info and currency settings." />

                  <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
                    <div className="p-6 grid gap-6 md:grid-cols-2">
                      {/* WhatsApp */}
                      <FieldGroup label="WhatsApp Number" error={form.formState.errors.whatsappNumber?.message}>
                        <div className="flex gap-2">
                          <Input
                            {...form.register("whatsappNumber")}
                            className="h-11 bg-white rounded-xl border-2 border-input focus-visible:border-primary/40"
                            placeholder="254..."
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleTestWhatsApp}
                            title="Test Number"
                            className="h-11 w-11 bg-white rounded-xl shrink-0 border-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </FieldGroup>

                      {/* Currency */}
                      <FieldGroup label="Currency">
                        <Select disabled value="KES">
                          <SelectTrigger className="bg-muted/10 h-11 rounded-xl border-2 border-input">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[11px] text-muted-foreground/50 mt-1">
                          More currencies coming soon
                        </p>
                      </FieldGroup>
                    </div>
                  </div>
                </section>

                <Separator className="opacity-40" />

                {/* ── Theme ── */}
                <section className="space-y-5">
                  <SectionLabel title="Theme" description="Choose a color palette for your store." />

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {THEMES.map((theme) => {
                      const isActive = form.watch("theme") === theme.name;
                      return (
                        <div
                          key={theme.name}
                          onClick={() => {
                            form.setValue("theme", theme.name, { shouldDirty: true });
                            form.setValue("brandColor", theme.primary, { shouldDirty: true });
                            form.setValue("secondaryColor", theme.secondary, { shouldDirty: true });
                          }}
                          className={cn(
                            "group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 relative overflow-hidden bg-white",
                            isActive
                              ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                              : "border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-10"
                            >
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </motion.div>
                          )}
                          <div className="flex flex-col gap-3 h-full">
                            <div className="h-20 w-full rounded-xl flex overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                              <div className="flex-1 relative" style={{ backgroundColor: theme.primary }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                              </div>
                              <div className="flex-1 relative" style={{ backgroundColor: theme.secondary }}>
                                <div className="absolute inset-0 bg-gradient-to-tl from-black/5 to-transparent" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-0.5">
                                  <div className="h-3 w-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: theme.primary }} />
                                  <div className="h-3 w-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: theme.secondary }} />
                                </div>
                                <span className={cn("text-sm font-medium", isActive ? "text-primary" : "text-foreground")}>
                                  {theme.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                                {theme.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <Separator className="opacity-40" />

                {/* ── Delivery ── */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between">
                    <SectionLabel title="Delivery" description="Define delivery zones and rates." />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", price: 0 })}
                      className="gap-2 bg-white shadow-sm hover:bg-white hover:text-primary hover:border-primary/30 rounded-xl border-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Zone
                    </Button>
                  </div>

                  <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
                    {/* Table Header */}
                    {fields.length > 0 && (
                      <div className="px-6 py-3 border-b border-border/60 bg-muted/[0.03]">
                        <div className="flex gap-4 items-center">
                          <span className="w-8 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">#</span>
                          <div className="flex-1 grid gap-4 sm:grid-cols-2">
                            <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">Region</span>
                            <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">Cost (KES)</span>
                          </div>
                          <span className="w-8" />
                        </div>
                      </div>
                    )}

                    <div className="divide-y divide-border/50">
                      {fields.length === 0 && (
                        <div className="p-14 text-center flex flex-col items-center justify-center">
                          <div className="bg-gradient-to-br from-muted/20 to-muted/5 p-5 rounded-2xl mb-4 border border-border/50">
                            <MapPin className="w-7 h-7 text-muted-foreground/25" />
                          </div>
                          <p className="font-medium text-foreground/70 mb-1">No delivery zones yet</p>
                          <p className="text-xs text-muted-foreground/60 max-w-[260px] mb-5">
                            Add zones to define delivery areas and shipping rates.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ name: "", price: 0 })}
                            className="gap-2 rounded-xl border-2"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add your first zone
                          </Button>
                        </div>
                      )}
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={cn(
                            "flex gap-4 p-4 md:px-6 items-center group transition-all hover:bg-primary/[0.01]",
                            index % 2 === 0 ? "bg-white" : "bg-muted/[0.02]"
                          )}
                        >
                          <div className="h-8 w-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-xs font-medium shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Input
                                placeholder="e.g. Nairobi CBD"
                                {...form.register(`deliveryZones.${index}.name` as const)}
                                className="h-10 bg-transparent rounded-xl border-2 border-input focus-visible:border-primary/40"
                              />
                              {form.formState.errors.deliveryZones?.[index]?.name && (
                                <p className="text-xs text-destructive">
                                  {form.formState.errors.deliveryZones[index]?.name?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <Input
                                placeholder="0"
                                type="number"
                                {...form.register(`deliveryZones.${index}.price` as const)}
                                className="h-10 bg-transparent rounded-xl border-2 border-input focus-visible:border-primary/40"
                              />
                              {form.formState.errors.deliveryZones?.[index]?.price && (
                                <p className="text-xs text-destructive">
                                  {form.formState.errors.deliveryZones[index]?.price?.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Save Bar */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button type="submit" disabled={loading} className="gap-2 rounded-xl px-5">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                  </Button>
                </div>

              </form>
            </motion.div>
          )}

          {/* ─── Account Tab ─── */}
          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="rounded-2xl border-2 border-border bg-white overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
                  <div className="px-6 pb-6 -mt-10">
                    <div className="flex items-end gap-4">
                      <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                        {userData?.image ? (
                          <img src={userData.image} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-primary/60">
                              {userData?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-lg font-medium text-foreground">{userData?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{userData?.email || "No email"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coming Soon */}
                <div className="rounded-2xl border-2 border-dashed border-border bg-muted/[0.02]">
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <h3 className="text-base font-medium text-foreground mb-1">More Features Coming Soon</h3>
                    <p className="text-muted-foreground text-sm max-w-sm mt-1.5 leading-relaxed">
                      We're building account management features including password changes,
                      notification preferences, and security settings.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Reusable: Section Label ─── */
function SectionLabel({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-0.5">
      <h3 className="text-base font-medium tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Reusable: Field Group ─── */
function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
