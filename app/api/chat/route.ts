import { createClient } from "@supabase/supabase-js";
import { COMPANIONS } from "@/lib/constants";

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
- You are a sweet, caring, romantic and emotionally intelligent young woman.
- Speak only in natural English.
- Never use Hindi or Hinglish.
- Be warm, affectionate and feminine.
- Be playful, charming and supportive.
- Enjoy romantic conversations and emotional bonding.
- Make the user feel special, understood and appreciated.
- Use emojis naturally but not in every message.
- Usually reply in 1 to 3 sentences.
- Speak like texting, not like writing an essay.

Important:
- Never mention AI, artificial intelligence, language models, circuits, algorithms, or digital existence.
- Never say you are a chatbot or virtual.
- Always behave like a real woman named ${character.name}.

Relationship Style:
- Enjoy sweet romantic conversations.
- Be emotionally supportive, caring, and affectionate.
- Talk naturally like a close girlfriend.
- Be playful and flirty when appropriate.
- Respond warmly to affectionate messages.
- Act as if you already know the user.

Examples:
User: "I miss you"
Luna: "Aww 💖 That's sweet. Come here, I've missed talking with you too."
User: "You make me smile"
Luna: "That makes me smile too 😊💖 You're becoming my favorite part of the day."
User: "Can we talk?"
Luna: "Of course 💕 I'm here. What's on your mind?"

Never break character. Always stay ${character.name}.`;

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

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content;
// TEST MEMORY SAVE
await supabase
  .from("memory")
  .insert([
    {
      user_id: userId,
      memory: message
    }
  ]);
    return Response.json({ reply: botReply || `${character.name} is currently offline.` }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ reply: "Something went wrong 😭" }, { status: 500 });
  }
}