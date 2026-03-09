"use client"

type StoreTopBarProps = {
  socialLinks?: {
    instagramUrl?: string | null
    facebookUrl?: string | null
    tiktokUrl?: string | null
    xUrl?: string | null
  }
}

export function StoreTopBar({ socialLinks }: StoreTopBarProps) {
  // Render only populated links to avoid dead social buttons.
  const links = [
    { label: "Instagram", href: socialLinks?.instagramUrl },
    { label: "Facebook", href: socialLinks?.facebookUrl },
    { label: "TikTok", href: socialLinks?.tiktokUrl },
    { label: "X", href: socialLinks?.xUrl },
  ].filter((item) => Boolean(item.href))

  if (links.length === 0) return null

  return (
    <div className="border-b border-[#E3E3DE]">
      <div className="mx-auto flex w-full max-w-[1460px] items-center justify-center gap-5 px-4 py-2 sm:px-6 lg:justify-end lg:px-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6D6D67]">Follow us</span>
        <div className="flex items-center gap-4">
          {links.map((social) => (
            <a
              key={social.label}
              href={social.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1A1A1A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
