import { useState, useEffect, useRef, useTransition } from "react"
import type { Chat, Message } from "../types"
import { getMessages, addMessage, updateMessage, updateChatName } from "../utils/db"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import { generateChatName, streamChat } from "../utils/stream"
import { FallBack } from "./ui/FallBack"

interface ChatWindowProps {
  chat: Chat | null
  ensureActiveChat: () => Promise<Chat>
  updateChatNameProp: (newName: string) => void // Add this prop
}

export default function ChatWindow({ chat, ensureActiveChat, updateChatNameProp }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string>("")
  // @ts-ignore
  const [isPending, startTransition] = useTransition()
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

  async function handleSendMessage(content: string, selectedModel:string) {
    if (isStreaming) return

    setError("")
    // @ts-ignore
    startTransition(async () => {
      try {
        setIsStreaming(true)
        const activeChat = await ensureActiveChat()

        const userMessage: Message = {
          id: Date.now().toString(),
          chatId: activeChat.id,
          role: "user",
          content,
          timestamp: new Date(),
        }
        await addMessage(userMessage)
        setMessages((prev) => [...prev, userMessage])

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: activeChat.id,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        }
        await addMessage(aiMessage)
        setMessages((prev) => [...prev, aiMessage])
        setIsStreaming(false)

        const finalContent = await streamChat(content, selectedModel, (chunk) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, content: msg.content + chunk } : msg))
          )
        })

        const updatedMessage = { ...aiMessage, content: finalContent }
        await updateMessage(updatedMessage)
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? updatedMessage : msg)))

        // Check if the chat has a name before generating a new one
        
        if (activeChat.title === "New Chat") {
          const newNameGenerated = await generateChatName({ chat: content });
          await updateChatName(activeChat.id, newNameGenerated.trim().length > 0 ? newNameGenerated : "New Chat");
          updateChatNameProp(newNameGenerated.trim().length > 0 ? newNameGenerated : "New Chat");
        }

      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "An unexpected error occurred"
        
        setError(errorMessage)
        
        // Optionally remove last two messages (user and AI)
        setMessages(prev => prev.slice(0, -2))
      } finally {
        setIsStreaming(false)
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto">
      {error && <FallBack message={error}/>}
      <MessageList messages={messages} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isDisabled={isStreaming} 
      />
    </div>
  )
}