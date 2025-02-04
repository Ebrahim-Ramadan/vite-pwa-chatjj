import type { Message } from "../types"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  function formatMessage(content: string) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0

    content.replace(codeBlockRegex, (match, language, code, offset) => {
      if (offset > lastIndex) {
        parts.push(content.slice(lastIndex, offset))
      }
      parts.push(
        <SyntaxHighlighter language={language || "text"} style={atomOneDark}>
          {code.trim()}
        </SyntaxHighlighter>,
      )
      lastIndex = offset + match.length
      return match
    })

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
    }

    return parts
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`${message.role === "user" ? "text-right" : "text-left"}`}>
          <div className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-600" : "bg-gray-700"}`}>
            {formatMessage(message.content)}
          </div>
        </div>
      ))}
    </div>
  )
}

