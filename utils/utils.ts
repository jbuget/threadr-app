export function generateUniqueKey(prefix: string, suffix?: string | number) {
  return `${prefix}_${Date.now()}_${generateRandomString()}`
}

export function generateRandomString() {
  return Math.random().toString(36).slice(2, 7);
}