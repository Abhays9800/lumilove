"use client";

import Link from "next/link";

export default function PrivacyPage() {
return ( <div className="min-h-screen bg-[#050505] text-white"> <style jsx global>{`         .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>


  <nav className="px-6 md:px-12 py-6 max-w-4xl mx-auto">
    <Link
      href="/"
      className="text-2xl font-extrabold tracking-tighter"
    >
      Lumi
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Love
      </span>
    </Link>
  </nav>

  <main className="max-w-3xl mx-auto px-6 pb-24 pt-8">
    <div className="glass rounded-[32px] p-8 md:p-12">

      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-zinc-500 text-sm mb-10">
        Last updated: June 2026
      </p>

      <div className="flex flex-col gap-8 text-zinc-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. Introduction
          </h2>
          <p>
            Welcome to LumiLove. We are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard
            your information when you use our AI companion platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. Information We Collect
          </h2>

          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-400 ml-2">
            <li>
              <span className="text-zinc-300">Account Information:</span>
              {" "}Your email address and authentication details when you sign in.
            </li>

            <li>
              <span className="text-zinc-300">Chat History:</span>
              {" "}Messages exchanged with AI companions to provide continuity and conversation history.
            </li>

            <li>
              <span className="text-zinc-300">Memory Data:</span>
              {" "}Information you voluntarily share may be stored as long-term memories to provide personalized conversations.
            </li>

            <li>
              <span className="text-zinc-300">Usage Data:</span>
              {" "}Basic interaction data such as session activity, timestamps, and companion usage.
            </li>

            <li>
              <span className="text-zinc-300">Age Verification:</span>
              {" "}Information entered during age verification processes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. How We Use Your Information
          </h2>

          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-400 ml-2">
            <li>To provide personalized AI companion experiences.</li>
            <li>To remember important details you choose to share.</li>
            <li>To maintain continuity across conversations.</li>
            <li>To improve platform quality and user experience.</li>
            <li>To ensure compliance with age restrictions.</li>
            <li>To protect the security and integrity of the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Data Storage & Security
          </h2>

          <p>
            Your information is stored using secure infrastructure and protected
            through industry-standard security practices. While no method of
            electronic storage is completely secure, we take reasonable steps
            to safeguard your data against unauthorized access, alteration,
            disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Third-Party Services
          </h2>

          <p>
            LumiLove relies on trusted third-party services to operate:
          </p>

          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-400 ml-2 mt-3">
            <li>
              <span className="text-zinc-300">Google OAuth</span>
              {" "}— secure authentication and sign-in.
            </li>

            <li>
              <span className="text-zinc-300">Supabase</span>
              {" "}— database, authentication, and storage services.
            </li>

            <li>
              <span className="text-zinc-300">OpenRouter</span>
              {" "}— access to AI models and conversation generation.
            </li>
          </ul>

          <p className="mt-3">
            These services maintain their own privacy policies and practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Data Retention & Deletion
          </h2>

          <p>
            Chat history and saved memories may be retained to provide
            continuity and personalization features. You may request deletion
            of your account and associated data at any time. Upon verification,
            personal data, stored memories, and chat history will be removed
            within a reasonable period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Age Restriction
          </h2>

          <p>
            LumiLove is intended only for adults aged 18 years or older.
            We do not knowingly collect information from minors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            8. Your Rights
          </h2>

          <ul className="list-disc list-inside flex flex-col gap-2 text-zinc-400 ml-2">
            <li>Access your personal information.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your information.</li>
            <li>Withdraw consent where applicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            9. Contact Us
          </h2>

          <p>
            For privacy-related questions, requests, or concerns, please contact:
          </p>

          <p className="mt-2 text-indigo-400 font-medium">
            support@lumilove.in
          </p>
        </section>

      </div>
    </div>
  </main>
</div>


);
}
