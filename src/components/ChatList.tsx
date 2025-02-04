import { Chat } from '../types'
import { Link } from 'react-router-dom'

interface ChatListProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onNewChat: () => void
}

export default function ChatList({ chats, activeChat, onSelectChat, onNewChat }: ChatListProps) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        onClick={onNewChat}
      >
        New Chat
      </button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <Link
              to={`/chat/${chat.id}`}
              className={`block py-2 px-4 ${
                activeChat?.id === chat.id ? 'bg-gray-700' : 'hover:bg-gray-700'
              } transition-colors`}
              onClick={() => onSelectChat(chat)}
            >
              {chat.title || 'Untitled Chat'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
