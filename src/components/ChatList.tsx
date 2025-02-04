import type { Chat } from "../types"
import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"

interface ChatListProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onNewChat: () => void
  onDeleteChat: (chat: Chat) => void
}

export default function ChatList({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat }: ChatListProps) {
  return (
    <div className="w-64 bg-neutral-800 border-r border-neutral-700">
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        onClick={onNewChat}
      >
        New Chat
      </button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="relative group">
            <Link
              to={`/chat/${chat.id}`}
              className={`block py-2 px-4 pr-10 ${
                activeChat?.id === chat.id ? "bg-neutral-700" : "hover:bg-neutral-700"
              } transition-colors`}
              onClick={() => onSelectChat(chat)}
            >
              {chat.title || "Untitled Chat"}
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDeleteChat(chat)
              }}
              className="p-2 absolute text-neutral-400 hover:text-red-500 right-2 top-1/2 transform -translate-y-1/2 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity"
              title="Delete chat"
            >
              <Trash2 className="w-4 h-4 " />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

