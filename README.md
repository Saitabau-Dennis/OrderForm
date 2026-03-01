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
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Email**: [Resend](https://resend.com/)


##  License

This project is licensed under the [MIT License](LICENSE).

## Environment Variables (Reviews + Rewards)

To enable SMS discount rewards after review approval, configure:

- `TIARA_CONNECT_SMS_ENDPOINT` - Full Tiara Connect SMS endpoint URL.
- `TIARA_CONNECT_API_KEY` - Tiara Connect API key/token.
- `TIARA_CONNECT_SENDER_ID` - Sender ID used for SMS (optional, based on provider account rules).
- `TIARA_CONNECT_AUTH_HEADER` - Auth header name (default: `Authorization`).
- `TIARA_CONNECT_AUTH_SCHEME` - Auth scheme prefix (default: `Bearer`).
- `SMS_DEFAULT_COUNTRY_CODE` - Used when customer numbers start with `0` (default: `254`).
- `REVIEW_REWARD_PERCENT_OFF` - Percent discount for approved reviews (default: `10`).
- `REVIEW_REWARD_EXPIRY_DAYS` - Discount code validity in days (default: `30`).

## Environment Variables (M-Pesa)

- `MPESA_ENVIRONMENT` - `sandbox` or `live`.
- `MPESA_CONSUMER_KEY` - Daraja app consumer key.
- `MPESA_CONSUMER_SECRET` - Daraja app consumer secret.
- `MPESA_SHORTCODE` - PayBill/Till shortcode.
- `MPESA_PASSKEY` - STK passkey.
- `MPESA_CALLBACK_URL` - Optional explicit callback URL (overrides auto-build).
- `MPESA_CALLBACK_TOKEN` - Optional token query guard for callback endpoint.
- `APP_URL` or `NEXTAUTH_URL` - Used to auto-build callback URL when `MPESA_CALLBACK_URL` is not set.
