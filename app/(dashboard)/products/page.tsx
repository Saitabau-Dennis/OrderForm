"use client"

import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImageUpload } from "@/components/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ProductsPage() {
  const products: any[] = [];
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Product</SheetTitle>
              <SheetDescription>
                Add a new product to your store. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <ImageUpload />
              </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Product name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" placeholder="0.00" type="number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Product description" className="min-h-[100px]" />
              </div>
              <div className="grid gap-2">
                <Label>Size</Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-md border cursor-pointer transition-all
                        ${selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400 text-gray-700"
                        }
                      `}
                    >
                      <span className="text-sm font-medium">{size}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="Color" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your store products and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Thumbnail</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-muted" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === "Active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.views}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
