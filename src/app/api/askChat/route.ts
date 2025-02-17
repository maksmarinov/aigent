import { NextResponse } from "next/server";
import { askChat } from "@/app/aiutils";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const content = await askChat({ messages });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.error();
  }
}
