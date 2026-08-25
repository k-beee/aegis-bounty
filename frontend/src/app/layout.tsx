import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisBounty | Decentralized Exploit Adjudicator",
  description: "Autonomous Bug Bounty Protocol on GenLayer with Multi-Validator Live PoC Consensus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05070c] text-[#e1e7f0] antialiased selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
