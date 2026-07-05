import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "mnmv54a3xea4";
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiSecret) {
    return NextResponse.json({
      token: "",
      warning: "STREAM_API_SECRET environment variable is not configured. Falling back to development devToken client-side."
    });
  }

  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    
    // Register/Upsert the user in GetStream's database
    await serverClient.upsertUser({
      id: userId,
      name: userId === "admin" ? "System Administrator" : userId.split("-")[0]
    });

    // Ensure the admin user also exists in the database
    if (userId !== "admin") {
      await serverClient.upsertUser({
        id: "admin",
        name: "System Administrator"
      });
    }

    const token = serverClient.createToken(userId);
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
