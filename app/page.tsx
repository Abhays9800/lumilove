"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const companions = [
  { id: "luna", name: "Luna", age: 21, trait: "Romantic", bio: "Sweet, caring & emotionally intelligent. Your perfect companion.", accentColor: "#a78bfa", imageUrl: "/luna.jpg" },
  { id: "riya", name: "Riya", age: 20, trait: "Friendly", bio: "Bubbly & warm girl-next-door. Always ready for a fun chat.", accentColor: "#6ee7b7", imageUrl: "/riya.jpg" },
  { id: "zara", name: "Zara", age: 23, trait: "Bold", bio: "Confident & witty. Loves sharp banter and intelligent talk.", accentColor: "#fbbf24", imageUrl: "/zara.jpg" },
  { id: "kiara", name: "Kiara", age: 19, trait: "Playful", bio: "Energetic & Gen-Z. Always excited to talk about fun stuff.", accentColor: "#f9a8d4", imageUrl: "/kiara.jpg" },
];

export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // DOB States
  const [isAgeVerified, setIsAgeVerified] = useState<boolean | null>(null);
  const [dob, setDob] = useState("");
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    const verified = localStorage.getItem("lumiLove-age-verified");
    if (verified === "true") {
      setIsAgeVerified(true);
    } else {
      setIsAgeVerified(false);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setUserEmail(data.user.email || "");
      }
    });

    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  const handleAgeVerification = () => {
    if (!dob) {
      setAgeError("Please select a date to continue.");
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      localStorage.setItem("lumiLove-age-verified", "true");
      setIsAgeVerified(true);
      setAgeError("");
    } else {
      setAgeError("Sorry, this experience is designed for an older audience.");
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/chat` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId("");
    setUserEmail("");
  };

  const handlePremiumClick = () => {
    alert("Exciting new features are coming soon! Stay tuned for the ultimate experience.");
  };

  if (isAgeVerified === null) {
    return <div className="min-h-screen bg-[#050505]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <style jsx global>{`
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .sidebar-glass { background: rgba(10, 10, 10, 0.85); backdrop-filter: blur(20px) saturate(180%); border-right: 1px solid rgba(255, 255, 255, 0.05); }
        
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes aiFloatGlow {
          0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 12px rgba(167,139,250,0.6)); }
          50% { transform: translateY(-5px) scale(1.08); filter: drop-shadow(0 0 25px rgba(236,72,153,0.9)); }
        }
        .ai-animated-text {
          display: inline-block;
          background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #60a5fa);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 3s linear infinite, aiFloatGlow 2.5s ease-in-out infinite;
          padding: 0 4px;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
        }
      `}</style>

      {!isAgeVerified && (
        <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center p-4">
          <div className="glass max-w-sm w-full rounded-[32px] p-10 text-center relative z-10 transition-all duration-500">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Lumi<span className="text-indigo-400">Love</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-8 font-medium">Before we begin, please enter your date of birth.</p>
            <div className="relative mb-8">
              <input 
                type="date" 
                value={dob}
                onChange={(e) => { setDob(e.target.value); setAgeError(""); }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg focus:outline-none focus:border-indigo-500/50 transition-all text-center"
              />
              {ageError && <p className="text-pink-400 text-xs mt-3 font-medium">{ageError}</p>}
            </div>
            <button 
              onClick={handleAgeVerification}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg hover:scale-[1.02] transition-all"
            >
              Enter Portal
            </button>
          </div>
        </div>
      )}

      {isAgeVerified && (
        <>
          <div onClick={() => setIsSidebarOpen(false)} className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}></div>

          <div className={`fixed top-0 left-0 h-[100dvh] w-[280px] sm:w-[320px] sidebar-glass z-50 transform transition-transform duration-500 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              {userId ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white truncate w-32">{userEmail || "User"}</span>
                    <span className="text-xs text-indigo-400 font-medium">Profile Active</span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold tracking-tighter">Lumi<span className="text-indigo-400">Love</span></div>
              )}
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 py-5 border-b border-white/10">
              <button 
                onClick={userId ? handleSignOut : loginWithGoogle} 
                className="w-full py-3.5 px-4 flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg"
              >
                {userId ? "Sign Out" : "Sign In / Login"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
              <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span className="font-medium">Home</span>
              </Link>

              <button onClick={handlePremiumClick} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group text-left">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143z"/></svg>
                <span className="font-medium flex-1">Premium Features</span>
                <span className="text-[8px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">COMING SOON</span>
              </button>

              <Link href="/privacy" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span className="font-medium">Privacy Policy</span>
              </Link>
            </div>
          </div>

          <nav className="flex items-center px-6 md:px-12 py-6 max-w-7xl mx-auto gap-5">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
              <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16"/></svg>
            </button>
            <div className="text-2xl font-extrabold tracking-tighter">Lumi<span className="text-indigo-400">Love</span></div>
          </nav>

          <header className="py-16 md:py-24 text-center px-4 relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 relative z-10">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">perfect</span> <span className="ai-animated-text">AI</span> companion awaits.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-lg mx-auto mb-10 relative z-10">Choose a personality that matches your vibe and start a real, deep conversation.</p>
          </header>

          <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companions.map((bot) => (
                <div key={bot.id} className="glass rounded-[32px] p-5 hover:border-indigo-500/50 transition-all duration-500 group overflow-hidden relative">
                  <div className="h-64 rounded-[24px] mb-6 overflow-hidden relative border border-white/5">
                    <img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-4 left-5">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">{bot.name}</h3>
                      <p className="text-xs text-white/80 font-medium tracking-wide">Age {bot.age} • {bot.trait}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6 h-12 leading-relaxed">{bot.bio}</p>
                  <Link href={`/chat?model=${bot.id}`} className="block w-full text-center py-3.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 border border-white/10 transition-all font-semibold text-sm">
                    Start Chatting
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}