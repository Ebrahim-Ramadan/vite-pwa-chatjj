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

      }
      
      parts.push(
        <SyntaxHighlighter language={language || "text"} style={atomOneDark} key={offset}
        customStyle={{
          color: "rgb(212, 212, 212)",
          fontSize: "15px",
          textShadow: "none",
          fontFamily: `Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace`,
          direction: "ltr",
          textAlign: "left",
          whiteSpace: "pre-wrap", // Prevents overflow issues
          wordSpacing: "normal",
          wordBreak: "break-word", // Ensures long words wrap properly
          lineHeight: "1.5",
          tabSize: 4,
          hyphens: "none",
          padding: "1em",
          margin: "0.5em 0",
          overflow: "auto",
          background: "rgb(30, 30, 30)",
          maxWidth: "100%", // Prevents breaking container width
          borderRadius: "8px", // Adds slight rounding for aesthetics
        }}>
          {code.trim()}
        </SyntaxHighlighter>
      );
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));

    }

    return parts;
  }

  return (
    <div className="relative flex-1 overflow-y-auto p-4 mt-4 space-y-4" ref={containerRef}>
      {messages.length === 0 && (
        <div className="p-2 md:p-4 flex justify-center w-full flex-col items-center mt-36">
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
              message.role === "user" ? "bg-neutral-950" : "max-w-[80%] bg-neutral-900"
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
          className="absolute sticky bottom-0 left-1/2 -translate-x-1/2 p-2 bg-neutral-900 text-white rounded-full shadow-lg transition-opacity hover:bg-neutral-600"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default MessageList;