const sensitiveDomainTokens = [
  "bank",
  "pay",
  "stripe",
  "paypal",
  "checkout",
  "billing",
  "secure"
]

export const isSensitiveDomain = (hostname: string): boolean => {
  const lower = hostname.toLowerCase()
  return sensitiveDomainTokens.some((token) => lower.includes(token))
}
