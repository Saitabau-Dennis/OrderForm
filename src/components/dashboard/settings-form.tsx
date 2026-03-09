"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/dashboard/dashboard-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStoreSettings } from "@/lib/actions/store";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "")
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

const CAN_USE_SUBDOMAIN_URLS =
  Boolean(ROOT_DOMAIN) && !ROOT_DOMAIN.endsWith(".vercel.app");

const THEMES = [
  {
    name: "Butter & Twilight",
    primary: "#426BC2",
    secondary: "#FFED9E",
  },
  {
    name: "Leaves & Sky",
    primary: "#4A9166",
    secondary: "#A6CFF2",
  },
  {
    name: "Blossom & Forest",
    primary: "#124224",
    secondary: "#F2C0CA",
  },
  {
    name: "Cloud & Apple",
    primary: "#A6BA1A",
    secondary: "#F7F2E8",
  },
];

// Form schema intentionally allows empty strings for optional URL/email fields.
const settingsSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().default(""),
  slug: z.string().min(1, "Slug is required"),
  whatsappNumber: z.string().min(10, "WhatsApp number is required"),
  contactEmail: z.union([z.literal(""), z.string().email("Enter a valid email address")]).default(""),
  contactPhone: z.string().default(""),
  contactAddress: z.string().default(""),
  instagramUrl: z.union([z.literal(""), z.string().url("Enter a valid URL including https://")]).default(""),
  facebookUrl: z.union([z.literal(""), z.string().url("Enter a valid URL including https://")]).default(""),
  tiktokUrl: z.union([z.literal(""), z.string().url("Enter a valid URL including https://")]).default(""),
  xUrl: z.union([z.literal(""), z.string().url("Enter a valid URL including https://")]).default(""),
  currency: z.string().default("KES"),
  brandColor: z.string().default("#426BC2"),
  secondaryColor: z.string().default("#A6CFF2"),
  theme: z.string().default("Butter & Twilight"),
  isActive: z.boolean().default(true),
  deliveryZones: z.array(
    z.object({
      name: z.string().min(1, "Zone name is required"),
      price: z.coerce.number().min(0, "Price must be positive"),
    })
  ),
});

type SettingsFormInput = z.input<typeof settingsSchema>;
type SettingsValues = z.output<typeof settingsSchema>;

interface InitialDeliveryZone {
  name: string;
  price: number | string;
}

interface InitialStoreData {
  name?: string | null;
  description?: string | null;
  slug?: string | null;
  whatsappNumber?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  xUrl?: string | null;
  currency?: string | null;
  brandColor?: string | null;
  secondaryColor?: string | null;
  theme?: string | null;
  isActive?: boolean | null;
  deliveryZones?: InitialDeliveryZone[];
}

