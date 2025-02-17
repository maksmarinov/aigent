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

  // Helper to normalize the content to a string.
  const normalizeContent = (content: string | any[]): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      // Assume each array element contains a `content` property or is a string.
      return content
        .map((part) => (typeof part === "string" ? part : part.content || ""))
        .join("");
    }
    return "";
  };

  // On mount, load persisted messages from chatHistory.json.
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

    // Update state with user message.
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Persist the user message.
    await addMessages([userPlainMessage]);

    // Retrieve full conversation memory.
    const memory = await getMessages();

    const conversationHistory: AIMessage[] = [...memory, userPlainMessage];

    // Pass the full conversation history to askChat.
    const aiResponseText =
      (await askChat({ messages: conversationHistory })) ?? "";

    const botPlainMessage: AIMessage = {
      role: "assistant",
      content: aiResponseText,
    };

    // Persist bot message.
    await addMessages([botPlainMessage]);

    // Update state with bot response.
    setMessages((prev) => [...prev, { sender: "bot", text: aiResponseText }]);
  };

  // Function to start a new chat.
  const handleStartNewChat = async () => {
    // Clear the persisted chat history.
    await clearChatHistory();
    // Clear local state.
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
