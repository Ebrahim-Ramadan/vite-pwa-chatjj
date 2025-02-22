import { useState, useEffect, Suspense, lazy } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import ChatList from "./components/ChatList"
import ChatWindow from "./components/ChatWindow"
import { ConfirmDialog } from "./components/ConfirmDialog"
import type { Chat } from "./types"
import { getAllChats, createChat, getChatById, deleteChat, getMessages } from "./utils/db"
import { Menu } from "lucide-react"
import { toast } from "sonner"
// Lazy load QuickHintModal
const QuickHintModal = lazy(() => import("./components/QuickHintModal"));


export default function App() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isQuickHintOpen, setIsQuickHintOpen] = useState(false)

  const navigate = useNavigate()
  const { chatId } = useParams<{ chatId: string }>()
  const location = useLocation()

  useEffect(() => {
    loadChats()
    checkQuickHintStatus()
  }, [])

  useEffect(() => {
    if (chatId) {
      loadChat(chatId)
    } else if (location.pathname === "/") {
      setActiveChat(null)
    }
  }, [chatId, location.pathname])

  function checkQuickHintStatus() {
    const hasSeenQuickHint = localStorage.getItem('hasSeenQuickHint')
    console.log('hasSeenQuickHint', typeof hasSeenQuickHint)
    
    if (!hasSeenQuickHint) {
      setIsQuickHintOpen(true)
    }
  }
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
    if (activeChat) {
      const numberofMessages = await getMessages(activeChat.id)
      
      if (numberofMessages.length == 0) {
        navigate(`/chat/${activeChat.id}`)
        setIsSidebarOpen(false)
        return
      };
    }
    const newChat = await createChat()
    setChats([newChat, ...chats])
    navigate(`/chat/${newChat.id}`)
    setIsSidebarOpen(false)
   

  }

  async function handleDeleteChat(chatToDelete: Chat) {
    setChatToDelete(chatToDelete)
  }

  async function confirmDeleteChat() {
    if (chatToDelete) {
      await deleteChat(chatToDelete.id)
      setChats(chats.filter((chat) => chat.id !== chatToDelete.id))
      toast.success("Chat deleted")
      if (activeChat && activeChat.id === chatToDelete.id) {
        setActiveChat(null)
        navigate("/")
      }
      setChatToDelete(null)
    }
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

  const updateChatName = (newName: string) => {
    if (activeChat) {
      // Optionally, you can also update the chat in the chats array
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat.id ? { ...chat, title: newName } : chat
        )
      )
      // navigate(0)
    }
  }
  return (
    <div className="flex h-[100dvh] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-neutral-100 w-full">
      {isQuickHintOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <QuickHintModal
            isOpen={isQuickHintOpen}
            onOpenChange={setIsQuickHintOpen}
          />
        </Suspense>
      )}


       {/* Mobile menu button */}
       <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed left-4 top-4 z-50 bg-neutral-800 p-2 rounded-full"
      >
        <Menu className="w-5 h-5" />
      </button>
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onSelectChat={(chat) => navigate(`/chat/${chat.id}`)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(false)}
      />
      
      <ChatWindow 
      updateChatNameProp={updateChatName}
      chat={activeChat} ensureActiveChat={ensureActiveChat} />
      <ConfirmDialog
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={confirmDeleteChat}
        title="Delete Chat"
        description="Are you sure you want to delete this chat? This action cannot be undone."
      />
    </div>
  )
}

