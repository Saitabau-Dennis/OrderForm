"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2, ArrowRight, ArrowLeft, Check, Smartphone,
  Plus, Trash2, Camera, Store, Truck, Palette, LayoutDashboard
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.NEXT_PUBLIC_VERCEL_URL || "")
  .replace(/^https?:\/\//i, "")
  .replace(/\/.*$/, "")
  .toLowerCase();

// --- Constants & Schemas ---

const THEMES = [
  { name: "Forest Night", primary: "#1B4332", secondary: "#95D5B2", description: "Deep forest green with fresh mint accents." },
  { name: "Ocean Breeze", primary: "#0077B6", secondary: "#CAF0F8", description: "Calming ocean blue with light sky tones." },
  { name: "Sunset Glow", primary: "#E85D04", secondary: "#FFEDD8", description: "Warm sunset orange with soft cream." },
  { name: "Berry Luxe", primary: "#7B2D8E", secondary: "#F3D9FA", description: "Rich purple with delicate lavender." },
  { name: "Slate Modern", primary: "#334155", secondary: "#E2E8F0", description: "Professional slate with clean gray." },
  { name: "Rose Garden", primary: "#BE185D", secondary: "#FCE7F3", description: "Elegant rose with soft pink blush." },
];

const deliveryZoneSchema = z.object({
  name: z.string().min(1, "Zone name is required"),
  price: z.number().min(0, "Price must be positive"),
});

const onboardingSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().min(0),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number is required (min 10 digits)"),
  currency: z.string().min(1),
  logoUrl: z.string().min(0),
  brandColor: z.string().min(1),
  secondaryColor: z.string().min(1),
  theme: z.string().min(1),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  deliveryZones: z.array(deliveryZoneSchema),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

interface OnboardingWizardProps {
  initialData: any;
}

// --- Component ---

export function OnboardingWizard({ initialData }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isSlugEdited, setIsSlugEdited] = useState(!!initialData?.slug);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      whatsappNumber: initialData?.whatsappNumber || "",
      currency: initialData?.currency || "KES",
      logoUrl: initialData?.logoUrl || "",
      brandColor: initialData?.brandColor || "#1B4332",
      secondaryColor: initialData?.secondaryColor || "#95D5B2",
      theme: initialData?.theme || "Forest Night",
      deliveryZones: initialData?.deliveryZones || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryZones",
  });

  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePrice, setNewZonePrice] = useState("");

  const handleAddZone = () => {
    if (!newZoneName || !newZonePrice) {
      toast.error("Please enter both zone name and price");
      return;
    }

    // Support "FREE" as a price
    const normalizedPrice = newZonePrice.trim().toLowerCase();
    const priceValue = normalizedPrice === "free" ? 0 : Number(newZonePrice);

    if (isNaN(priceValue)) {
      toast.error("Price must be a number or 'FREE'");
      return;
    }

    append({ name: newZoneName, price: priceValue });
    setNewZoneName("");
    setNewZonePrice("");
  };

  const watchedName = form.watch("name");
  useEffect(() => {
    if (!isSlugEdited && watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedName, isSlugEdited, form]);

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["name", "slug", "description"]);
    } else if (step === 2) {
      isValid = await form.trigger(["whatsappNumber", "currency"]);
    } else if (step === 3) {
      isValid = true;
    }

    if (isValid) {
      setStep((s) => s + 1);
    } else {
      toast.error("Please complete the required fields.");
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: OnboardingValues) => {
    try {
      setLoading(true);
      const result = await updateStoreSettings(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Store configured successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Identity", icon: Store, description: "Name, Logo & Description" },
    { id: 2, title: "Contact", icon: Smartphone, description: "WhatsApp Contact" },
    { id: 3, title: "Logistics", icon: Truck, description: "Delivery Zones" },
    { id: 4, title: "Theme", icon: Palette, description: "Look & Feel" },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-poppins">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-gray-100">

        {/* Left Sidebar - Progress */}
        <div className="w-full lg:w-80 bg-[#00311F] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
           {/* Abstract pattern */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-12">
                 <span className="font-poppins text-xl font-bold text-white tracking-tighter">
                    Order<span className="text-white/80">Form</span>
                 </span>
              </div>

              <div className="space-y-8">
                 {steps.map((s) => (
                    <div
                      key={s.id}
                      className={cn(
                        "flex items-start gap-4 transition-all duration-300",
                        step === s.id ? "opacity-100 translate-x-2" : "opacity-40"
                      )}
                    >
                       <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                          step === s.id ? "bg-white text-[#00311F] border-white" : "border-white/20 text-white"
                       )}>
                          <s.icon className="w-4 h-4" />
                       </div>
                       <div className="pt-1">
                          <p className="font-bold text-base leading-none">{s.title}</p>
                          <p className="text-xs text-white/60 mt-1.5 font-light">{s.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 pt-10">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white transition-all duration-500" style={{ width: `${(step/4)*100}%` }} />
              </div>
              <p className="text-xs text-white/40 mt-4 font-mono uppercase tracking-widest">{Math.round((step/4)*100)}% Complete</p>
           </div>
        </div>

        {/* Right Content - Form */}
        <div className="flex-1 flex flex-col bg-white">
           <div className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-10">

                 {/* Step Header */}
                 <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                       {step === 1 && "Let's build your brand identity."}
                       {step === 2 && "How will customers reach you?"}
                       {step === 3 && "Where do you deliver to?"}
                       {step === 4 && "Choose a style that fits."}
                    </h2>
                    <p className="text-gray-500 text-lg">
                       {step === 1 && "Your name and logo are the first things customers see."}
                       {step === 2 && "Set up your primary contact channel via WhatsApp."}
                       {step === 3 && "Define delivery zones to calculate costs automatically."}
                       {step === 4 && "Select a color theme that matches your brand."}
                    </p>
                 </div>

                 {/* Step Content */}
                 <div className="min-h-[300px]">
                    {step === 1 && (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex flex-col sm:flex-row gap-8 items-start">
                             <div className="space-y-3">
                                <Label className="text-sm font-semibold text-gray-700">Store Logo</Label>
                                <div className="h-32 w-32 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer bg-gray-50 hover:border-[#00311F] transition-colors">
                                   <ImageUpload
                                      value={form.watch("logoUrl")}
                                      onChange={(url) => form.setValue("logoUrl", url)}
                                      className="w-full h-full"
                                   />
                                   {!form.watch("logoUrl") && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                                         <Camera className="w-6 h-6" />
                                      </div>
                                   )}
                                </div>
                             </div>

                             <div className="flex-1 space-y-6 w-full">
                                <div className="space-y-3">
                                   <Label className="text-sm font-semibold text-gray-700">Store Name</Label>
                                   <Input
                                      {...form.register("name")}
                                      placeholder="e.g. Saita Collection"
                                      className="h-12 rounded-xl border-gray-200 focus:border-[#00311F] focus:ring-[#00311F]/20 text-lg"
                                   />
                                   {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-3">
                                   <Label className="text-sm font-semibold text-gray-700">Store Link (Slug)</Label>
                                   <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#00311F] focus-within:ring-4 focus-within:ring-[#00311F]/10 transition-all">
                                      {ROOT_DOMAIN ? (
                                        <>
                                          <div className="bg-gray-50 px-4 flex items-center text-gray-500 border-r border-gray-200 text-sm font-medium">https://</div>
                                          <Input
                                             {...form.register("slug")}
                                             onChange={(e) => {
                                                form.setValue("slug", e.target.value);
                                                setIsSlugEdited(true);
                                             }}
                                             placeholder="my-store"
                                             className="h-12 border-none shadow-none focus-visible:ring-0 rounded-none px-4 text-base"
                                          />
                                          <div className="bg-gray-50 px-4 flex items-center text-gray-500 border-l border-gray-200 text-sm font-medium">.{ROOT_DOMAIN}</div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="bg-gray-50 px-4 flex items-center text-gray-500 border-r border-gray-200 text-sm font-medium">orderform.store/</div>
                                          <Input
                                             {...form.register("slug")}
                                             onChange={(e) => {
                                                form.setValue("slug", e.target.value);
                                                setIsSlugEdited(true);
                                             }}
                                             placeholder="my-store"
                                             className="h-12 border-none shadow-none focus-visible:ring-0 rounded-none px-4 text-base"
                                          />
                                        </>
                                      )}
                                   </div>
                                   {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <Label className="text-sm font-semibold text-gray-700">Description</Label>
                             <Controller
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                   <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#00311F] focus-within:ring-1 focus-within:ring-[#00311F] transition-all">
                                      <RichTextEditor
                                         value={field.value ?? ""}
                                         onChange={field.onChange}
                                         className="min-h-[120px]"
                                         placeholder="Tell your customers what makes your store special..."
                                      />
                                   </div>
                                )}
                             />
                          </div>
                       </div>
                    )}

                    {step === 2 && (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="space-y-4">
                             <Label className="text-base font-semibold text-gray-900">WhatsApp Number</Label>
                             <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#25D366]/10 rounded-lg flex items-center justify-center">
                                   <Smartphone className="w-5 h-5 text-[#25D366]" />
                                </div>
                                <Input
                                   {...form.register("whatsappNumber")}
                                   placeholder="254 712 345 678"
                                   className="h-16 pl-16 rounded-2xl border-gray-200 text-xl font-medium focus:border-[#00311F] focus:ring-[#00311F]/20"
                                />
                             </div>
                             <p className="text-sm text-gray-500 ml-1">Include your country code. This is where you'll receive orders.</p>
                             {form.formState.errors.whatsappNumber && <p className="text-sm text-red-500 font-medium">{form.formState.errors.whatsappNumber.message}</p>}
                          </div>
                       </div>
                    )}

                    {step === 3 && (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                             <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-[#00311F]" /> Add New Zone
                             </h3>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                   <Label className="text-xs font-medium text-gray-500 uppercase">Region Name</Label>
                                   <Input
                                      value={newZoneName}
                                      onChange={(e) => setNewZoneName(e.target.value)}
                                      placeholder="e.g. Nairobi CBD"
                                      className="bg-white border-gray-200"
                                   />
                                </div>
                                <div className="w-full sm:w-32 space-y-2">
                                   <Label className="text-xs font-medium text-gray-500 uppercase">Cost</Label>
                                   <Input
                                      value={newZonePrice}
                                      onChange={(e) => setNewZonePrice(e.target.value)}
                                      placeholder="0"
                                      className="bg-white border-gray-200"
                                   />
                                </div>
                                <div className="flex items-end">
                                   <Button
                                      type="button"
                                      onClick={handleAddZone}
                                      className="bg-[#00311F] hover:bg-[#00311F]/90 text-white w-full sm:w-auto"
                                   >
                                      Add
                                   </Button>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <Label className="text-sm font-semibold text-gray-700">Active Delivery Zones</Label>
                             {fields.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                                   <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                   <p className="text-gray-400 text-sm">No zones added yet.</p>
                                </div>
                             ) : (
                                <div className="grid gap-3">
                                   {fields.map((field, index) => (
                                      <div key={field.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-all">
                                         <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span className="font-medium text-gray-900">{field.name}</span>
                                         </div>
                                         <div className="flex items-center gap-6">
                                            <span className="font-bold text-gray-900">
                                               {field.price === 0 ? "FREE" : `KSH ${field.price}`}
                                            </span>
                                            <button
                                               onClick={() => remove(index)}
                                               className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                               <Trash2 className="w-4 h-4" />
                                            </button>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>
                       </div>
                    )}

                    {step === 4 && (
                       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {THEMES.map((theme) => {
                                const isActive = form.watch("theme") === theme.name;
                                return (
                                   <div
                                      key={theme.name}
                                      onClick={() => {
                                         form.setValue("theme", theme.name);
                                         form.setValue("brandColor", theme.primary);
                                         form.setValue("secondaryColor", theme.secondary);
                                      }}
                                      className={cn(
                                         "cursor-pointer rounded-xl border-2 p-0.5 transition-all duration-200 hover:bg-gray-50",
                                         isActive ? "border-[#00311F] shadow-md bg-[#00311F]/5" : "border-transparent hover:border-gray-200"
                                      )}
                                   >
                                      <div className="rounded-lg p-3 flex items-center gap-4">
                                         <div className="h-12 w-20 rounded-md shadow-sm flex overflow-hidden border border-gray-100 shrink-0">
                                            <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                                            <div className="flex-1" style={{ backgroundColor: theme.secondary }} />
                                         </div>
                                         <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                               <h4 className="font-bold text-gray-900 text-sm truncate">{theme.name}</h4>
                                               {isActive && (
                                                  <div className="h-4 w-4 bg-[#00311F] rounded-full flex items-center justify-center shrink-0 ml-2">
                                                     <Check className="w-2.5 h-2.5 text-white" />
                                                  </div>
                                               )}
                                            </div>
                                            <p className="text-[11px] text-gray-500 truncate">{theme.description}</p>
                                         </div>
                                      </div>
                                   </div>
                                );
                             })}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Footer */}
           <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <Button
                 variant="ghost"
                 onClick={prevStep}
                 disabled={step === 1 || loading}
                 className="text-gray-500 hover:text-gray-900 hover:bg-white"
              >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Back
              </Button>

              <Button
                 size="lg"
                 onClick={step < 4 ? nextStep : form.handleSubmit(onSubmit)}
                 disabled={loading}
                 className="px-8 h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                 {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                 ) : step < 4 ? (
                    <>
                       Continue
                       <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                 ) : (
                    "Complete Setup"
                 )}
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
