/**
 * Преобразует телефон в WhatsApp chatId формата GREEN-API: только цифры + "@c.us".
 * Пример: "+7 (999) 123-45-67" -> "79991234567@c.us".
 */
export function phoneToChatId(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `${digits}@c.us`
}

/** Грубая валидация номера: 10–15 цифр (международный диапазон). */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}
