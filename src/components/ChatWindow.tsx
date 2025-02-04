import { useState, useEffect } from 'react'
import { Chat, Message } from '../types'
import { getMessages, addMessage } from '../utils/db'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { simulateStream } from '../utils/stream'

interface ChatWindowProps {
  chat: Chat | null
  ensureActiveChat: () => Promise<Chat>
}

export default function ChatWindow({ chat, ensureActiveChat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])

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
    const activeChat = await ensureActiveChat()

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: activeChat.id,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Optimistic update
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Simulate AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      chatId: activeChat.id,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prevMessages) => [...prevMessages, aiMessage])

    // Simulate streaming
    await simulateStream(aiMessage.id, (chunk) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessage.id
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      )
    })

    // Save messages to IndexedDB
    await addMessage(newMessage)
    await addMessage(aiMessage)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
