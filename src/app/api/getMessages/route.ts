import { NextResponse } from "next/server";
import { getMessages } from "@/app/aiutils";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.error();
  }
}
