export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-zinc-800">

        <h1 className="text-3xl font-bold text-pink-500">
          Lumilove 💖
        </h1>

        <div className="flex items-center gap-6">

          <a href="/" className="hover:text-pink-400">
            Home
          </a>

          <a href="#companions" className="hover:text-pink-400">
            Companions
          </a>

          <a href="/chat" className="hover:text-pink-400">
            Chat
          </a>

          <a
            href="/chat"
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full transition"
          >
            Start Chat
          </a>

        </div>

      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">

        <h1 className="text-7xl font-bold mb-6">
          Find Your Perfect
          <span className="text-pink-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)]">
            {" "}AI Companion
          </span>
        </h1>

        <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10">
          Chat, flirt, roleplay and build emotional connections
          with your favorite AI companion.
        </p>

        <a
          href="/chat"
          className="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-full text-lg font-semibold transition"
        >
          Start Chatting 💖
        </a>

      </section>

      {/* Companion Cards */}
      <section
        id="companions"
        className="max-w-6xl mx-auto px-6 py-12"
      >

        <h2 className="text-4xl font-bold text-center mb-12">
          Meet Your Companions
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Luna */}
          {/* Luna */}

<div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:scale-105 hover:-translate-y-2 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] transition duration-300 cursor-pointer">

  <img
    src="/luna.jpg"
    alt="Luna"
    className="w-full h-72 object-cover rounded-2xl mb-4 border border-pink-500/30"
  />

  <h3 className="text-3xl font-bold mb-3">
    Luna 💖
  </h3>

  <p className="text-zinc-400">
    Sweet, caring and romantic AI companion who is always there for you.
  </p>

  <a
    href="/chat"
    className="inline-block mt-5 bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-full"
  >
    Chat with Luna 💖
  </a>

</div>

          {/* Zara */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:scale-105 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] transition duration-300 cursor-pointer">

            <div className="text-7xl mb-4">
              🔥
            </div>

            <h3 className="text-3xl font-bold mb-3">
              Zara
            </h3>

            <p className="text-zinc-400">
              Confident, playful and full of energy.
            </p>

            <a
              href="/chat"
              className="inline-block mt-5 bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-full"
            >
              Chat with Zara 🔥
            </a>

          </div>

          {/* Riya */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 hover:scale-105 hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)] transition duration-300 cursor-pointer">

            <div className="text-7xl mb-4">
              🌸
            </div>

            <h3 className="text-3xl font-bold mb-3">
              Riya
            </h3>

            <p className="text-zinc-400">
              Emotional listener and supportive friend.
            </p>

            <a
              href="/chat"
              className="inline-block mt-5 bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-full"
            >
              Chat with Riya 🌸
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}