interface SettingsFormProps {
  initialData: InitialStoreData | null;
  userData?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function SettingsForm({ initialData, userData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "account">("config");
  const avatarSeed = userData?.name || "User";
  const diceAvatarSrc = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(
    avatarSeed
  )}&backgroundColor=e9c46a,2a9d8f,264653`;

  const form = useForm<SettingsFormInput, unknown, SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      contactEmail: initialData?.contactEmail || "",
      contactPhone: initialData?.contactPhone || "",
      contactAddress: initialData?.contactAddress || "",
      instagramUrl: initialData?.instagramUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
      tiktokUrl: initialData?.tiktokUrl || "",
      xUrl: initialData?.xUrl || "",
      currency: initialData?.currency || "KES",
      brandColor: initialData?.brandColor || "#426BC2",
      secondaryColor: initialData?.secondaryColor || "#A6CFF2",
      theme: initialData?.theme || "Butter & Twilight",
      isActive: initialData?.isActive ?? true,
      deliveryZones:
        initialData?.deliveryZones?.map((zone: InitialDeliveryZone) => ({
          name: zone.name,
          price: Number(zone.price),
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryZones",
  });

  const name = form.watch("name");
  const selectedThemeName = form.watch("theme");

  useEffect(() => {
    // Auto-generate slug only during first-time setup; never overwrite existing stores.
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

      form.reset(data);
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTestWhatsApp = () => {
    const number = form.getValues("whatsappNumber")?.trim();

    if (!number) {
      toast.error("Please enter a WhatsApp number first");
      return;
    }

    window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
  };

  const applyTheme = (themeName: string) => {
    const nextTheme = THEMES.find((theme) => theme.name === themeName);
    form.setValue("theme", themeName, { shouldDirty: true });

    if (nextTheme) {
      form.setValue("brandColor", nextTheme.primary, { shouldDirty: true });
      form.setValue("secondaryColor", nextTheme.secondary, { shouldDirty: true });
    }
  };

  return (
    <div className="w-full pb-14">
      <div className="border-b border-border/70 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your store identity, ordering details, and delivery setup.
        </p>

        <div className="mt-5 inline-flex rounded-xl border border-border p-1">
          <Button
            type="button"
            variant={activeTab === "config" ? "default" : "ghost"}
            onClick={() => setActiveTab("config")}
            className={cn(
              "rounded-xl h-9 px-4 py-2 text-sm font-normal transition-colors shadow-none hover:translate-y-0",
              activeTab !== "config" && "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Configuration
          </Button>
          <Button
            type="button"
            variant={activeTab === "account" ? "default" : "ghost"}
            onClick={() => setActiveTab("account")}
            className={cn(
              "rounded-xl h-9 px-4 py-2 text-sm font-normal transition-colors shadow-none hover:translate-y-0",
              activeTab !== "account" && "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Account
          </Button>
        </div>
      </div>

      {activeTab === "config" ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-8">
          <SectionBlock
            title="Store Identity"
            description="Name, link, and store description."
          >
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <FieldGroup label="Store Name" error={form.formState.errors.name?.message}>
                  <Input
                    {...form.register("name")}
                    placeholder="e.g. My Awesome Store"
                    className="h-11 rounded-xl"
                  />
                </FieldGroup>

                <FieldGroup label="Store URL" error={form.formState.errors.slug?.message}>
                  <div className="flex overflow-hidden rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                    {CAN_USE_SUBDOMAIN_URLS ? (
                      <>
                        <span className="inline-flex items-center border-r border-input bg-muted/30 px-3 text-xs text-muted-foreground">
                          https://
                        </span>
                        <Input
                          {...form.register("slug")}
                          className="h-11 rounded-none border-0 focus-visible:ring-0"
                        />
                        <span className="inline-flex items-center border-l border-input bg-muted/30 px-3 text-xs text-muted-foreground">
                          .{ROOT_DOMAIN}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center border-r border-input bg-muted/30 px-3 text-xs text-muted-foreground">
                          orderform.store/
                        </span>
                        <Input
                          {...form.register("slug")}
                          className="h-11 rounded-none border-0 focus-visible:ring-0"
                        />
                      </>
                    )}
                  </div>
                </FieldGroup>
              </div>

              <FieldGroup label="Description">
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      toolbar="advanced"
                      placeholder="Describe your store..."
                      className="min-h-[170px]"
                    />
                  )}
                />
              </FieldGroup>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Operations"
            description="WhatsApp and payment currency details."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup
                label="WhatsApp Number"
                error={form.formState.errors.whatsappNumber?.message}
              >
                <div className="flex gap-2">
                  <Input
                    {...form.register("whatsappNumber")}
                    className="h-11 rounded-xl"
                    placeholder="254..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl px-4"
                    onClick={handleTestWhatsApp}
                  >
                    Test
                  </Button>
                </div>
              </FieldGroup>

              <FieldGroup label="Currency">
                <Select disabled value="KES">
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">More currencies coming soon.</p>
              </FieldGroup>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Contact Details"
            description="These details are shown in the storefront Contact Us section."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup
                label="Contact Email"
                error={form.formState.errors.contactEmail?.message}
              >
                <Input
                  {...form.register("contactEmail")}
                  className="h-11 rounded-xl"
                  placeholder="support@yourstore.com"
                />
              </FieldGroup>

              <FieldGroup
                label="Contact Phone"
                error={form.formState.errors.contactPhone?.message}
              >
                <Input
                  {...form.register("contactPhone")}
                  className="h-11 rounded-xl"
                  placeholder="e.g. +254712345678"
                />
              </FieldGroup>

              <div className="md:col-span-2">
                <FieldGroup
                  label="Contact Address"
                  error={form.formState.errors.contactAddress?.message}
                >
                  <Input
                    {...form.register("contactAddress")}
                    className="h-11 rounded-xl"
                    placeholder="e.g. Kimathi Street, Nairobi CBD"
                  />
                </FieldGroup>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Social Links"
            description="Add your social profile URLs so customers can find you."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldGroup
                label="Instagram URL"
                error={form.formState.errors.instagramUrl?.message}
              >
                <Input
                  {...form.register("instagramUrl")}
                  className="h-11 rounded-xl"
                  placeholder="https://instagram.com/yourstore"
                />
              </FieldGroup>

              <FieldGroup
                label="Facebook URL"
                error={form.formState.errors.facebookUrl?.message}
              >
                <Input
                  {...form.register("facebookUrl")}
                  className="h-11 rounded-xl"
                  placeholder="https://facebook.com/yourstore"
                />
              </FieldGroup>

              <FieldGroup
                label="TikTok URL"
                error={form.formState.errors.tiktokUrl?.message}
              >
                <Input
                  {...form.register("tiktokUrl")}
                  className="h-11 rounded-xl"
                  placeholder="https://tiktok.com/@yourstore"
                />
              </FieldGroup>

              <FieldGroup
                label="X (Twitter) URL"
                error={form.formState.errors.xUrl?.message}
              >
                <Input
                  {...form.register("xUrl")}
                  className="h-11 rounded-xl"
                  placeholder="https://x.com/yourstore"
                />
              </FieldGroup>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Theme"
            description="Select a style preset. Colors are applied automatically."
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Pick a theme below. You can see all available color combinations.
              </p>

              <div className="grid max-w-4xl gap-3 sm:grid-cols-2">
                {THEMES.map((theme) => {
                  const isSelected = selectedThemeName === theme.name;

                  return (
                    <Button
                      key={theme.name}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => applyTheme(theme.name)}
                      className={cn(
                        "h-auto w-full flex-col items-stretch border p-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="overflow-hidden border border-border">
                        <div className="h-8" style={{ backgroundColor: theme.primary }} />
                        <div className="h-8" style={{ backgroundColor: theme.secondary }} />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-sm font-normal text-foreground">{theme.name}</p>
                        {isSelected ? (
                          <span className="text-[11px] font-normal text-primary">Selected</span>
                        ) : null}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            title="Delivery Zones"
            description="Add regions and delivery fees used at checkout."
            action={
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl px-3"
                onClick={() => append({ name: "", price: 0 })}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Zone
              </Button>
            }
          >
            {fields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm font-medium text-foreground">No zones added yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add your first delivery zone to start charging delivery fees.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 h-9 rounded-xl px-3"
                  onClick={() => append({ name: "", price: 0 })}
                >
                  Add First Zone
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid items-start gap-3 rounded-xl border border-border p-3 md:grid-cols-[minmax(0,1fr)_140px_auto]"
                  >
                    <div>
                      <Label className="text-xs font-normal text-muted-foreground">Region</Label>
                      <Input
                        placeholder="e.g. Nairobi CBD"
                        {...form.register(`deliveryZones.${index}.name` as const)}
                        className="mt-1 h-10 rounded-xl"
                      />
                      {form.formState.errors.deliveryZones?.[index]?.name ? (
                        <p className="mt-1 text-xs text-destructive">
                          {form.formState.errors.deliveryZones[index]?.name?.message}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <Label className="text-xs font-normal text-muted-foreground">Fee (KES)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register(`deliveryZones.${index}.price` as const)}
                        className="mt-1 h-10 rounded-xl"
                      />
                      {form.formState.errors.deliveryZones?.[index]?.price ? (
                        <p className="mt-1 text-xs text-destructive">
                          {form.formState.errors.deliveryZones[index]?.price?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="pt-6 md:pt-[22px]">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-10 rounded-xl px-3 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>

          <div className="flex justify-end border-t border-border/70 pt-5">
            <Button type="submit" disabled={loading} className="h-10 rounded-xl px-5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 pt-8">
          <SectionBlock title="Account" description="Basic account information.">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-20 w-20 overflow-hidden rounded-none border border-border bg-muted/20">
                  <Avatar className="h-20 w-20 rounded-none">
                    <AvatarImage src={diceAvatarSrc} alt="Profile" className="rounded-none object-cover" />
                    <AvatarFallback className="rounded-none bg-muted/20 text-xl font-semibold text-primary/60">
                      {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <p className="text-base font-medium text-foreground">{userData?.name || "Store Owner"}</p>
                  <p className="text-sm text-muted-foreground">{userData?.email || "No email available"}</p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Password, notification, and security controls are coming soon.
                </p>
              </div>
            </div>
          </SectionBlock>
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium tracking-tight text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
