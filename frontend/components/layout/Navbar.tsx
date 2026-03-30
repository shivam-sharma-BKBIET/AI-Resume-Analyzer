export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-zinc-900 border-b border-zinc-800">
      <h1 className="text-xl font-bold">AI Resume Analyzer</h1>
      <div className="space-x-6">
        <a href="/" className="hover:text-gray-400">Home</a>
        <a href="/upload" className="hover:text-gray-400">Upload</a>
        <a href="/dashboard" className="hover:text-gray-400">Dashboard</a>
      </div>
    </nav>
  );
}