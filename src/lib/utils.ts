/**
 * Generate a random 6-character alphanumeric code
 * Uses uppercase letters and numbers for readability
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars: I, O, 0, 1
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Validate a 6-character alphanumeric code
 */
export function isValidCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/i.test(code)
}

/**
 * Format code for display (uppercase)
 */
export function formatCode(code: string): string {
  return code.toUpperCase().slice(0, 6)
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } finally {
      textArea.remove()
    }
  } catch {
    return false
  }
}

/**
 * Trigger haptic feedback if available
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  if ('vibrate' in navigator) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 30
    navigator.vibrate(duration)
  }
}

