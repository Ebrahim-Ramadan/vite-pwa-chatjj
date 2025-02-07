"use client"

import { useState, useRef, lazy } from "react"
import { DeepseekModelSelector } from "./DeepseekModelSelector"
const LoadingDots = lazy(() => import("./ui/LoadingComponent"))

interface MessageInputProps {
  onSendMessage: (content: string, model: string) => void
  isDisabled?: boolean
}

export default function MessageInput({ onSendMessage, isDisabled }: MessageInputProps) {
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState("1.5") // Default model
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim() && !isDisabled) {
      onSendMessage(input.trim(), selectedModel)
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 260) + "px"
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 relative">
      <div className="flex flex-col">
        <div className="flex bg-neutral-800 rounded-xl py-2">
          <textarea
            autoFocus
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 text-white px-4 py-2 outline-none disabled:opacity-50 resize-none overflow-y-auto max-h-[260px]"
            placeholder="Message Me"
            style={{ minHeight: "40px" }}
          />
          {isDisabled ? (
            <LoadingDots />
          ) : (
            <button
              type="submit"
              disabled={isDisabled || !input.trim()}
              className="p-2 disabled:text-neutral-400 text-neutral-100 transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center mt-2">
          <DeepseekModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isDisabled} />
        </div>
      </div>
    </form>
  )
}

