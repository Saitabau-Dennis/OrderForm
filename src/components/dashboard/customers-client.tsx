"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/dashboard/button";
import { Separator } from "@/components/ui/separator";
import { CustomersTable, CustomerColumn } from "@/components/dashboard/customers-table";

interface CustomersClientProps {
  data: CustomerColumn[];
}

export function CustomersClient({ data }: CustomersClientProps) {
  const handleExport = () => {
    // Define CSV headers
    const headers = ["Name", "Phone", "Address", "Total Orders", "Total Spent", "Last Order"];

    // Map data to CSV rows
    const rows = data.map(customer => [
      customer.name,
      customer.phone,
      `"${customer.address}"`, // Quote address to handle commas
      customer.totalOrders,
      customer.totalSpent.replace(/[^\d.-]/g, ''), // Strip currency symbols if needed, or keep as string
      customer.lastOrderDate
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title & Description */}
        <div className="space-y-1">
          <h2 className="text-3xl font-medium tracking-tight text-foreground font-poppins">
            Overview
          </h2>
          <p className="text-sm text-muted-foreground font-poppins">
            Monitor your customers to increase your sales.
          </p>
        </div>

        {/* Right: Export Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="rounded-lg h-9 px-3 text-sm border-border bg-background hover:bg-accent transition-colors"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Separator />

      {/* Customers Table */}
      <div>
        <CustomersTable data={data} />
      </div>
    </div>
  );
}
