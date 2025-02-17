"use client";
import { useState, useEffect } from "react";
import { UserInput } from "./components/UserInput";
import { Chat } from "./components/Chat";
import { askChat, addMessages, getMessages, clearChatHistory } from "./aiutils";
import { AIMessage } from "./types";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const normalizeContent = (content: string | any[]): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => (typeof part === "string" ? part : part.content || ""))
        .join("");
    }
    return "";
  };

  useEffect(() => {
    (async () => {
      const persisted = await getMessages();
      const chatMessages: ChatMessage[] = persisted.map((msg: AIMessage) => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: normalizeContent(msg.content ?? "") || "",
      }));
      setMessages(chatMessages);
    })();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    const userPlainMessage: AIMessage = { role: "user", content: userMessage };

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    await addMessages([userPlainMessage]);

    const memory = await getMessages();

    const conversationHistory: AIMessage[] = [...memory, userPlainMessage];

    const aiResponseText =
      (await askChat({ messages: conversationHistory })) ?? "";

    const botPlainMessage: AIMessage = {
      role: "assistant",
      content: aiResponseText,
    };

    await addMessages([botPlainMessage]);

    setMessages((prev) => [...prev, { sender: "bot", text: aiResponseText }]);
  };

  const handleStartNewChat = async () => {
    await clearChatHistory();

    setMessages([]);
  };

  return (
    <div className="flex flex-col justify-items-center min-h-screen p-1 pb-2 gap-1 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>MXMR</main>
      <Chat messages={messages} />
      <UserInput onSend={handleSendMessage} />
      <div className="flex gap-2">
        <button onClick={handleStartNewChat} className="px-4 py-2 rounded-md">
          New Chat
        </button>
      </div>
    </div>
  );
}
