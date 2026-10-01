export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export type Direction = 'in' | 'out'

export interface ChatMessage {
  id: string
  direction: Direction
  text: string
  timestamp: number
}
