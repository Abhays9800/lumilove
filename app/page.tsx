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
      // Ekdum subtle aur polite message
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

        /* Date Input native calendar icon styling for dark mode */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
          transition: 0.3s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>

      {/* ✨ PREMIUM WELCOME / DOB GATE ✨ */}
      {!isAgeVerified && (
        <div className="fixed inset-0 bg-[#050505] z-[9999] flex items-center justify-center p-4">
          {/* Ambient Glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full"></div>
          </div>
          
          {/* Sleek Glass Card */}
          <div className="glass max-w-sm w-full rounded-[32px] p-10 text-center relative z-10 transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] group">
            
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Lumi<span className="text-indigo-400">Love</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-8 font-medium">Before we begin, please enter your date of birth.</p>

            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setAgeError("");
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer text-center relative z-10 hover:bg-white/10 scheme-dark"
              />
              {ageError && (
                <p className="text-pink-400 text-xs mt-3 font-medium tracking-wide">
                  {ageError}
                </p>
              )}
            </div>

            <button 
              onClick={handleAgeVerification}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Enter Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Website Contents */}
      {isAgeVerified && (
        <>
          {/* Sidebar Overlay */}
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          ></div>

          {/* Sidebar */}
          <div className={`fixed top-0 left-0 h-[100dvh] w-[280px] sm:w-[320px] sidebar-glass z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.5)]`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              {userId ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white truncate w-32">{userEmail || "User"}</span>
                    <span className="text-xs text-indigo-400 font-medium tracking-wide">Free Plan</span>
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
                className="w-full py-3.5 px-4 flex items-center justify-center gap-3 rounded-xl font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 shadow-lg"
              >
                {userId ? (
                  <>
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Sign Out
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign In / Login
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
              <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span className="font-medium">Home</span>
              </Link>
              <button className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group text-left">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143z"/></svg>
                <span className="font-medium flex-1">Premium Features</span>
                <span className="text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">PRO</span>
              </button>
              <button className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group text-left">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="font-medium">Settings</span>
              </button>
              <Link href="/privacy" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span className="font-medium">Privacy Policy</span>
              </Link>
            </div>
          </div>

          {/* Navbar */}
          <nav className="flex items-center px-6 md:px-12 py-6 max-w-7xl mx-auto gap-5">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 backdrop-blur-md group"
            >
              <svg className="w-6 h-6 text-zinc-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16"/>
              </svg>
            </button>
            <div className="text-2xl font-extrabold tracking-tighter">Lumi<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Love</span></div>
          </nav>

          {/* Hero Section */}
          <header className="py-16 md:py-24 text-center px-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 relative z-10">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">perfect</span> <span className="ai-animated-text">AI</span> companion awaits.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-lg mx-auto mb-10 relative z-10">Choose a personality that matches your vibe and start a real, deep conversation.</p>
          </header>

          {/* Cards Section */}
          <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {companions.map((bot) => (
                <div key={bot.id} className="glass rounded-[32px] p-5 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500 group overflow-hidden relative">
                  <div className="h-64 rounded-[24px] mb-6 overflow-hidden relative border border-white/5">
                    <img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-4 left-5">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">{bot.name}</h3>
                      <p className="text-xs text-white/80 font-medium tracking-wide">Age {bot.age} • {bot.trait}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6 h-12 leading-relaxed">{bot.bio}</p>
                  <Link href={`/chat?model=${bot.id}`} className="block w-full text-center py-3.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 border border-white/10 hover:border-transparent transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-indigo-500/25">
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