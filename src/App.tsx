import { useCallback, useReducer, useState } from 'react'
import type { ChatMessage, Credentials } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useIncomingMessages } from './hooks/useIncomingMessages'
import { messagesReducer } from './store/messagesReducer'
import { sendMessage } from './api/greenApi'
import { isValidPhone, phoneToChatId } from './utils/phone'
import { CredentialsForm } from './components/CredentialsForm'
import { MessageList } from './components/MessageList'
import { MessageInput } from './components/MessageInput'

export default function App() {
  const [credentials, setCredentials] = useLocalStorage<Credentials | null>(
    'greenapi:credentials',
    null,
  )
  const [messages, dispatch] = useReducer(messagesReducer, [])
  const [recipient, setRecipient] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onIncoming = useCallback(
    (m: ChatMessage) => dispatch({ type: 'add', message: m }),
    [],
  )
  const onError = useCallback((e: unknown) => {
    setError(e instanceof Error ? e.message : 'Ошибка связи с GREEN-API')
  }, [])

  // поллинг запускается, как только введены credentials
  useIncomingMessages(credentials, onIncoming, onError)

  async function handleSend(text: string) {
    if (!credentials) return
    if (!isValidPhone(recipient)) {
      setError('Введите корректный номер получателя')
      return
    }
    setError(null)

    // оптимистично показываем своё сообщение сразу
    dispatch({
      type: 'add',
      message: { id: crypto.randomUUID(), direction: 'out', text, timestamp: Date.now() },
    })

    try {
      await sendMessage(credentials, phoneToChatId(recipient), text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить сообщение')
    }
  }

  function handleLogout() {
    setCredentials(null)
    dispatch({ type: 'clear' })
    setRecipient('')
    setError(null)
  }

  if (!credentials) {
    return <CredentialsForm onSubmit={setCredentials} />
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <strong>WhatsApp · GREEN-API</strong>
          <div className="app__sub">Instance {credentials.idInstance}</div>
        </div>
        <button className="link" onClick={handleLogout}>
          Сменить аккаунт
        </button>
      </header>

      <div className="app__recipient">
        <label htmlFor="to">Получатель (номер телефона)</label>
        <input
          id="to"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="например, 79991234567"
          inputMode="tel"
        />
      </div>

      <MessageList messages={messages} />

      {error && <div className="app__error">{error}</div>}

      <MessageInput disabled={!isValidPhone(recipient)} onSend={handleSend} />
    </div>
  )
}
