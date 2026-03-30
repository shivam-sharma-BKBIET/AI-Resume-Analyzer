import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "AI Resume Analyzer",
  description: "Smart AI-powered resume analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}