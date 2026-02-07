import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { CustomersClient, CustomerColumn } from "@/components/dashboard/customers-client";
import { format } from "date-fns";

// Helper for currency formatting
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KES",
});

export default async function CustomersPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!store) {
    redirect("/onboarding");
  }

  // Fetch all orders for this store
  const orders = await db.order.findMany({
    where: {
      storeId: store.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Aggregate customers by Phone Number (as a unique identifier proxy)
  const customersMap = new Map<string, CustomerColumn>();

  orders.forEach((order) => {
    // Normalize phone number slightly (remove spaces/dashes) to ensure better grouping
    const phoneKey = order.customerPhone.replace(/\s+/g, '').replace(/-/g, '');

    if (!customersMap.has(phoneKey)) {
      customersMap.set(phoneKey, {
        id: phoneKey,
        name: order.customerName,
        phone: order.customerPhone,
        address: order.deliveryAddress,
        totalOrders: 0,
        totalSpent: "0", // Will format at the end, keep as number internally first if needed, but for display string is fine
        lastOrderDate: format(order.createdAt, "MMM do, yyyy"), // First one we hit is the latest due to orderBy desc
      });
    }

    const customer = customersMap.get(phoneKey)!;
    
    // Increment stats
    customer.totalOrders += 1;
    
    // Parse current totalSpent, add new amount, then re-format (simplified approach)
    // A better way is to store raw value and format only at the end.
    // Let's use a temporary object for calculation if we want precision, 
    // but for this MVP, we can just re-calculate below.
  });

  // Second pass to calculate totals properly (cleaner than updating strings)
  const aggregatedData: CustomerColumn[] = [];
  const tempTotals = new Map<string, number>();

  orders.forEach((order) => {
    const phoneKey = order.customerPhone.replace(/\s+/g, '').replace(/-/g, '');
    const currentTotal = tempTotals.get(phoneKey) || 0;
    tempTotals.set(phoneKey, currentTotal + Number(order.totalAmount));
  });

  // Re-build final array
  customersMap.forEach((value, key) => {
    const rawTotal = tempTotals.get(key) || 0;
    aggregatedData.push({
      ...value,
      totalSpent: formatter.format(rawTotal),
    });
  });

  // Sort by most recent order (or could be total spent)
  // Since we processed orders desc, the list is roughly in order of appearance
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CustomersClient data={aggregatedData} />
    </div>
  );
}
