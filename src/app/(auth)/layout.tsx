export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full theme-landing font-sans bg-[radial-gradient(circle_at_top,#00311f0d_0%,#ffffff_42%)] md:bg-background flex items-stretch justify-center px-0 py-0 md:items-start md:p-4 md:pt-20">
      {children}
    </div>
  )
}
