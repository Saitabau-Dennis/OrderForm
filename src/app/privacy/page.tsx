import { auth } from "@/lib/auth"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default async function PrivacyPage() {
  const session = await auth()

  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar isAuthenticated={!!session} />
      
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-32 md:py-40">
        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 font-sans">
          <section>
             <p className="text-muted-foreground text-lg leading-relaxed">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mt-4">
              At OrderForm ("we," "our," or "us"), we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information that helps us provide and improve our service to you. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and account credentials when you register.</li>
              <li><strong>Store Information:</strong> Product details, pricing, and business settings you configure.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our platform, including IP address, browser type, and device information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide, operate, and maintain our services.</li>
              <li>To improve user experience and personalize our content.</li>
              <li>To communicate with you regarding updates, support, and promotional offers.</li>
              <li>To ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal data. We may share your information with trusted third-party service providers who assist us in operating our business (e.g., payment processors, hosting services), provided they agree to keep your information confidential. We may also disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground">
              Depending on your location, you may have rights regarding your personal data, including the right to access, correct, delete, or restrict its use. Please contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">6. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this page periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:<br/>
              <span className="font-medium text-foreground">Email:</span> dennisntete28@gmail.com
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
