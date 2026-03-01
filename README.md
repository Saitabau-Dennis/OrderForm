# OrderForm

**Turn Instagram Comments into WhatsApp Orders.**

OrderForm is a specialized e-commerce platform designed for social media sellers. It transforms your social media bio link into a sleek, mini storefront where customers can browse products, manage their cart, and complete orders directly via WhatsApp.

##  Features

- **Mini Storefronts**: Create a beautiful, mobile-first store optimized for social media bio links.
- **WhatsApp Checkout**: Seamlessly generates pre-filled WhatsApp messages with order details, connecting customers directly to you.
- **Product Management**: Easy-to-use dashboard to add, edit, and manage your product catalog.
- **Cart System**: Full shopping cart functionality allowing customers to select multiple items.
- **Authentication**: Secure user accounts for store owners using NextAuth.js.
- **High Performance**: Built with Next.js 16 and optimized for speed.
- **Modern UI/UX**: Features smooth animations with Framer Motion and a polished design using Tailwind CSS.

##  Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Email**: [Resend](https://resend.com/)

## Environment Variables (Database)

- `DATABASE_URL` - Pooled Postgres connection string used by the running app.
- `DIRECT_URL` - Direct Postgres connection string used by Prisma migrations (`migrate deploy`).


##  License

This project is licensed under the [MIT License](LICENSE).

## Environment Variables (Reviews + Rewards)

To enable discount rewards after review approval, configure:

- `REVIEW_REWARD_PERCENT_OFF` - Percent discount for approved reviews (default: `10`).
- `REVIEW_REWARD_EXPIRY_DAYS` - Discount code validity in days (default: `30`).
