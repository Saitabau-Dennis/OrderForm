import { Facebook, Instagram, Music2, Twitter } from "lucide-react"

type StoreFooterProps = {
  storeName: string
  socialLinks?: {
    instagramUrl?: string | null
    facebookUrl?: string | null
    tiktokUrl?: string | null
    xUrl?: string | null
  }
}

export function StoreFooter({ storeName, socialLinks }: StoreFooterProps) {
  const links = [
    { label: "Instagram", href: socialLinks?.instagramUrl, icon: Instagram },
    { label: "Facebook", href: socialLinks?.facebookUrl, icon: Facebook },
    { label: "TikTok", href: socialLinks?.tiktokUrl, icon: Music2 },
    { label: "X", href: socialLinks?.xUrl, icon: Twitter },
  ].filter((item) => Boolean(item.href))

  return (
    <footer id="store-footer" className="bg-[#F7F7F5] border-t border-[#E8E8E5] mt-16">
      <div className="w-full px-3 py-8 sm:px-5 lg:px-7">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-3 text-sm text-[#737373] lg:flex-row">
          <div className="flex flex-col items-center gap-3 lg:items-start">
            <span className="max-w-[260px] truncate [font-family:var(--font-adcure)] text-[18px] leading-[0.95] tracking-tight text-[#111111] sm:text-[20px]">
              {storeName}
            </span>

            {links.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                {links.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.label}
                      href={link.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-8 w-8 items-center justify-center rounded-none border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-sm transition-colors hover:bg-[#1A1A1A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
                    >
                      <Icon className="h-[14px] w-[14px]" strokeWidth={2.4} />
                    </a>
                  )
                })}
              </div>
            ) : null}
          </div>

          <span>
            Powered by{" "}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              OrderForm
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
