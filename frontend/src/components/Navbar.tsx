"use client";

import React, { useState } from "react";
import { Shield, ExternalLink, Wallet, CheckCircle2, GitBranch, Bug, LogOut, ChevronDown } from "lucide-react";

interface NavbarProps {
  connectedAccount: string | null;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  activeRole: "protocol" | "researcher";
  onToggleRole: () => void;
}

export function Navbar({
  connectedAccount,
  onOpenConnectModal,
  onDisconnect,
  activeRole,
  onToggleRole,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="border-b border-white/[0.08] bg-[#06080d]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-[#140f22] border border-rose-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.25)]">
              <Bug className="w-5 h-5 text-rose-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#06080d] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wider text-white uppercase font-mono">
                Aegis<span className="text-rose-400">Bounty</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0f172a] text-[#00f0ff] font-mono border border-[#00f0ff]/30 tracking-tight">
                STUDIONET
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
              <Shield className="w-3 h-3 text-rose-400" />
              <span>Decentralized Exploit Adjudicator</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          {/* Role switcher toggle */}
          <div className="hidden sm:flex items-center bg-[#0d1420] p-1 rounded-lg border border-white/[0.08] text-xs font-mono">
            <button
              onClick={onToggleRole}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeRole === "protocol"
                  ? "bg-rose-500 text-white font-bold shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>Protocol Admin</span>
            </button>
            <button
              onClick={onToggleRole}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeRole === "researcher"
                  ? "bg-[#00f0ff] text-black font-bold shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>Whitehat Mode</span>
            </button>
          </div>

          <a
            href="https://github.com/k-beee/aegis-bounty"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center space-x-1 text-xs text-gray-400 hover:text-rose-400 font-mono px-2.5 py-1.5 rounded border border-transparent hover:border-white/[0.08] transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Wallet Connection Button / Dropdown */}
          <div className="relative">
            {connectedAccount ? (
              <div className="flex items-center">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-[#0e1626] hover:bg-[#152238] border border-emerald-500/40 hover:border-emerald-400 px-3.5 py-1.5 rounded-lg text-xs font-mono text-white transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{`${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0b1018] border border-white/[0.08] rounded-xl shadow-2xl p-1 z-50 font-mono text-xs">
                    <button
                      onClick={() => {
                        onDisconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
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
