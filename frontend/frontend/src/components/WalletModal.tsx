"use client";

import React from "react";
import { Wallet, X, Shield, ArrowRight } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (address: string) => void;
  onConnectInjected: () => void;
}

export function WalletModal({ isOpen, onClose, onSelectAccount, onConnectInjected }: WalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0b1018] border border-[#00f0ff]/30 rounded-2xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
            <Shield className="w-4 h-4" />
            <span>Aegis Security Access</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Connect Web3 Wallet</h3>
          <p className="text-xs text-slate-400">
            Connect an injected Web3 wallet (MetaMask, Rabby, Coinbase) or select a GenLayer StudioNet test account.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Browser Extension Wallet */}
          <button
            onClick={() => {
              onConnectInjected();
              onClose();
            }}
            className="w-full p-3.5 rounded-xl bg-[#0f1726] hover:bg-[#15233c] border border-white/[0.08] hover:border-[#00f0ff]/50 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1c2940] flex items-center justify-center border border-white/[0.08] group-hover:border-[#00f0ff]/40">
                <Wallet className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono group-hover:text-[#00f0ff]">
                  Browser Extension Wallet
                </div>
                <div className="text-[11px] text-slate-400">MetaMask, Rabby, Brave, Coinbase</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* StudioNet Test Account 0 (Protocol Admin) */}
          <button
            onClick={() => {
              onSelectAccount("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-[#0d1420] hover:bg-[#131d2e] border border-white/[0.06] hover:border-emerald-500/40 transition-all flex items-center justify-between text-left group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>StudioNet Account 0 (Protocol Admin)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Vault Admin
            </span>
          </button>

          {/* StudioNet Test Account 1 (Whitehat) */}
          <button
            onClick={() => {
              onSelectAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
              onClose();
            }}
            className="w-full p-3 rounded-xl bg-[#0d1420] hover:bg-[#131d2e] border border-white/[0.06] hover:border-cyan-500/40 transition-all flex items-center justify-between text-left group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-[#00f0ff] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                <span>StudioNet Account 1 (Whitehat Researcher)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                0x70997970C51812dc3A010C7d01b50e0d17dc79C8
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20">
              Researcher
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
