import type { ChatMessage } from '../types'

export type MessagesAction =
  | { type: 'add'; message: ChatMessage }
  | { type: 'clear' }

/**
 * Храним сообщения чата. Дедупликация по id важна для поллинга:
 * одно и то же входящее не должно попасть в ленту дважды.
 */
export function messagesReducer(
  state: ChatMessage[],
  action: MessagesAction,
): ChatMessage[] {
  switch (action.type) {
    case 'add':
      if (state.some((m) => m.id === action.message.id)) return state
      return [...state, action.message]
    case 'clear':
      return []
    default:
      return state
  }
}
