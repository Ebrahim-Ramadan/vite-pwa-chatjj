// @ts-ignore
import React, { lazy, Suspense, useRef, useState } from "react";
import type { Message } from "../types";

// @ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter";
// @ts-ignore
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Copy } from "lucide-react";
import { copyToClipboard } from "../lib/utils";
import { toast } from "sonner";

const UnlimitedMessages = lazy(() => import("./UnlimitedUsage"));

interface MessageListProps {
  messages: Message[];
}

/**
 * Splits text by two or more newlines and wraps each paragraph in a <p> tag.
 */
const renderMarkdown = (text: string) => {
  // Split by two or more newlines
  const paragraphs = text.split(/\n{2,}/g);
  return paragraphs.map((para, index) => (
    <p key={index}>
      {renderBold(para)}
    </p>
  ));
};

/**
 * Processes markdown for bold text.
 * Replaces **text** with <strong>text</strong>.
 */
const renderBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      // For inline newlines within a paragraph, we replace a single newline with a <br />
      // so that if someone uses a single newline, it still renders as a line break.
      part.split("\n").flatMap((line, j, arr) =>
        j < arr.length - 1 ? [line, <br key={j} />] : [line]
      )
    )
  );
};

function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLButtonElement>(null);

  // @ts-ignore
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to latest in case you want that functionality later.
  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Formats the message content for display.
  function formatMessage(content: string) {
    const finalParts: JSX.Element[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;

    content.replace(
      codeBlockRegex,
      (match, language, code, offset) => {
        // Add text preceding the block, rendering markdown.
        if (offset > lastIndex) {
          const precedingText = content.slice(lastIndex, offset);
          finalParts.push(
            <span key={`text-${lastIndex}`}>
              {renderMarkdown(precedingText)}
            </span>
          );
        }

        // Render the code block with SyntaxHighlighter.
        finalParts.push(
          <div key={offset} className="relative">
            <SyntaxHighlighter
              language={language || "text"}
              style={atomOneDark}
              customStyle={{
                color: "rgb(212, 212, 212)",
                fontSize: "15px",
                textShadow: "none",
                fontFamily: `Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace`,
                direction: "ltr",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                wordSpacing: "normal",
                wordBreak: "break-word",
                lineHeight: "1.5",
                tabSize: 4,
                hyphens: "none",
                padding: "1em",
                margin: "0.5em 0",
                overflow: "auto",
                background: "rgb(30, 30, 30)",
                maxWidth: "100%",
                borderRadius: "8px",
              }}
            >
              {code.trim()}
            </SyntaxHighlighter>
            <button
              className="absolute top-1 right-1 bg-neutral-800 p-2 rounded-lg opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(code.trim());
                toast.success("Code copied!");
              }}
            >
              <Copy size={16} className="text-white" />
            </button>
          </div>
        );

        lastIndex = offset + match.length;
        return match;
      }
    );

    // Handle <think> sections and remaining text.
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      const thinkParts = remainingText.split(
        /(<think>[\s\S]*?<\/think>)/g
      );

      thinkParts.forEach((part, index) => {
        if (part.startsWith("<think>") && part.endsWith("</think>")) {
          // Replace <think> and </think> tags with "Thinking..." and "Done thinking"
          const thinkContent = part.slice(7, -8); // Remove <think> and </think> tags
          finalParts.push(
            <span key={`thinking-${index}`} className="text-neutral-400">
              Thoughts
            </span>
          );
          finalParts.push(
            <div
              key={`think-${index}`}
              className="bg-neutral-900 opacity-70 p-2 rounded-md mt-0 mb-2"
            >
              {renderMarkdown(thinkContent)}
            </div>
          );
          finalParts.push(
            <span key={`done-thinking-${index}`} className="text-neutral-400">
              Done thinking
            </span>
          );
        } else if (part.trim() !== "") {
          // Render the rest of the text as markdown.
          finalParts.push(
            <span key={`text-${lastIndex + index}`}>
              {renderMarkdown(part)}
            </span>
          );
        }
      });
    }

    return <>{finalParts}</>;
  }

  return (
    <div
      className="relative flex-1 overflow-y-auto p-4 pb-20 pt-8 space-y-4"
      ref={containerRef}
    >
      {messages.length === 0 && (
        <div className="p-2 md:p-6 flex justify-center w-full flex-col items-center mt-36">
          <Suspense fallback={<div>Loading...</div>}>
            <UnlimitedMessages />
          </Suspense>
        </div>
      )}

      {messages.map((message) => {
        // Extract plain text for copy-to-clipboard, removing markdown but keeping <think>
        // sections.
        const plainText = message.content
          .replace(/```(\w+)?\n([\s\S]*?)```/g, "$2")
          .replace(/\*\*([\s\S]*?)\*\*/g, "$1");

        return (
          <div
            key={message.id}
            className={`flex p-2 ${
              message.role === "user"
                ? "justify-end pt-6"
                : "relative mb-12 justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                message.role === "user" ? "bg-neutral-900" : ""
              }`}
            >
              {formatMessage(message.content)}
            </div>

            {/* Copy whole response button */}
            <button
              className={`${
                message.role !== "user"
                  ? "ml-4 flex flex-row items-center gap-2 absolute -bottom-8 left-1 bg-neutral-800 p-2 rounded-lg opacity-90 hover:opacity-100"
                  : "invisible"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(plainText.trim());
                toast.success("Response copied!");
              }}
            >
              <Copy size={16} />
            </button>
          </div>
        );
      })}

      {/*
      Uncomment below if scroll behavior is needed.
      <div ref={latestRef} className="h-0 hidden" />
      <button
        ref={latestRef}
        onClick={scrollToLatest}
        className={`absolute sticky bottom-0 left-1/2 -translate-x-1/2 p-2 bg-neutral-900 text-white rounded-full shadow-lg transition-opacity hover:bg-neutral-600 ${
          showScrollButton ? "" : "hidden"
        }`}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
      */}
    </div>
  );
}

export default MessageList;
