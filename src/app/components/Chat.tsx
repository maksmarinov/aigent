"use client";

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
  // Custom renderer for code blocks
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
  return (
    <div className="w-[600px] max-h-[800px] overflow-auto bg-gray-700 p-4 rounded-t-md">
      {messages.map((msg, index) => {
        // If the sender is 'user', show "YOU", otherwise show "ASSISTANT"
        const displaySender = msg.sender === "user" ? "YOU" : "ASSISTANT";
        const isUser = msg.sender === "user";
        const containerClasses = isUser
          ? "border-2 border-gray-950 bg-gray-900 text-right"
          : "border-2 border-gray-950 bg-gray-900 text-left";

        const content =
          msg.sender !== "user" ? (
            // Render markdown with custom code block rendering.
            <div className="whitespace-pre-line">
              <ReactMarkdown components={markdownComponents}>
                {msg.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-line">{msg.text}</div>
          );

        return (
          <div
            key={index}
            className={`mb-4 p-4 rounded-md ${containerClasses}`}
          >
            <strong>{displaySender}:</strong>
            <div>{content}</div>
          </div>
        );
      })}
      {isLoading && (
        <div className="mb-4 p-4 rounded-md border border-gray-500 bg-gray-100 text-left animate-pulse">
          <strong>ASSISTANT:</strong>
          <div>Generating response ...</div>
        </div>
      )}
    </div>
  );
};
