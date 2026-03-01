"use client"

import { Button } from "@/components/dashboard/dashboard-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"

export function AddZoneSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-3xl shadow-sm hover:shadow-md transition-all duration-200">
            <Plus className="mr-2 h-4 w-4" />
            Add Zone
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Delivery Zone</SheetTitle>
          <SheetDescription>
            Create a new delivery zone and set the shipping rates.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Zone Name</Label>
            <Input id="name" placeholder="e.g. Nairobi CBD" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Delivery Fee</Label>
            <Input id="price" placeholder="e.g. 300" type="number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Estimated Time</Label>
            <Input id="time" placeholder="e.g. 1-2 hours" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="w-full rounded-3xl shadow-md hover:shadow-lg transition-all duration-200">
              Save Zone
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
