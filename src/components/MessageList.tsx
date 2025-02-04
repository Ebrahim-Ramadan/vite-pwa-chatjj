import type { Message } from "../types"

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className={`p-2 rounded ${message.role === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
          <span className="font-bold">{message.role}:</span> {message.content}
        </div>
      ))}
    </div>
  )
}

