"use client";
import { useRef, MouseEvent } from "react";

interface UserInputProps {
  onSend: (message: string) => Promise<void>;
}

export const UserInput = ({ onSend }: UserInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!textAreaRef.current) return;
    const message = textAreaRef.current.value;
    if (message.trim() !== "") {
      textAreaRef.current.value = "";
      await onSend(message);
    }
  };

  return (
    <div className="relative flex h-[200px] w-[600px] rounded-b-lg">
      <textarea
        ref={textAreaRef}
        className="w-full h-full bg-slate-600 text-left pt-2 pl-2 focus:outline-none rounded-b-lg"
        name="userInput"
        id="userInput"
        style={{ lineHeight: "1.5", resize: "none" }}
      />
      <button
        onClick={handleSubmit}
        className="absolute right-3 top-[75%] h-[20%] px-4 bg-slate-700 rounded-md"
        type="submit"
      >
        Ask
      </button>
    </div>
  );
};
