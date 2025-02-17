"use client";

interface ChatMessage {
  sender: string;
  text: string;
}

interface ChatProps {
  messages: ChatMessage[];
}

export const Chat = ({ messages }: ChatProps) => {
  return (
    <div className="w-[600px] h-[500px] overflow-auto bg-gray-700 p-4">
      {messages.map((msg, index) => {
        // Provide a default sender if missing.
        const sender = msg.sender ?? "unknown";
        return (
          <div
            key={index}
            className={`mb-2 ${sender === "user" ? "text-right" : "text-left"}`}
          >
            <strong>{sender.toUpperCase()}: </strong>
            <span>{msg.text}</span>
          </div>
        );
      })}
    </div>
  );
};
