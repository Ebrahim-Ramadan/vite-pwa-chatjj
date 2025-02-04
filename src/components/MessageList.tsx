// @ts-ignore
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Message } from "../types";
// @ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter";
// @ts-ignore
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ArrowDown } from "lucide-react";

const UnlimitedMessages = lazy(() => import("./UnlimitedUsage"));

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const controller = new AbortController();
    const { signal } = controller;
  
    const handleScroll = () => {
      if (!container) return;
  
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
  
      setShowScrollButton(!isAtBottom);
    };
  
    container.addEventListener("scroll", handleScroll, { passive: true, signal });
  
    return () => controller.abort();
  }, []);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

    if (isAtBottom) {
      latestRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function formatMessage(content: string) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;

    content.replace(codeBlockRegex, (match, language, code, offset) => {
      if (offset > lastIndex) {
        parts.push(content.slice(lastIndex, offset));
      console.log('SyntaxHighlighter', code.trim());

      }
      
      parts.push(
        <SyntaxHighlighter language={language || "text"} style={atomOneDark} key={offset}>
          {code.trim()}
        </SyntaxHighlighter>
      );
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
      console.log('not SyntaxHighlighter', content.trim());

    }

    return parts;
  }

  return (
    <div className="relative flex-1 overflow-y-auto p-4 mt-4 space-y-4" ref={containerRef}>
      {messages.length === 0 && (
        <div className="p-4 flex justify-center w-full flex-col items-center mt-36">
         <Suspense fallback={<div>Loading...</div>}>
            <UnlimitedMessages />
          </Suspense>
        </div>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={` p-2 rounded-lg ${
              message.role === "user" ? "bg-zinc-950" : "max-w-[80%] bg-zinc-900"
            }`}
          >
            {formatMessage(message.content)}
          </div>
        </div>
      ))}
      <div ref={latestRef} className="h-1" />

      {showScrollButton && (
        <button
          onClick={scrollToLatest}
          className="absolute sticky bottom-0 left-1/2 -translate-x-1/2 p-2 bg-zinc-900 text-white rounded-full shadow-lg transition-opacity hover:bg-zinc-600"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default MessageList;