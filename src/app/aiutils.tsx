"use server";
import { AIMessage } from "./types";
import { JSONFilePreset } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
const openai = new OpenAI();

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};
type Data = {
  messages: MessageWithMetadata[];
};
const defaultData: Data = { messages: [] };

export const addMetadata = async (message: AIMessage) => {
  return {
    ...message,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
};

export const removeMetadata = async (message: MessageWithMetadata) => {
  const { id, createdAt, ...rest } = message;
  return rest;
};
export const getDb = async () => {
  const db = await JSONFilePreset<Data>("chatHistory.json", defaultData);
  return db;
};

export const addMessages = async (messages: AIMessage[]) => {
  const db = await getDb();
  const messagesWithMetadata = await Promise.all(
    messages.map((message) => addMetadata(message))
  );
  db.data.messages.push(...messagesWithMetadata);
  await db.write();
};
export const getMessages = async () => {
  const db = await getDb();
  return Promise.all(db.data.messages.map(removeMetadata));
};
export const askChat = async ({ messages }: { messages: AIMessage[] }) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages,
  });

  return completion.choices[0].message.content;
};

export const clearChatHistory = async () => {
  const db = await getDb();
  // Reset messages to default empty state.
  db.data.messages = [];
  await db.write();
};
