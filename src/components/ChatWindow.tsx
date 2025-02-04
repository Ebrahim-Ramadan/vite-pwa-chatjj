import { useState, useEffect, useRef } from "react"
import type { Chat, Message } from "../types"
import { getMessages, addMessage, updateMessage } from "../utils/db"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import { streamChat } from "../utils/stream"

interface ChatWindowProps {
  chat: Chat | null
  ensureActiveChat: () => Promise<Chat>
}

export default function ChatWindow({ chat, ensureActiveChat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesRef = useRef<Message[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (chat) {
      loadMessages(chat.id)
    } else {
      setMessages([])
    }
  }, [chat])

  async function loadMessages(chatId: string) {
    const loadedMessages = await getMessages(chatId)
    setMessages(loadedMessages)
  }

  async function handleSendMessage(content: string) {
    if (isStreaming) return // Prevent multiple streams

    try {
      setIsStreaming(true)
      const activeChat = await ensureActiveChat()

      // Save user message
      const userMessage: Message = {
        id: Date.now().toString(),
        chatId: activeChat.id,
        role: "user",
        content,
        timestamp: new Date(),
      }
      await addMessage(userMessage)
      setMessages((prev) => [...prev, userMessage])

      // Create initial AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: activeChat.id,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }
      await addMessage(aiMessage)
      setMessages((prev) => [...prev, aiMessage])

      // Start streaming
      const finalContent = await streamChat(content, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, content: msg.content + chunk } : msg)),
        )
      })

      // Update the final message in the database
      const updatedMessage = { ...aiMessage, content: finalContent }
      await updateMessage(updatedMessage)

      // Ensure UI is in sync with the final content
      setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? updatedMessage : msg)))
    } catch (error) {
      console.error("Error in chat:", error)
      // Optionally show an error message to the user
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-800 w-full">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} isDisabled={isStreaming} />
    </div>
  )
}

