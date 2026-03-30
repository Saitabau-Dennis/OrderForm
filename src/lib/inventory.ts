type VariantGroup = {
  name: string
  options: string[]
}

export function normalizeToken(value: string): string {
  return value.trim().toLowerCase()
}

export function parseVariantGroups(variants: unknown): VariantGroup[] {
  if (!Array.isArray(variants)) return []

  return variants
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const candidate = item as { name?: unknown; options?: unknown[] }
      if (typeof candidate.name !== "string" || !Array.isArray(candidate.options)) return null

      const options = candidate.options
        .map((option) => {
          if (typeof option === "string") return option.trim()
          if (option && typeof option === "object") {
            const objectOption = option as { value?: unknown; label?: unknown; name?: unknown }
            if (typeof objectOption.value === "string") return objectOption.value.trim()
            if (typeof objectOption.label === "string") return objectOption.label.trim()
            if (typeof objectOption.name === "string") return objectOption.name.trim()
          }
          return ""
        })
        .filter(Boolean)

      if (!candidate.name.trim() || options.length === 0) return null
      return { name: candidate.name.trim(), options: Array.from(new Set(options)) }
    })
    .filter((value): value is VariantGroup => Boolean(value))
}

export function buildVariantStockKey(parts: Array<{ name: string; value: string }>): string {
  return parts
    .map((part) => ({ name: normalizeToken(part.name), value: normalizeToken(part.value) }))
    .filter((part) => part.name && part.value)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((part) => `${part.name}:${part.value}`)
    .join("|")
}

export function variantLabelToStockKey(variantLabel?: string | null): string | null {
  if (!variantLabel) return null

  const parts = variantLabel
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const separatorIndex = segment.indexOf(":")
      if (separatorIndex === -1) return null
      const name = segment.slice(0, separatorIndex).trim()
      const value = segment.slice(separatorIndex + 1).trim()
      if (!name || !value) return null
      return { name, value }
    })
    .filter((value): value is { name: string; value: string } => Boolean(value))

  if (parts.length === 0) return null
  return buildVariantStockKey(parts)
}

export function extractVariantOptionValues(variantLabel?: string | null): string[] {
  if (!variantLabel) return []

  return variantLabel
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const separatorIndex = segment.indexOf(":")
      if (separatorIndex === -1) return segment.trim()
      return segment.slice(separatorIndex + 1).trim()
    })
    .map((value) => normalizeToken(value))
    .filter(Boolean)
}

function buildVariantCombinations(groups: VariantGroup[]): string[] {
  if (groups.length === 0) return []

  const combine = (index: number, current: Array<{ name: string; value: string }>): string[] => {
    if (index >= groups.length) return [buildVariantStockKey(current)]

    const group = groups[index]
    const keys: string[] = []
    for (const option of group.options) {
      keys.push(...combine(index + 1, [...current, { name: group.name, value: option }]))
    }
    return keys
  }

  return Array.from(new Set(combine(0, []).filter(Boolean)))
}

export function getDeclaredOptionStockKeys(sizes: string | null | undefined, variants: unknown): string[] {
  const variantGroups = parseVariantGroups(variants)
  if (variantGroups.length > 0) {
    if (variantGroups.length === 1) {
      return Array.from(
        new Set(variantGroups[0].options.map((option) => normalizeToken(option)).filter(Boolean))
      )
    }

    return buildVariantCombinations(variantGroups)
  }

  return Array.from(
    new Set(
      (sizes ?? "")
        .split(",")
        .map((value) => normalizeToken(value))
        .filter(Boolean)
    )
  )
}

