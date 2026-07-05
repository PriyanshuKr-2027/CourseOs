import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "mnmv54o3xeo4";
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiSecret) {
    return NextResponse.json({
      token: "",
      warning: "STREAM_API_SECRET environment variable is not configured. Falling back to development devToken client-side."
    });
  }

  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken(userId);
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
