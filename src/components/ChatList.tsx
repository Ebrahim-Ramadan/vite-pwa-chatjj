// ChatList.tsx
import type { Chat } from "../types"
import { Link } from "react-router-dom"
import { Trash2,  X } from "lucide-react"
import { ZapIcon } from "./UnlimitedUsage"

interface ChatListProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onNewChat: () => void
  onDeleteChat: (chat: Chat) => void
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function ChatList({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  isSidebarOpen,
  onToggleSidebar
}: ChatListProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#000000e8] bg-opacity-50 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-zinc-900 border-r border-neutral-700
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <ZapIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">chatjj</h3>
              <p className="text-xs text-zinc-400">For Everyone</p>
            </div>
          </div>
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="m-4 py-2 px-4 bg-neutral-700 hover:bg-neutral-600 
            rounded-lg transition-colors text-center"
        >
          New Chat
        </button>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id} className="relative group">
                <Link
                  to={`/chat/${chat.id}`}
                  className={`block py-2 px-4 pr-10 ${
                    activeChat?.id === chat.id ? "bg-neutral-700" : "hover:bg-neutral-700"
                  } transition-colors truncate`}
                  onClick={() => {
                    onSelectChat(chat)
                    if (window.innerWidth < 1024) {
                      onToggleSidebar()
                    }
                  }}
                >
                  {chat.title || "Untitled Chat"}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDeleteChat(chat)
                  }}
                  className="p-2 absolute right-2 top-1/2 transform -translate-y-1/2 duration-200 
                    opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-opacity
                    text-red-500"
                  title="Delete chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}