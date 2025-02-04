import type { Chat } from "../types"
import { Link } from "react-router-dom"

interface ChatListProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onNewChat: () => void
}

export default function ChatList({ chats, activeChat, onSelectChat, onNewChat }: ChatListProps) {
  return (
    <div className="w-64 bg-white border-r">
      <button className="w-full py-2 px-4 bg-blue-500 text-white font-semibold" onClick={onNewChat}>
        New Chat
      </button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/chat/${chat.id}`}
              className={`block py-2 px-4 ${activeChat?.id === chat.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => onSelectChat(chat)}
            >
              {chat.title || "Untitled Chat"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

