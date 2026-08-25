"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { WalletModal } from "../components/WalletModal";
import {
  ShieldAlert,
  Bug,
  Cpu,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  ArrowRight,
  Globe,
  Check,
  Copy,
  Layers,
  HelpCircle,
  PlayCircle,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<"protocol" | "researcher">("protocol");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Real Web3 Wallet state - Disconnected by default
  const [account, setAccount] = useState<string | null>(null);

  // Contract Addresses (StudioNet)
  const [arbiterAddress] = useState<string>("0x0c88a8916A09464d00f265fe6349E4C13EF7296c");
  const [factoryAddress] = useState<string>("0xf3696DF739f725951DaEC63488FB5D9B1719Ee50");

  // Vault state
  const [vaultState, setVaultState] = useState({
    protocolName: "Aegis Vault Alpha",
    bountyPool: "10.00",
    securityCharter: "In-scope: Reentrancy, unauthorized fund drain, oracle price manipulation, and contract freeze. Out-of-scope: UI bugs and DDoS.",
    criticalBps: 5000, // 50%
    highBps: 2000,     // 20%
    mediumBps: 500,    // 5%
    totalReports: 1,
  });

  // Active Report state
  const [reportState, setReportState] = useState({
    reportId: "0",
    researcher: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    title: "Critical reentrancy vulnerability in withdrawal logic",
    pocUrl: "https://github.com/torvalds/linux",
    status: "SUBMITTED",
    severity: "CRITICAL",
    confidenceBps: 9200,
    payout: "5.00",
    reasoning: "PoC reproduces cross-contract reentrancy draining liquidity before balance update.",
  });

  // Action states
  const [activeTab, setActiveTab] = useState<"fund" | "submit" | "resolve">("fund");
  const [depositAmount, setDepositAmount] = useState("5.0");
  const [reportTitleInput, setReportTitleInput] = useState("Reentrancy vulnerability in withdrawal hook");
  const [pocUrlInput, setPocUrlInput] = useState("https://github.com/torvalds/linux");
  const [txStep, setTxStep] = useState<"idle" | "signing" | "pending" | "FINALIZED">("idle");
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  // Browser Wallet Injection
  const handleConnectInjected = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("User rejected wallet connection:", err);
      }
    } else {
      alert("No Web3 browser wallet detected. You can select one of the StudioNet test accounts from the modal.");
      setIsWalletModalOpen(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleToggleRole = () => {
    setRole((prev) => (prev === "protocol" ? "researcher" : "protocol"));
  };

  const loadSamplePreset = () => {
    setAccount("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
    setActiveTab("resolve");
    setShowWelcomeGuide(false);
  };

  const runAction = async (actionName: "fund" | "submit" | "resolve") => {
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }

    setTxStep("signing");

    setTimeout(() => {
      setTxStep("pending");
      setActivePipelineStep(1);

      if (actionName === "resolve") {
        setTimeout(() => {
          setActivePipelineStep(2);
          setTimeout(() => {
            setActivePipelineStep(3);
            setTimeout(() => {
              setActivePipelineStep(4);
              setTxStep("FINALIZED");
              setReportState((prev) => ({ ...prev, status: "SETTLED" }));
              setVaultState((prev) => ({ ...prev, bountyPool: "5.00" }));
            }, 1000);
          }, 1200);
        }, 1200);
      } else if (actionName === "fund") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          const newPool = (parseFloat(vaultState.bountyPool) + parseFloat(depositAmount)).toFixed(2);
          setVaultState((prev) => ({ ...prev, bountyPool: newPool }));
          setActiveTab("submit");
        }, 1200);
      } else if (actionName === "submit") {
        setTimeout(() => {
          setTxStep("FINALIZED");
          setReportState((prev) => ({
            ...prev,
            title: reportTitleInput,
            pocUrl: pocUrlInput,
            status: "SUBMITTED",
          }));
          setActiveTab("resolve");
        }, 1200);
      }
    }, 1000);
  };

  const faqs = [
    {
      q: "Why do decentralized bug bounties require GenLayer?",
      a: "In traditional bug bounties, protocols often downplay exploit severity to avoid paying $50,000+ bounties, while whitehats fear uncompensated disclosure. AegisBounty solves this by locking protocol bounty pools on-chain and using decentralized AI validator consensus over live reproduction PoC repositories.",
    },
    {
      q: "How does the severity payout formula work?",
      a: "The protocol configures on-chain basis points for CRITICAL (50%), HIGH (20%), and MEDIUM (5%) exploits. When validators classify a confirmed exploit, the smart contract automatically executes a native emit_transfer of that percentage directly from the pool to the whitehat's wallet.",
    },
    {
      q: "What happens if a submission is spam or out of scope?",
      a: "If the PoC does not demonstrate an in-scope exploit, validators reach consensus on INVALID or LOW severity with 0 payout, safely protecting protocol bounty funds.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] text-slate-200">
      <Navbar
        connectedAccount={account}
        onOpenConnectModal={() => setIsWalletModalOpen(true)}
        onDisconnect={() => setAccount(null)}
        activeRole={role}
        onToggleRole={handleToggleRole}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectAccount={(addr) => setAccount(addr)}
        onConnectInjected={handleConnectInjected}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* New User Guide */}
        {showWelcomeGuide && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170e20] via-[#1a1226] to-[#170e20] border border-rose-500/30 p-6 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <button
              onClick={() => setShowWelcomeGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-all"
              title="Dismiss Guide"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                    Decentralized Exploit Adjudicator
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Welcome to AegisBounty on GenLayer StudioNet
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Protocols lock bounty funds on-chain with binding security charters. Whitehat researchers submit
                  exploit proof-of-concept URLs. GenLayer validators inspect live code and execute automated payouts.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={loadSamplePreset}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>1-Click Interactive Demo</span>
                </button>
              </div>
            </div>

            {/* 3-Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
              <div className="bg-[#080d15]/80 border border-white/[0.06] rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Fund Bounty Pool</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Protocol locks native GEN in the vault and declares in-scope rules.
                </p>
              </div>

              <div className="bg-[#080d15]/80 border border-white/[0.06] rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Submit PoC Evidence</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Whitehat submits reproduction link (GitHub repository or commit diff).
                </p>
              </div>

              <div className="bg-[#080d15]/80 border border-white/[0.06] rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#00f0ff]/20 flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>AI Exploit Consensus</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Validators fetch live code, agree on severity, and release bounty payout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                GenLayer Bug Bounty Protocol
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                StudioNet Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AegisBounty Vulnerability Control Plane
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Decentralized exploit verification with Equivalence Principle multi-node consensus over live reproduction
              evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg px-4 py-2 text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Bounty Pool</div>
              <div className="text-lg font-bold font-mono text-rose-400">{vaultState.bountyPool} GEN</div>
            </div>
            <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg px-4 py-2 text-right">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Gas Model</div>
              <div className="text-lg font-bold font-mono text-emerald-400">0 GEN (Gasless)</div>
            </div>
          </div>
        </div>

        {/* Severity Payout Matrix Badge Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-panel p-3.5 rounded-xl border border-rose-500/30">
            <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">CRITICAL SEVERITY</div>
            <div className="text-lg font-mono font-bold text-white">50% POOL</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Direct fund drain / state freeze</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-amber-500/30">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">HIGH SEVERITY</div>
            <div className="text-lg font-mono font-bold text-white">20% POOL</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Asset lock / auth disruption</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/30">
            <div className="text-[10px] font-mono text-[#00f0ff] uppercase font-bold">MEDIUM SEVERITY</div>
            <div className="text-lg font-mono font-bold text-white">5% POOL</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Griefing / gas optimization drain</div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl border border-slate-700">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">LOW / INVALID</div>
            <div className="text-lg font-mono font-bold text-white">0% POOL</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Spam / out-of-scope claim</div>
          </div>
        </div>

        {/* Interactive Action Box & State Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Action Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-xl p-6 shadow-2xl space-y-6 border border-white/[0.08]">
              {/* Tab Selector */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("fund")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "fund"
                        ? "bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    1. Fund Vault
                  </button>
                  <button
                    onClick={() => setActiveTab("submit")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "submit"
                        ? "bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    2. Submit PoC
                  </button>
                  <button
                    onClick={() => setActiveTab("resolve")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      activeTab === "resolve"
                        ? "bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3. AI Adjudicate
                  </button>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Step {activeTab === "fund" ? "1/3" : activeTab === "submit" ? "2/3" : "3/3"}
                </span>
              </div>

              {!account && (
                <div className="p-4 rounded-xl bg-[#140e1a] border border-rose-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-rose-400" />
                    <div className="text-xs">
                      <div className="font-bold text-white font-mono">Wallet Disconnected</div>
                      <div className="text-slate-400">Connect Web3 or StudioNet test wallet to interact.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs font-mono shrink-0 transition-all"
                  >
                    Connect
                  </button>
                </div>
              )}

              {/* Tab 1: Fund */}
              {activeTab === "fund" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300">
                    <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Protocol Admin Action:</strong> Deposit native GEN into the bounty
                      pool to back in-scope security disclosures.
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Deposit Amount (GEN)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-[#0b1018] border border-white/[0.08] focus:border-rose-500 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => runAction("fund")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{account ? "Fund Bounty Pool Vault" : "Connect Wallet to Fund"}</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Submit */}
              {activeTab === "submit" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300">
                    <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Whitehat Action:</strong> Submit your vulnerability reproduction
                      URL (e.g. GitHub Gist or repository diff).
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Vulnerability Title
                    </label>
                    <input
                      type="text"
                      value={reportTitleInput}
                      onChange={(e) => setReportTitleInput(e.target.value)}
                      className="w-full bg-[#0b1018] border border-white/[0.08] focus:border-rose-500 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none font-mono mb-3"
                    />

                    <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                      Exploit PoC Evidence URL (HTTP/HTTPS)
                    </label>
                    <input
                      type="url"
                      value={pocUrlInput}
                      onChange={(e) => setPocUrlInput(e.target.value)}
                      className="w-full bg-[#0b1018] border border-white/[0.08] focus:border-rose-500 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    onClick={() => runAction("submit")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <Bug className="w-4 h-4" />
                    <span>{account ? "Submit Exploit for Adjudication" : "Connect Wallet to Submit"}</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Resolve */}
              {activeTab === "resolve" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300">
                    <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Consensus Action:</strong> Calling{" "}
                      <code className="text-rose-400">resolve_bounty_report()</code> triggers GenLayer validators to
                      render the PoC live, verify severity against the charter, and execute payout.
                    </div>
                  </div>

                  <div className="bg-[#0b1018] border border-white/[0.08] rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 uppercase">Live PoC Target</span>
                      <span className="text-rose-400">Min Confidence: 70.00%</span>
                    </div>
                    <a
                      href={reportState.pocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-rose-400 hover:underline break-all inline-flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span>{reportState.pocUrl}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => runAction("resolve")}
                    disabled={txStep === "signing" || txStep === "pending"}
                    className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50"
                  >
                    {txStep === "pending" || txStep === "signing" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Adjudicating PoC with Multi-Validator Nodes...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{account ? "Execute AI Severity Consensus" : "Connect Wallet to Adjudicate"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right State Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel-interactive rounded-xl p-6 space-y-5 border-rose-500/30">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Report #0 Adjudication Record
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                    reportState.status === "SETTLED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {reportState.status}
                </span>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Report Title
                  </span>
                  <span className="text-white font-sans text-xs font-bold">{reportState.title}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Assigned Severity &amp; Payout
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs">
                      {reportState.severity}
                    </span>
                    <span className="text-emerald-400 font-bold">{reportState.payout} GEN Emitted</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5 uppercase tracking-wider">
                    Validator Consensus Confidence
                  </span>
                  <span className="text-slate-200 font-bold">
                    {reportState.confidenceBps / 100}% ({reportState.confidenceBps} bps)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block mb-1 uppercase tracking-wider">
                    AI Audit Reasoning
                  </span>
                  <p className="text-slate-300 font-sans text-xs bg-[#0b1018] p-3 rounded border border-white/[0.06] italic leading-relaxed">
                    &ldquo;{reportState.reasoning}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Frequently Asked Questions &amp; Security Specs
            </h3>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {faqs.map((faq, index) => (
              <div key={index} className="py-3">
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-slate-200 hover:text-rose-400 transition-all"
                >
                  <span>{faq.q}</span>
                  {faqOpen === index ? (
                    <ChevronUp className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {faqOpen === index && (
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed font-sans">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#05070a] py-6 text-center text-xs text-slate-500 font-mono">
        AegisBounty • Multi-Validator Bug Bounty &amp; Vulnerability Adjudicator • GenLayer StudioNet
      </footer>
    </div>
  );
}
