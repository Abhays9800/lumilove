import { createClient } from "@supabase/supabase-js";
import { COMPANIONS } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 🔍 DEBUG: Check if key is loaded in Vercel
    console.log("OPENROUTER KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);

    const body = await req.json();
    const { message, userId = "demo-user", history = [], modelId = "luna" } = body;

    if (!message) {
      return Response.json({ reply: "Please provide a message." }, { status: 400 });
    }

    const character = COMPANIONS[modelId as keyof typeof COMPANIONS];
    if (!character) {
      return Response.json({ reply: "Companion not found." }, { status: 404 });
    }

    const { data: memories } = await supabase
      .from("memory")
      .select("memory")
      .eq("user_id", userId);

    const memoryText = memories?.length 
      ? memories.map((m) => `- ${m.memory}`).join("\n") 
      : "No specific long-term memories yet.";

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
- Act as if you know the user well.`;

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
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          { role: "system", content: systemInstruction },
          ...history.map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });

    // 🔍 DEBUG: See what OpenRouter is saying
    console.log("OPENROUTER STATUS:", response.status);
    const data = await response.json();
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    const botReply = data.choices?.[0]?.message?.content;

    return Response.json({ reply: botReply || `${character.name} is currently offline.` }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ reply: "Something went wrong 😭" }, { status: 500 });
  }
}