"use client";
import { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { UserInput } from "./components/UserInput";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAwaitingBotResponse, setIsAwaitingBotResponse] = useState(false);

  // Load persisted messages.
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/getMessages");
      const data = await res.json();
      const chatMessages: ChatMessage[] = data.map((msg: any) => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: msg.content || "",
      }));
      setMessages(chatMessages);
    })();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    // Add local user message.
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsAwaitingBotResponse(true);

    // Persist user message.
    await fetch("/api/addMessages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    // Get conversation memory.
    const memRes = await fetch("/api/getMessages");
    const memory = await memRes.json();
    const conversationHistory = [
      ...memory,
      { role: "user", content: userMessage },
    ];

    // Ask AI agent.
    const response = await fetch("/api/askChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    });
    const { content: aiResponseText } = await response.json();

    // Persist bot response.
    await fetch("/api/addMessages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "assistant", content: aiResponseText }],
      }),
    });

    // Update local state with bot response.
    setMessages((prev) => [...prev, { sender: "bot", text: aiResponseText }]);
    setIsAwaitingBotResponse(false);
  };

  const handleStartNewChat = async () => {
    await fetch("/api/clearChatHistory", {
      method: "POST",
    });
    setMessages([]);
  };

  return (
    <div className="flex flex-col justify-items-center min-h-screen p-1 pb-2 gap-1 sm:p-20">
      <main>MXMR</main>
      <Chat messages={messages} isLoading={isAwaitingBotResponse} />
      <UserInput onSend={handleSendMessage} />
      <div className="flex gap-2">
        <button onClick={handleStartNewChat} className="px-4 py-2 rounded-md">
          New Chat
        </button>
      </div>
    </div>
  );
}
