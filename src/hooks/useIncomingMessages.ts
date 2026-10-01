import { useEffect, useRef } from 'react'
import type { ChatMessage, Credentials } from '../types'
import {
  deleteNotification,
  receiveNotification,
  type Notification,
} from '../api/greenApi'

const IDLE_DELAY = 4000
const BUSY_DELAY = 500

function toIncomingMessage(n: Notification): ChatMessage | null {
  const { body } = n
  if (body?.typeWebhook !== 'incomingMessageReceived') return null

  const text =
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.text
  if (!text) return null

  return {
    id: body.idMessage ?? `in-${n.receiptId}`,
    direction: 'in',
    text,
    timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
  }
}

/**
 * Поллинг входящих: receiveNotification → обработка → deleteNotification
 * (подтверждение сдвигает очередь). Колбэки держим в ref, чтобы не
 * перезапускать цикл на каждый ре-рендер.
 */
export function useIncomingMessages(
  credentials: Credentials | null,
  onMessage: (m: ChatMessage) => void,
  onError?: (e: unknown) => void,
) {
  const onMessageRef = useRef(onMessage)
  const onErrorRef = useRef(onError)
  onMessageRef.current = onMessage
  onErrorRef.current = onError

  useEffect(() => {
    if (!credentials) return

    let stopped = false
    let timer: ReturnType<typeof setTimeout>

    async function poll() {
      if (stopped || !credentials) return
      let delay = IDLE_DELAY
      try {
        const notification = await receiveNotification(credentials)
        if (notification) {
          delay = BUSY_DELAY
          const message = toIncomingMessage(notification)
          if (message) onMessageRef.current(message)
          await deleteNotification(credentials, notification.receiptId)
        }
      } catch (e) {
        onErrorRef.current?.(e)
      } finally {
        if (!stopped) timer = setTimeout(poll, delay)
      }
    }

    poll()
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [credentials])
}
