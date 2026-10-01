import { useEffect, useRef } from 'react'
import type { ChatMessage, Credentials } from '../types'
import { deleteNotification, receiveNotification } from '../api/greenApi'

/**
 * Поллинг входящих сообщений через HTTP API GREEN-API.
 * Цикл: receiveNotification -> обработали -> deleteNotification (сдвигаем очередь).
 * Когда очередь пуста — опрашиваем реже; есть сообщения — чаще (быстро разгребаем).
 * Колбэки держим в ref, чтобы не пересоздавать цикл на каждый ре-рендер.
 */
export function useIncomingMessages(
  credentials: Credentials | null,
  active: boolean,
  onMessage: (m: ChatMessage) => void,
  onError?: (e: unknown) => void,
) {
  const onMessageRef = useRef(onMessage)
  const onErrorRef = useRef(onError)
  onMessageRef.current = onMessage
  onErrorRef.current = onError

  useEffect(() => {
    if (!credentials || !active) return

    let stopped = false
    let timer: ReturnType<typeof setTimeout>

    async function tick() {
      if (stopped || !credentials) return
      let delay = 4000
      try {
        const n = await receiveNotification(credentials)
        if (n) {
          delay = 500
          const { body } = n
          if (body?.typeWebhook === 'incomingMessageReceived') {
            const md = body.messageData
            const text =
              md?.textMessageData?.textMessage ??
              md?.extendedTextMessageData?.text ??
              ''
            if (text) {
              onMessageRef.current({
                id: body.idMessage ?? `in-${n.receiptId}`,
                direction: 'in',
                text,
                timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
              })
            }
          }
          // подтверждаем любое уведомление, иначе очередь не двигается
          await deleteNotification(credentials, n.receiptId)
        }
      } catch (e) {
        onErrorRef.current?.(e)
      } finally {
        if (!stopped) timer = setTimeout(tick, delay)
      }
    }

    tick()
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [credentials, active])
}
