import { NextResponse } from "next/server";
import { addMessages } from "@/app/aiutils";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    await addMessages(messages);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error();
  }
}
