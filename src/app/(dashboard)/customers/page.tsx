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

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user;

  const store = await db.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!store) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-0">
        <CustomersClient data={[]} />
      </div>
    );
  }

  // Backfill customers for legacy orders that pre-date customer model integration.
  const ordersWithoutCustomer = await db.order.findMany({
    where: {
      storeId: store.id,
      customerId: null,
    },
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      deliveryAddress: true,
    },
  });

  if (ordersWithoutCustomer.length > 0) {
    await db.$transaction(async (tx) => {
      for (const order of ordersWithoutCustomer) {
        const phoneNormalized =
          order.customerPhone.replace(/\D/g, "") ||
          order.customerPhone.trim().toLowerCase();
        const customer = await tx.customer.upsert({
          where: {
            storeId_phoneNormalized: {
              storeId: store.id,
              phoneNormalized,
            },
          },
          update: {
            name: order.customerName,
            phone: order.customerPhone,
            ...(order.deliveryAddress ? { defaultAddress: order.deliveryAddress } : {}),
          },
          create: {
            storeId: store.id,
            name: order.customerName,
            phone: order.customerPhone,
            phoneNormalized,
            defaultAddress: order.deliveryAddress,
          },
          select: { id: true },
        });

        await tx.order.update({
          where: { id: order.id },
          data: { customerId: customer.id },
        });
      }
    });
  }

  const customers = await db.customer.findMany({
    where: { storeId: store.id },
    include: {
      orders: {
        select: {
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data: CustomerColumn[] = customers.map((customer) => {
    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );
    const lastOrder = customer.orders[0];

    return {
      id: customer.id,
      name: customer.name || "Unknown Customer",
      phone: customer.phone,
      address: customer.defaultAddress || "—",
      totalOrders: customer.orders.length,
      totalSpent: formatter.format(totalSpent),
      lastOrderDate: lastOrder ? format(lastOrder.createdAt, "MMM do, yyyy") : "—",
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <CustomersClient data={data} />
    </div>
  );
}
