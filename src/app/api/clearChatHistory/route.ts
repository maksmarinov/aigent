import { NextResponse } from "next/server";
import { clearChatHistory } from "@/app/aiutils";

export async function POST(request: Request) {
  try {
    await clearChatHistory();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error();
  }
}
