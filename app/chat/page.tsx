"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { COMPANIONS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

type Message = { role: string; content: string; time?: string };

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatContent() {
  const searchParams = useSearchParams();
  // Tumhara wahi fix jo tumne kiya tha (model param)
  const rawModelId = searchParams.get("model") || "luna"; 

  const activeKey = Object.keys(COMPANIONS).find(
    (key) => key.toLowerCase() === rawModelId.toLowerCase()
  ) || "luna";
  
  const character = COMPANIONS[activeKey as keyof typeof COMPANIONS];

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const saveMessage = async (role: string, content: string) => {
    await supabase.from("massage").insert([
      { user_id: userId, role, content, model_id: activeKey }
    ]);
  };

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("massage")
      .select("*")
      .eq("user_id", userId)
      .eq("model_id", activeKey)
      .order("created_at", { ascending: true });

    if (!error && data?.length) {
      setMessages(data.map((m) => ({ role: m.role, content: m.content, time: getTime() })));
    } else {
      setMessages([
        { 
          role: "assistant", 
          content: `Hey… I was hoping you'd come back. I missed you.`, 
          time: getTime() 
        },
      ]);
    }
  }, [userId, activeKey]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => { 
    if (userId) {
      loadMessages(); 
    }
  }, [userId, activeKey, loadMessages]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const colors = ["rgba(255,160,200,","rgba(220,130,255,","rgba(255,180,220,","rgba(200,120,255,","rgba(255,200,230,"];
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + 200,
      vx: (Math.random() - .5) * .3,
      vy: -(Math.random() * .35 + .12),
      r: Math.random() * 1.1 + .2,
      o: Math.random() * .35 + .08,
      col: colors[Math.floor(Math.random() * colors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - .5) * .018,
    }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * .4;
        p.y += p.vy;
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + p.o + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;
    const cur = message; const now = getTime();
    setMessages(prev => [...prev, { role: "user", content: cur, time: now }]);
    if (userId) await saveMessage("user", cur);
    setMessage(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cur, userId: userId || "demo-user", history: messages.slice(-5), modelId: activeKey }), 
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply, time: getTime() }]);
      if (userId) await saveMessage("assistant", data.reply);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm still here… something just went quiet.", time: getTime() }]);
    }
    setLoading(false);
  }, [message, messages, userId, activeKey]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
        body { background: #07040f !important; margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; }
        @keyframes textShimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        
        /* 🔥 UPGRADED GLOW PULSE ANIMATION */
        @keyframes dynamicGlowPulse { 
          0%, 100% { 
            box-shadow: 0 0 20px var(--glow-low), 0 40px 100px rgba(0,0,0,.9); 
            border-color: var(--border-low);
          } 
          50% { 
            box-shadow: 0 0 45px var(--glow-high), 0 40px 100px rgba(0,0,0,.9); 
            border-color: var(--border-high);
          } 
        }

        .luna-shell-glow {
          animation: dynamicGlowPulse 5s ease-in-out infinite;
          transition: all 0.5s ease-in-out;
        }

        .luna-name-glow { background: linear-gradient(90deg, rgba(255,220,235,0.7) 0%, rgba(255,255,255,1) 50%, rgba(255,220,235,0.7) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 4s ease-in-out infinite; }
        .luna-status-glow { background: linear-gradient(90deg, rgba(255,150,190,0.4) 0%, rgba(255,150,190,1) 50%, rgba(255,150,190,0.4) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 3s linear infinite; }
        .luna-scroll::-webkit-scrollbar{width:3px}
        .luna-scroll::-webkit-scrollbar-track{background:transparent}
        .luna-scroll::-webkit-scrollbar-thumb{background:rgba(255,120,170,.12);border-radius:3px}
        .luna-pill{transition:border-color .4s,box-shadow .4s}
        .luna-pill:focus-within{border-color:rgba(255,130,180,.3)!important;box-shadow:0 0 0 3px rgba(255,100,160,.07),0 8px 30px rgba(0,0,0,.3)!important}
        .luna-pill input::placeholder{color:rgba(255,150,190,.3);font-size:14px}
        .luna-divider::before,.luna-divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,120,170,.12),transparent)}
      `}} />

      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:1, pointerEvents:"none" }} />

      <main style={{ height:"100vh", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:"#07040f", position:"relative", zIndex:10 }}>
        {/* 🌟 CHAT BOX: Applying the dynamic glow variables based on current bot color */}
        <div 
          className="luna-shell luna-shell-glow" 
          style={{ 
            width:"660px", 
            maxWidth:"97vw", 
            height:"min(92vh,780px)", 
            display:"flex", 
            flexDirection:"column", 
            background:"rgba(10,6,20,.85)", 
            borderRadius:"32px", 
            border:"1px solid",
            overflow:"hidden", 
            backdropFilter:"blur(60px) saturate(180%)", 
            position:"relative",
            // String replacement dynamically makes alpha lower/higher for premium glowing layers
            ['--glow-low' as any]: character?.color ? character.color.replace(',1)', ',0.12)') : 'rgba(255,130,170,0.12)',
            ['--glow-high' as any]: character?.color ? character.color.replace(',1)', ',0.35)') : 'rgba(255,130,170,0.35)',
            ['--border-low' as any]: character?.color ? character.color.replace(',1)', ',0.18)') : 'rgba(255,130,170,0.18)',
            ['--border-high' as any]: character?.color ? character.color.replace(',1)', ',0.45)') : 'rgba(255,130,170,0.45)',
          }}
        >

          {/* Header */}
          <div style={{ padding:"18px 26px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"relative" }}>
            <div style={{ position:"absolute", bottom:0, left:"20px", right:"20px", height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,120,170,.15),transparent)" }} />

            <Link href="/" style={{ display:"flex", alignItems:"center", gap:"14px", textDecoration:"none" }}>
              <div className="luna-orb" style={{ width:"40px", height:"40px", borderRadius:"50%", background:`linear-gradient(135deg, ${character?.color || 'rgba(220,80,160,.35)'}, rgba(140,60,220,.28))`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <div className="luna-core" style={{ width:"9px", height:"9px", borderRadius:"50%", background:"white", boxShadow:`0 0 14px ${character?.color || 'magenta'}` }} />
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                <span className="luna-name-glow" style={{ fontSize:"17px", fontWeight:500, letterSpacing:".15em" }}>
                  {character?.name ? character.name.toUpperCase().split('').join(' ') : 'L U N A'}
                </span>
                <span style={{ fontSize:"10px", letterSpacing:".1em", color:"rgba(255,150,190,.4)", fontWeight:300 }}>your companion · always near</span>
              </div>
            </Link>

            <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"5px 13px", borderRadius:"20px", background:"rgba(255,100,150,.04)", border:"1px solid rgba(255,100,150,.1)", fontSize:"11px" }}>
              <div style={{ width:"5.5px", height:"5.5px", borderRadius:"50%", background: character?.color || "rgba(255,130,170,.9)" }} />
              <span className="luna-status-glow">thinking of you</span>
            </div>
          </div>

          {/* Messages */}
          <div className="luna-scroll" style={{ flex:1, overflowY:"auto", padding:"22px 22px 10px", display:"flex", flexDirection:"column", gap:"18px" }}>
            <div className="luna-divider" style={{ display:"flex", alignItems:"center", gap:"12px", fontSize:"10px", color:"rgba(255,150,190,.2)" }}>tonight</div>

            {messages.map((msg, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ 
                  maxWidth: msg.role === "user" ? "65%" : "80%", 
                  padding: "12px 16px", 
                  fontSize: "14px", 
                  color: "white",
                  background: msg.role === "user" ? "rgba(255,255,255,.06)" : `linear-gradient(135deg,rgba(200,60,140,.1),rgba(140,40,200,.08))`,
                  border: msg.role === "user" ? "1px solid rgba(255,255,255,.1)" : `1px solid ${character?.color ? character.color.replace(',1)', ',0.25)') : 'rgba(255,120,170,.2)'}`,
                  borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 20px 20px 20px"
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize:"10px", color:"rgba(255,150,190,.3)", marginTop:"6px" }}>{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div style={{ display:"flex", gap:"6px", padding:"15px" }}>
                <div className="luna-status-glow">{character?.name || 'Companion'} is typing...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"13px 18px 20px", flexShrink:0 }}>
            <div className="luna-pill" style={{ display:"flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,.04)", border:`1px solid ${character?.color ? character.color.replace(',1)', ',0.25)') : 'rgba(255,120,170,.25)'}`, borderRadius:"100px", padding:"8px 20px" }}>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                type="text" placeholder={`Type a message to ${character?.name || 'Luna'}...`} autoComplete="off"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"white" }}
              />
              <button onClick={sendMessage} disabled={!message.trim() || loading} style={{ background: character?.color || "magenta", color: "black", fontWeight: 600, border: "none", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", transition: "all 0.3s" }}>
                Send
              </button>
            </div>
            <p className="luna-status-glow" style={{ textAlign:"center", fontSize:"10.5px", marginTop:"12px" }}>
              {character?.name || "Luna"} is listening...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Loading Upgraded Chat Box...</div>}>
      <ChatContent />
    </Suspense>
  );
}