export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full theme-landing bg-background flex items-start justify-center p-4 pt-10 md:pt-20">
      {children}
    </div>
  )
}
