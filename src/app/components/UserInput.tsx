"use client";
import { useRef, MouseEvent, KeyboardEvent } from "react";

interface UserInputProps {
  onSend: (message: string) => Promise<void>;
}

export const UserInput = ({ onSend }: UserInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (!textAreaRef.current) return;
    const message = textAreaRef.current.value;
    if (message.trim() !== "") {
      textAreaRef.current.value = "";
      await onSend(message);
    }
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div className="relative flex h-[200px] w-full max-w-[600px] rounded-b-lg">
      <textarea
        autoFocus
        ref={textAreaRef}
        onKeyDown={handleKeyDown}
        className="w-full h-full text-left pt-2 pl-2 focus:outline-none rounded-b-lg  bg-black border-2 border-gray-900"
        name="userInput"
        id="userInput"
        style={{ lineHeight: "1.5", resize: "none" }}
      />
      <button
        onClick={handleSubmit}
        className="absolute right-3 top-[65%] h-[27%] px-4  rounded-md flex flex-col items-center  bg-black border-t-2 border-gray-900"
        type="submit"
      >
        <span>Ask</span>
        <span className="text-xs">(ctrl+ent)</span>
      </button>
    </div>
  );
};
