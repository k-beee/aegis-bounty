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
    <header className="border-b border-slate-200/90 bg-white/85 backdrop-blur-xl sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-mono">
                Aegis<span className="text-rose-600">Bounty</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold font-mono border border-rose-200 tracking-tight">
                STUDIONET
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight flex items-center gap-1">
              <Shield className="w-3 h-3 text-rose-600" />
              <span>Decentralized Exploit Adjudicator</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-3">
          {/* Role switcher toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              onClick={onToggleRole}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRole === "protocol"
                  ? "bg-white text-rose-700 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Protocol Mode</span>
            </button>
            <button
              onClick={onToggleRole}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeRole === "researcher"
                  ? "bg-rose-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Researcher Mode</span>
            </button>
          </div>

          <a
            href="https://github.com/k-beee/aegis-bounty"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center space-x-1 text-xs text-slate-600 hover:text-rose-600 font-mono px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all"
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
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-900 transition-all shadow-xs"
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
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono transition-all shadow-md shadow-slate-900/10 hover:shadow-lg"
              >
                <Wallet className="w-3.5 h-3.5 text-rose-400" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
