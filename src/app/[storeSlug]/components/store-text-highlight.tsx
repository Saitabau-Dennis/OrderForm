interface StoreTextHighlightProps {
  text: string
  highlightColor: string
}

export function StoreTextHighlight({ text, highlightColor }: StoreTextHighlightProps) {
  const renderHighlight = (content: string, key: string | number) => (
    <span key={key} className="relative mx-[0.04em] inline-block px-[0.24em] py-[0.08em] align-baseline">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[0.02em] h-[0.64em] opacity-20"
        style={{ backgroundColor: highlightColor, transform: "skewX(-10deg)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[0.12em] bottom-[0.12em] h-[0.54em] opacity-35"
        style={{ backgroundColor: highlightColor, transform: "skewX(-7deg)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[0.16em] right-[0.46em] top-[0.04em] h-[2px] opacity-80"
        style={{ backgroundColor: highlightColor }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[0.1em] top-[0.01em] h-[0.34em] w-[0.34em] opacity-80"
        style={{ backgroundColor: highlightColor }}
      />
      <span className="relative z-10 font-semibold tracking-tight text-[#1A1A16]">{content}</span>
    </span>
  )

  if (text.includes("*")) {
    const parts = text.split(/(\*[^*]+\*)/g)
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("*") && part.endsWith("*")) {
            return renderHighlight(part.slice(1, -1), index)
          }
          return <span key={index}>{part}</span>
        })}
      </>
    )
  }

  const words = text.trim().split(/\s+/)
  if (words.length <= 4) return <>{text}</>

  const highlightCount = Math.min(4, Math.max(2, Math.floor(words.length / 3)))
  const normalText = words.slice(0, words.length - highlightCount).join(" ")
  const highlightedText = words.slice(words.length - highlightCount).join(" ")

  return (
    <>
      {normalText} {renderHighlight(highlightedText, "auto-highlight")}
    </>
  )
}
