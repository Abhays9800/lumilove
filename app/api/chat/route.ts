import { createClient } from "@supabase/supabase-js";
import { COMPANIONS } from "@/lib/constants"; // Import your central config

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId = "demo-user", history = [], modelId = "luna" } = body;

    if (!message) {
      return Response.json({ reply: "Please provide a message." }, { status: 400 });
    }

    // 1. Get Character Data from Constants
    const character = COMPANIONS[modelId as keyof typeof COMPANIONS];
    if (!character) {
      return Response.json({ reply: "Companion not found." }, { status: 404 });
    }

    // 2. Fetch User Memories
    const { data: memories } = await supabase
      .from("memory")
      .select("memory")
      .eq("user_id", userId);

    const memoryText = memories?.length 
      ? memories.map((m) => `- ${m.memory}`).join("\n") 
      : "No specific long-term memories yet.";

    // 3. Dynamic System Prompt
    // 3. Dynamic System Prompt
    const systemInstruction = `You are ${character.name}.
Things you remember about the user:
${memoryText}

Personality:
${character.prompt}

Guidelines:
- Speak only in natural English.
- Never mention AI, models, or being virtual.
- Behave exactly like ${character.name}.
- Keep replies natural, concise (1-3 sentences).
- Act as if you know the user well.

Examples:
User: "I miss you"
Luna: "Aww 💖 That's sweet. Come here, I've missed talking with you too."
User: "You make me smile"
Luna: "That makes me smile too 😊💖 You're becoming my favorite part of the day."
User: "Can we talk?"
Luna: "Of course 💕 I'm here. What's on your mind?"

Never break character. Always stay ${character.name}.`; // <-- String ab yahan correctly close ho rahi hai
    // 4. Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "LumiLove App",
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [
          { role: "system", content: systemInstruction },
          ...history.map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content;

    return Response.json({ reply: botReply || `${character.name} is currently offline.` }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ reply: "Something went wrong 😭" }, { status: 500 });
  }
}