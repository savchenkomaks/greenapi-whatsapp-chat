import { useState } from 'react'

export function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void
  disabled?: boolean
}) {
  const [text, setText] = useState('')

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <div className="composer">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder={disabled ? 'Укажите номер получателя выше' : 'Введите сообщение…'}
        disabled={disabled}
      />
      <button onClick={submit} disabled={disabled || text.trim() === ''} aria-label="Отправить">
        ➤
      </button>
    </div>
  )
}
