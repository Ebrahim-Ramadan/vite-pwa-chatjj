export interface Chat {
  id: string
  title: string
  createdAt: Date
}

export interface Message {
  id: string
  chatId: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

