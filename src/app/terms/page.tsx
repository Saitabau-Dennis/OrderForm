import { auth } from "@/lib/auth"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default async function TermsPage() {
  const session = await auth()

  return (
    <main className="min-h-screen flex flex-col theme-landing bg-background text-foreground">
      <Navbar isAuthenticated={!!session} />
      
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-32 md:py-40">
        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 font-sans">
          <section>
             <p className="text-muted-foreground text-lg leading-relaxed">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
            <p className="text-muted-foreground mt-4">
              Welcome to OrderForm. By accessing or using our website and services, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">1. Description of Service</h2>
            <p className="text-muted-foreground">
              OrderForm provides a platform for entrepreneurs to create simple online stores and manage orders via WhatsApp integration. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              To use certain features, you must register for an account. You are responsible for:
            </p>
             <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Providing accurate and complete information during registration.</li>
            </ul>
             <p className="text-muted-foreground mt-4">
              We reserve the right to terminate accounts that violate these Terms or engage in illegal activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">3. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to use OrderForm for any unlawful purpose or in any way that could harm the service or its users. Prohibited activities include, but are not limited to:
            </p>
             <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Selling illegal or prohibited items.</li>
              <li>Harassing or spamming other users.</li>
              <li>Attempting to hack or disrupt our servers.</li>
              <li>Infringing on intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, trademarks, and features on OrderForm (excluding user-generated content) are the property of OrderForm and are protected by applicable intellectual property laws. You claim ownership of the content you upload, but grant us a license to display and distribute it as part of providing the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">5. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The service is provided on an &quot;as-is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, regarding the reliability, accuracy, or availability of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, OrderForm shall not be liable for any indirect, incidental, special, or consequential damages arising out of or concerning your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">7. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-medium mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:<br/>
              <span className="font-medium text-foreground">Email:</span> dennisntete28@gmail.com
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
