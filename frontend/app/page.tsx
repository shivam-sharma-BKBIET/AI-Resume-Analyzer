export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-5xl font-bold mb-6">
        Analyze Your Resume with AI
      </h1>
      <p className="text-gray-400 max-w-xl mb-8">
        Get ATS score, skill insights, keyword analysis and improvement suggestions instantly.
      </p>
      <a
        href="/upload"
        className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-300 transition"
      >
        Get Started
      </a>
    </main>
  );
}