import type { Credentials } from '../types'

const BASE = 'https://api.green-api.com'

function buildUrl(c: Credentials, method: string, extra = ''): string {
  return `${BASE}/waInstance${c.idInstance}/${method}/${c.apiTokenInstance}${extra}`
}

/** Отправка текстового сообщения: метод sendMessage GREEN-API. */
export async function sendMessage(
  c: Credentials,
  chatId: string,
  message: string,
): Promise<{ idMessage: string }> {
  const res = await fetch(buildUrl(c, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })
  if (!res.ok) throw new Error(`Ошибка отправки (${res.status})`)
  return res.json()
}

/**
 * Форма входящего уведомления из HTTP API (receiveNotification).
 * body.typeWebhook определяет тип; нам нужен 'incomingMessageReceived'.
 */
export interface Notification {
  receiptId: number
  body: {
    typeWebhook?: string
    idMessage?: string
    timestamp?: number
    senderData?: { chatId?: string; sender?: string; senderName?: string }
    messageData?: {
      textMessageData?: { textMessage?: string }
      extendedTextMessageData?: { text?: string }
    }
  }
}

/** Получение очередного уведомления. Возвращает null, когда очередь пуста. */
export async function receiveNotification(c: Credentials): Promise<Notification | null> {
  const res = await fetch(buildUrl(c, 'receiveNotification'))
  if (!res.ok) throw new Error(`Ошибка получения (${res.status})`)
  // При пустой очереди GREEN-API возвращает пустое тело (а не JSON null),
  // поэтому читаем текст и парсим только непустой ответ.
  const text = await res.text()
  return text ? (JSON.parse(text) as Notification) : null
}

/** Подтверждение обработки уведомления — убирает его из очереди. */
export async function deleteNotification(c: Credentials, receiptId: number): Promise<void> {
  const res = await fetch(buildUrl(c, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Ошибка подтверждения (${res.status})`)
}
