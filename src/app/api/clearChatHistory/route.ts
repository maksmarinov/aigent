import { NextResponse } from "next/server";
import { clearChatHistory } from "@/app/aiutils";

export async function POST(request: Request) {
  try {
    await clearChatHistory();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clear messages:", error);
    return NextResponse.json(
      { error: "Failed to clear messages" },
      { status: 500 }
    );
  }
}
