import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import type { Chat } from "./types"
import { getAllChats, createChat, getChatById } from "./utils/db"

export default function App() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const navigate = useNavigate()
  const { chatId } = useParams<{ chatId: string }>()

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (chatId) {
      loadChat(chatId)
    } else {
      setActiveChat(null)
    }
  }, [chatId])

  async function loadChats() {
    const loadedChats = await getAllChats()
    setChats(loadedChats)
  }

  async function loadChat(id: string) {
    const chat = await getChatById(id)
    if (chat) {
      setActiveChat(chat)
    } else {
      navigate("/")
    }
  }

  async function handleNewChat() {
    const newChat = await createChat()
    setChats([newChat, ...chats])
    navigate(`/chat/${newChat.id}`)
  }

  async function ensureActiveChat() {
    if (!activeChat) {
      const newChat = await createChat()
      setChats([newChat, ...chats])
      setActiveChat(newChat)
      navigate(`/chat/${newChat.id}`)
      return newChat
    }
    return activeChat
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onSelectChat={(chat) => navigate(`/chat/${chat.id}`)}
        onNewChat={handleNewChat}
      />
      <ChatWindow chat={activeChat} ensureActiveChat={ensureActiveChat} />
    </div>
  )
}

