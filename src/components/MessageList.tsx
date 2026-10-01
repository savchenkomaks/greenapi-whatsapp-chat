import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types'

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  // автоскролл вниз при новом сообщении
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="messages">
      {messages.length === 0 && (
        <div className="messages__empty">Сообщений пока нет — отправьте первое.</div>
      )}
      {messages.map((m) => (
        <div key={m.id} className={`bubble bubble--${m.direction}`}>
          <span className="bubble__text">{m.text}</span>
          <span className="bubble__time">{formatTime(m.timestamp)}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
