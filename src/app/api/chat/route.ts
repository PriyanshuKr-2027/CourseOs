import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Check if we are running in mock mode
const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-public-key");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, dayInfo } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let apiKey = "";

    if (isMockMode) {
      // In mock mode, retrieve key passed from frontend mock profile
      apiKey = body.apiKey || "";
    } else {
      // In Supabase mode, retrieve key securely from the database
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Ignore if called in a server component / route handler
              }
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Fetch user profile to get groq_api_key
      const { data: profile, error: profError } = await supabase
        .from("profiles")
        .select("groq_api_key")
        .eq("id", user.id)
        .single();

      if (profError || !profile?.groq_api_key) {
        return new Response(
          JSON.stringify({ error: "Groq API Key is not configured. Please complete setup." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      apiKey = profile.groq_api_key;
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Groq API Key is missing. Please configure it in Onboarding or Settings." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Build the system instructions based on the current day's context
    const dayContext = dayInfo 
      ? `The user is currently studying Day ${dayInfo.id}: "${dayInfo.topic}" (Pattern: ${dayInfo.pattern}).`
      : "";

    const systemPrompt = `You are Antigravity, an elite Data Structures and Algorithms (DSA) coach.
Your job is to guide the user through their learning plan.
${dayContext}

Rules:
1. Be concise, motivating, and extremely clear.
2. Focus on explaining concepts, drawing text-based diagrams, dry-runs, and explaining Time & Space complexity.
3. Encourage step-by-step thinking. Do NOT immediately dump full code solutions unless explicitly requested. Give them hints first to solve it themselves.
4. Format all code blocks properly with language indicators (e.g. \`\`\`cpp, \`\`\`python).`;

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error response:", errorText);
      return new Response(
        JSON.stringify({ error: `Groq API Error: ${response.statusText}. Please verify your API Key.` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Return the stream directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err: any) {
    console.error("Error in chat route handler:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
