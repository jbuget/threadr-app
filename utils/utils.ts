export function generateUniqueKey(prefix: string, suffix?: string | number) {
    return `${prefix}_${Date.now()}_${suffix}`
  }
  