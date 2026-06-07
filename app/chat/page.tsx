"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
const USER_ID = "demo-user";
export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey baby 😘",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
const saveMessage = async (
  role: string,
  content: string
) => {
  await supabase.from("massage").insert([
    {
      user_id: USER_ID,
      role,
      content,
    },
  ]);
};
const loadMessages = async () => {
  const { data, error } = await supabase
    .from("massage")
    .select("*")
    .eq("user_id", USER_ID)
    .order("created_at", { ascending: true });

  if (error) {
    console.log(error);
    return;
  }

  if (data) {
    setMessages(
      data.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    );
  }
};
const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://lumilove.in/chat",
    },
  });
};
useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    console.log("USER:", data.user);
  });
}, []);

useEffect(() => {
  loadMessages();
}, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (!message.trim()) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);
await saveMessage(
  "user",
  currentMessage
);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
await saveMessage(
  "assistant",
  data.reply
);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong 😭",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-3">

        <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-xl">
          💖
        </div>

        <div>
  <h1 className="font-bold text-lg">
    Luna
  </h1>

  <p className="text-xs text-green-400">
    Online
  </p>

  <button
    onClick={loginWithGoogle}
    className="mt-2 bg-white text-black px-3 py-1 rounded-lg text-sm"
  >
    Sign in with Google
  </button>
</div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[75%] px-4 py-3 rounded-3xl ${
                msg.role === "user"
                  ? "bg-pink-600 shadow-lg"
                  : "bg-zinc-900 border border-zinc-700"
              }`}
            >
              {msg.content}
            </div>

          </div>

        ))}

        {loading && (
  <div className="flex justify-start">
    <div className="bg-zinc-900 border border-zinc-700 px-4 py-3 rounded-3xl flex gap-2">

      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>

      <div
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      ></div>

      <div
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></div>

    </div>
  </div>
)}

        <div ref={bottomRef}></div>

      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 flex gap-2">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          type="text"
          placeholder="Message Luna..."
          className="flex-1 bg-zinc-900 border border-zinc-700 p-4 rounded-full outline-none"
        />

        <button
          onClick={sendMessage}

          className="bg-pink-600 hover:bg-pink-500 transition px-6 rounded-full"
        >
          🚀
        </button>

      </div>

    </main>
  );
}