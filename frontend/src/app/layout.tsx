import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisBounty | Security Research & Exploit Adjudication",
  description: "Autonomous Bug Bounty Protocol on GenLayer with Multi-Validator Live PoC Consensus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
