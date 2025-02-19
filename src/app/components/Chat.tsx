"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import materialDark from "react-syntax-highlighter/dist/esm/styles/prism/material-dark";

interface ChatMessage {
  sender: string;
  text: string;
}

interface ChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        language={match[1]}
        style={materialDark}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export const Chat = ({ messages, isLoading = false }: ChatProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="w-full max-w-[600px] h-full max-h-[850px] overflow-auto  bg-black p-4 rounded-t-md"
    >
      {messages.map((msg, index) => {
        const displaySender = msg.sender === "user" ? "YOU" : "ASSISTANT";
        const isUser = msg.sender === "user";
        const containerClasses = isUser
          ? "border-0 border-b-2 text-white border-b-gray-800  bg-black text-right"
          : "border-0 border-b-2 text-white border-b-gray-800  bg-black text-left";

        const content =
          msg.sender !== "user" ? (
            <div className="whitespace-pre-line">
              <ReactMarkdown components={markdownComponents}>
                {msg.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-line text-white">{msg.text}</div>
          );

        return (
          <div
            key={index}
            className={`mb-4 p-4 rounded-md ${containerClasses}`}
          >
            <strong className="text-white">{displaySender}:</strong>
            <div className="text-white">{content}</div>
          </div>
        );
      })}
      {isLoading && (
        <div className="mb-4 p-4 text-black rounded-md border-2 border-gray-500 bg-gray-400 text-left animate-pulse">
          <strong>ASSISTANT:</strong>
          <div>Generating response ...</div>
        </div>
      )}
    </div>
  );
};
