import { describe, expect, it } from 'vitest'
import { messagesReducer } from '../src/store/messagesReducer'
import type { ChatMessage } from '../src/types'

const msg = (id: string): ChatMessage => ({
  id,
  direction: 'in',
  text: 'hello',
  timestamp: 0,
})

describe('messagesReducer', () => {
  it('добавляет сообщение', () => {
    const next = messagesReducer([], { type: 'add', message: msg('1') })
    expect(next).toHaveLength(1)
  })

  it('дедуплицирует по id (не добавляет дубль)', () => {
    const state = [msg('1')]
    const next = messagesReducer(state, { type: 'add', message: msg('1') })
    expect(next).toBe(state) // та же ссылка — ре-рендера не будет
  })

  it('добавляет сообщения с разными id', () => {
    const next = messagesReducer([msg('1')], { type: 'add', message: msg('2') })
    expect(next.map((m) => m.id)).toEqual(['1', '2'])
  })

  it('очищает ленту', () => {
    expect(messagesReducer([msg('1')], { type: 'clear' })).toEqual([])
  })
})
