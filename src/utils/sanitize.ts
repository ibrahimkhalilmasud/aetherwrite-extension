const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const cardPattern = /\b(?:\d[ -]*?){13,19}\b/g

export const redactSensitiveText = (input: string): string => {
  return input.replace(emailPattern, "[REDACTED_EMAIL]").replace(cardPattern, "[REDACTED_NUMBER]")
}
