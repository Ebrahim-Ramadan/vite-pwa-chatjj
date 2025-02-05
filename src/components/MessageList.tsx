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

// Removes <think> blocks along with any surrounding whitespace so that no orphaned <br>s remain.
const removeThinkSections = (text: string) =>
  text.replace(/\s*<think>[\s\S]*?<\/think>\s*/g, "");

function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLButtonElement>(null);
  // @ts-ignore
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to latest in case you want that functionality later.
  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper to transform newlines into <br /> elements.
  const renderWithNewLines = (text: string) =>
    text.split("\n").flatMap((line, index, array) => {
      // Skip empty lines so that stray <br>s aren't added.
      if (line.trim() === "" && index < array.length - 1) return [];
      return index < array.length - 1 ? [line, <br key={index} />] : [line];
    });

  // Helper to process bold markdown. It replaces **...** with <strong>
  const renderBold = (text: string) => {
    // Split the text by the bold tokens.
    // The regex splits into parts while keeping the content between ** **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  // Formats the message content for display.
  function formatMessage(content: string) {
    // Remove <think> sections and extra surround white space/newlines.
    const cleanedContent = removeThinkSections(content);

    // Process code blocks separately.
    const finalParts: JSX.Element[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;

    cleanedContent.replace(
      codeBlockRegex,
      (match, language, code, offset) => {
        if (offset > lastIndex) {
          const precedingText = cleanedContent.slice(
            lastIndex,
            offset
          );
          finalParts.push(
            <span key={`text-${lastIndex}`}>
              {renderBoldWithNewLines(precedingText)}
            </span>
          );
        }

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

    if (lastIndex < cleanedContent.length) {
      finalParts.push(
        <span key={`text-${lastIndex}`}>
          {renderBoldWithNewLines(cleanedContent.slice(lastIndex))}
        </span>
      );
    }

    return <>{finalParts.length > 0 ? finalParts : renderBoldWithNewLines(cleanedContent)}</>;
  }

  // Combines the newline splitting with bold processing.
  const renderBoldWithNewLines = (text: string) => {
    // First, split by newline and then for each line, apply bold formatting.
    return renderWithNewLines(text).map((part, i) => {
      if (typeof part === "string") {
        return <React.Fragment key={i}>{renderBold(part)}</React.Fragment>;
      }
      return part;
    });
  };

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
        // Extract plain text for copy-to-clipboard, removing markdown and <think> sections.
        const plainText = removeThinkSections(message.content)
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
                message.role === "user" && "bg-neutral-900"
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
