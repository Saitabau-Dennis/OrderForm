"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash, Settings, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AddZoneSheet } from "@/components/dashboard/add-zone-sheet";

export default function SettingsPage() {
  const [themeColor, setThemeColor] = useState("zinc");

  const colors = [
    { name: "zinc", class: "bg-zinc-950" },
    { name: "red", class: "bg-red-500" },
    { name: "rose", class: "bg-rose-500" },
    { name: "orange", class: "bg-orange-500" },
    { name: "green", class: "bg-emerald-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "violet", class: "bg-violet-500" },
  ];
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 p-8 md:p-10">
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-sm">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight font-heading text-foreground">Store Settings</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Manage your store preferences, appearance, and configuration.
            </p>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="store" className="px-4">Store</TabsTrigger>
          <TabsTrigger value="profile" className="px-4">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your public profile and personal details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-2xl">🧑‍💼</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Store" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Owner" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="owner@example.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid gap-6">
            {/* Store Theme */}
            <Card>
              <CardHeader>
                <CardTitle>Store Theme</CardTitle>
                <CardDescription>
                  Select the primary color for your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
                    {colors.map((color) => (
                      <div
                        key={color.name}
                        className={cn(
                          "group relative flex h-12 w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted transition-all hover:border-primary",
                          themeColor === color.name ? "border-primary" : ""
                        )}
                        onClick={() => setThemeColor(color.name)}
                      >
                        <div className={cn("h-8 w-8 rounded-full", color.class)} />
                        {themeColor === color.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white mix-blend-difference" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Identity */}
            <Card>
              <CardHeader>
                <CardTitle>Store Identity</CardTitle>
                <CardDescription>
                  Manage your store's public profile and details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" placeholder="My Awesome Store" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Store Slug</Label>
                  <Input id="slug" disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Tell us about your store" />
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
                <CardDescription>
                  Set up the WhatsApp number where you want to receive orders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 234 567 8900" />
                </div>
              </CardContent>
            </Card>

            {/* Commerce Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Commerce Rules</CardTitle>
                <CardDescription>
                  Configure currency and delivery zones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Delivery Zones</Label>
                    <AddZoneSheet />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground border rounded-lg border-dashed">
                      <p className="text-sm">No delivery zones added</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
