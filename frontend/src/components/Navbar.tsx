"use client";

import React, { useState } from "react";
import { ShieldAlert, ExternalLink, Wallet, GitBranch, Bug, LogOut, ChevronDown, Sparkles, Search } from "lucide-react";

interface NavbarProps {
  connectedAccount: string | null;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
}

export function Navbar({
  connectedAccount,
  onOpenConnectModal,
  onDisconnect,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-mono">
                AEGIS<span className="text-rose-600 font-sans font-black">BOUNTY</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold font-mono border border-slate-300">
                GENLAYER STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans tracking-tight">
              Decentralized Vulnerability Adjudication Network
            </p>
          </div>
        </div>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono font-medium text-slate-600">
          <a href="#bounty-vault" className="hover:text-rose-600 transition-colors">
            Vault Details
          </a>
          <a href="#submit-disclosure" className="hover:text-rose-600 transition-colors">
            Submit Exploit
          </a>
          <a href="#verified-feed" className="hover:text-rose-600 transition-colors">
            Adjudication Feed
          </a>
          <a
            href="https://github.com/k-beee/aegis-bounty"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            {connectedAccount ? (
              <div className="flex items-center">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 px-4 py-2 rounded-xl text-xs font-mono text-slate-900 transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold">{`${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 font-mono text-xs animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        onDisconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-all font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-mono transition-all shadow-md shadow-rose-600/20"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
