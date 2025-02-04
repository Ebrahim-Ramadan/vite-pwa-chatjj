// @ts-ignore
import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Message } from "../types";
// @ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter";
// @ts-ignore
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ArrowDown, Copy } from "lucide-react";
import { copyToClipboard } from "../lib/utils";
import { toast } from "sonner";

const UnlimitedMessages = lazy(() => import("./UnlimitedUsage"));

interface MessageListProps {
  messages: Message[];
}

function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLButtonElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const controller = new AbortController();
  //   const { signal } = controller;

  //   const handleScroll = () => {
  //     if (!container) return;

  //     const isAtBottom =
  //       container.scrollHeight - container.scrollTop <=
  //       container.clientHeight + 10;

  //     setShowScrollButton(!isAtBottom);
  //   };

  //   container.addEventListener("scroll", handleScroll, {
  //     passive: true,
  //     signal,
  //   });

  //   return () => controller.abort();
  // }, []);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const isAtBottom =
  //     container.scrollHeight - container.scrollTop <=
  //     container.clientHeight + 50;

  //   if (isAtBottom) {
  //     latestRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function formatMessage(content: string) {
    // Helper: convert newlines to <br /> elements.
    const renderWithNewLines = (text: string) =>
      text.split("\n").flatMap((line, index, array) =>
        index < array.length - 1 ? [line, <br key={index} />] : [line]
      );

    // First, process <think> sections.
    const thinkParts = content.split(/<think>|<\/think>/);
    const parts: JSX.Element[] = [];

    thinkParts.forEach((part, index) => {
      if (part.trim().length === 0) return;
      const processed = processTextPart(part, renderWithNewLines);

      // For thinking parts (odd-indexed), add distinct styling.
      if (index % 2 === 1) {
        parts.push(
          <div key={`think-${index}`} className="text-sm font-medium py-2">
            {processed}
          </div>
        );
      } else {
        parts.push(<div key={`text-${index}`}>{processed}</div>);
      }
    });

    // Process code blocks.
    const finalParts: JSX.Element[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;

    content.replace(
      codeBlockRegex,
      (match, language, code, offset) => {
        if (offset > lastIndex) {
          const precedingText = content.slice(lastIndex, offset);
          finalParts.push(
            <span key={`text-${lastIndex}`}>
              {renderWithNewLines(precedingText)}
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
              className="absolute top-1 right-1 bg-neutral-800 p-1 rounded opacity-70
                hover:opacity-100"
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

    if (lastIndex < content.length) {
      finalParts.push(
        <span key={`text-${lastIndex}`}>
          {renderWithNewLines(content.slice(lastIndex))}
        </span>
      );
    }

    // If any code blocks were found, return those. Otherwise, return the processed parts.
    if (finalParts.length > 0) {
      return <>{finalParts}</>;
    }
    return <>{parts}</>;
  }

  // Helper function: process text parts for headers, numbered lists, and bold text.
  function processTextPart(
    text: string,
    renderWithNewLines: (text: string) => (string | JSX.Element)[]
  ) {
    const regex =
      /(###\s+)|(\d+\.\s+)|(\*\*[^*]+\*\*)|([^#\d*]+)/gi;

    const matches = [...text.matchAll(regex)];
    const result: JSX.Element[] = [];

    for (let i = 0; i < matches.length; i++) {
      const [, headerToken, numberedToken, boldToken, normalToken] =
        matches[i];

      if (headerToken) {
        let headerContent = "";
        if (i + 1 < matches.length && matches[i + 1][2]) {
          headerContent += matches[i + 1][2];
          i++;
        }
        if (i + 1 < matches.length && matches[i + 1][3]) {
          headerContent +=
            matches[i + 1][3].substring(2, matches[i + 1][3].length - 2);
          i++;
        }
        if (i + 1 < matches.length && matches[i + 1][4]) {
          headerContent += matches[i + 1][4];
          i++;
        }
        result.push(
          <h3
            key={`header-${i}`}
            className="text-xl font-semibold text-neutral-100 py-2 mt-2"
          >
            {renderWithNewLines(headerContent.trim())}
          </h3>
        );
        continue;
      }

      if (numberedToken) {
        let content = numberedToken;
        if (i + 1 < matches.length && matches[i + 1][3]) {
          content += (
            <span
              key={`bold-${i}`}
              className="font-bold text-neutral-100 inline-block py-1"
            >
              {renderWithNewLines(
                matches[i + 1][3].substring(2, matches[i + 1][3].length - 2)
              )}
            </span>
          ) as any;
          i++;
        }
        if (i + 1 < matches.length && matches[i + 1][4]) {
          content += matches[i + 1][4];
          i++;
        }
        result.push(
          <span key={`numbered-${i}`} className="text-neutral-200 inline-block">
            {content}
          </span>
        );
        continue;
      }

      if (boldToken) {
        result.push(
          <span
            key={`bold-${i}`}
            className="font-bold text-neutral-100 inline-block py-1"
          >
            {renderWithNewLines(boldToken.substring(2, boldToken.length - 2))}
          </span>
        );
        continue;
      }

      if (normalToken) {
        result.push(
          <span key={`text-${i}`} className="text-neutral-200">
            {renderWithNewLines(normalToken)}
          </span>
        );
        continue;
      }
    }

    return result;
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
        // Extract plain text to copy the full message (without markdown)
        const plainText = message.content
          .replace(/```(\w+)?\n([\s\S]*?)```/g, "$2")
          .replace(/<think>|<\/think>/g, "")
          .replace(/\*\*(.*?)\*\*/g, "$1");
        return (
          <div
            key={message.id}
            className={`flex  p-2 ${
              message.role === "user" ? "justify-end" : "border-b-2 border-neutral-700 relative mb-12 justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                message.role === "user"
                  && "bg-neutral-900"
              }`}
            >
              
              {formatMessage(message.content)}
            </div>
            {/* Copy whole response button */}
            <button
                className={` 
                  ${message.role !== "user" ? "flex flex-row items-center gap-2 absolute -bottom-16 left-1 bg-neutral-800 p-2 rounded-lg opacity-80 hover:opacity-100" : "invisible"}
                  `}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(plainText.trim());
                  toast.success("Response copied!");
                }}
              >
                <Copy size={16} />
                Copy Response
              </button>
          </div>
        );
      })}
      {/* <div ref={latestRef} className="h-0 hidden" /> */}
      {/* <button
 ref={latestRef} 
          onClick={scrollToLatest}
          className={`absolute sticky bottom-0 left-1/2 -translate-x-1/2 p-2 bg-neutral-900 text-white rounded-full shadow-lg transition-opacity hover:bg-neutral-600 ${showScrollButton? "":"hidden"}`}
        >
          <ArrowDown className="w-4 h-4" />
        </button> */}
    </div>
  );
}

export default MessageList;
