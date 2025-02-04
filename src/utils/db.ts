import { openDB, type DBSchema } from "idb"
import type { Chat, Message } from "../types"

interface MyDB extends DBSchema {
  chats: {
    key: string
    value: Chat
  }
  messages: {
    key: string
    value: Message
    indexes: { "by-chat": string }
  }
}

const dbPromise = openDB<MyDB>("ai-chat-app", 1, {
  upgrade(db) {
    db.createObjectStore("chats", { keyPath: "id" })
    const messageStore = db.createObjectStore("messages", { keyPath: "id" })
    messageStore.createIndex("by-chat", "chatId")
  },
})

export async function getAllChats(): Promise<Chat[]> {
  const db = await dbPromise
  return db.getAll("chats")
}

export async function getChatById(id: string): Promise<Chat | undefined> {
  const db = await dbPromise
  return db.get("chats", id)
}

export async function createChat(): Promise<Chat> {
  const db = await dbPromise
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New Chat",
    createdAt: new Date(),
  }
  await db.add("chats", newChat)
  return newChat
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const db = await dbPromise
  const index = db.transaction("messages").store.index("by-chat")
  return index.getAll(chatId)
}

export async function addMessage(message: Message): Promise<void> {
  const db = await dbPromise
  await db.add("messages", message)
}

