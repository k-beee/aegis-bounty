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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-600 uppercase tracking-wider font-bold">
            <Shield className="w-4 h-4" />
            <span>Aegis Security Access</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Connect Web3 Wallet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connect your browser wallet (MetaMask, Rabby, Coinbase) or select a GenLayer StudioNet test account.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Browser Extension Wallet */}
          <button
            onClick={() => {
              onConnectInjected();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-rose-400 transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-xs group-hover:border-rose-300">
                <Wallet className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 font-mono group-hover:text-rose-600">
                  Browser Extension Wallet
                </div>
                <div className="text-[11px] text-slate-500">MetaMask, Rabby, Brave, Coinbase</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* StudioNet Test Account 0 (Protocol Admin) */}
          <button
            onClick={() => {
              onSelectAccount("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-emerald-400 transition-all flex items-center justify-between text-left group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>StudioNet Account 0 (Protocol Admin)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              Vault Admin
            </span>
          </button>

          {/* StudioNet Test Account 1 (Whitehat) */}
          <button
            onClick={() => {
              onSelectAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
              onClose();
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-rose-400 transition-all flex items-center justify-between text-left group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-slate-800 group-hover:text-rose-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>StudioNet Account 1 (Whitehat Researcher)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                0x70997970C51812dc3A010C7d01b50e0d17dc79C8
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-200">
              Researcher
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
