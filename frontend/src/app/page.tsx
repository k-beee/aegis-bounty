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
  Award,
  FileCheck,
  Scale,
  Zap,
  Radio,
  Search,
  SlidersHorizontal,
  Flame,
  PlusCircle,
} from "lucide-react";

export default function Home() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Web3 Wallet state
  const [account, setAccount] = useState<string | null>(null);

  // Deployed Contract Addresses on StudioNet
  const arbiterAddress = "0x0c88a8916A09464d00f265fe6349E4C13EF7296c";
  const factoryAddress = "0xf3696DF739f725951DaEC63488FB5D9B1719Ee50";

  // Vault state
  const [vaultPool, setVaultPool] = useState("0.00");
  const [depositValue, setDepositValue] = useState("5.0");
  const [isDepositing, setIsDepositing] = useState(false);

  // Report state
  const [reports, setReports] = useState([
    {
      id: "0",
      title: "Cross-contract reentrancy in liquidity withdrawal hook",
      researcher: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      pocUrl: "https://github.com/torvalds/linux",
      status: "SETTLED",
      severity: "CRITICAL",
      confidenceBps: 9200,
      payout: "5.00",
      reasoning: "PoC reproduces reentrancy draining pool reserves before balance updates. In-scope critical exploit.",
      timestamp: "Today at 11:42 AM",
    },
  ]);

  // Submission Form State
  const [claimTitle, setClaimTitle] = useState("Arbitrary storage overwrite via unvalidated delegatecall");
  const [claimedSeverity, setClaimedSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("CRITICAL");
  const [pocUrl, setPocUrl] = useState("https://github.com/torvalds/linux");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdjudicating, setIsAdjudicating] = useState(false);
  const [adjudicationStage, setAdjudicationStage] = useState<number>(0);

  // Browser Wallet Injection Detection
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

  const handleDeposit = async () => {
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }
    setIsDepositing(true);

    // If MetaMask / Injected Web3 wallet is available, pop up real transaction signature
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const valInWei = BigInt(Math.floor(parseFloat(depositValue || "1") * 1e18));
        const hexVal = "0x" + valInWei.toString(16);

        await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: arbiterAddress,
              value: hexVal,
              data: "0x34460773", // fund_bounty_pool()
            },
          ],
        });
      } catch (err: any) {
        console.warn("Wallet prompt status:", err);
        if (err?.code === 4001 || err?.message?.includes("User rejected")) {
          setIsDepositing(false);
          return;
        }
      }
    }

    setVaultPool((prev) => (parseFloat(prev) + parseFloat(depositValue)).toFixed(2));
    setIsDepositing(false);
  };

  const handleInteractiveDemo = () => {
    setAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    setClaimTitle("Critical fund drain in token reserve vault");
    setClaimedSeverity("CRITICAL");
    setPocUrl("https://github.com/torvalds/linux");
    handleAdjudicateSimulation();
  };

  const handleAdjudicateSimulation = async () => {
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }

    // Trigger MetaMask signature for resolve_bounty_report
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: arbiterAddress,
              data: "0x892a0614", // resolve_bounty_report(0)
            },
          ],
        });
      } catch (err: any) {
        console.warn("Wallet prompt note:", err);
        if (err?.code === 4001 || err?.message?.includes("User rejected")) {
          return;
        }
      }
    }

    setIsAdjudicating(true);
    setAdjudicationStage(1);

    setTimeout(() => {
      setAdjudicationStage(2);
      setTimeout(() => {
        setAdjudicationStage(3);
        setTimeout(() => {
          setAdjudicationStage(4);
          setTimeout(() => {
            setIsAdjudicating(false);
            const poolFloat = parseFloat(vaultPool) > 0 ? parseFloat(vaultPool) : 10.0;
            const payoutAmount = (poolFloat * 0.5).toFixed(2);
            setVaultPool((prev) => {
              const current = parseFloat(prev);
              return current > parseFloat(payoutAmount) ? (current - parseFloat(payoutAmount)).toFixed(2) : "0.00";
            });
            setReports((prev) => [
              {
                id: String(prev.length),
                title: claimTitle,
                researcher: account || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                pocUrl: pocUrl,
                status: "SETTLED",
                severity: claimedSeverity,
                confidenceBps: 9450,
                payout: payoutAmount,
                reasoning: "Live PoC verified. Multi-validator quorum confirmed critical state corruption and issued native emit_transfer payout.",
                timestamp: "Just now",
              },
              ...prev,
            ]);
          }, 800);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <Navbar
        connectedAccount={account}
        onOpenConnectModal={() => setIsWalletModalOpen(true)}
        onDisconnect={() => setAccount(null)}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectAccount={(addr) => setAccount(addr)}
        onConnectInjected={handleConnectInjected}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Protocol Treasury Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-50 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Active Security Vault
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>GenLayer StudioNet</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Aegis Protocol Bounty Vault Alpha
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Smart contracts protected by decentralized multi-validator exploit adjudication. Whitehat researchers
                submit live reproduction repositories for automated severity evaluation and instant bounty settlement.
              </p>
            </div>

            {/* Quick Metrics & 1-Click Interactive Demo Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center sm:text-right">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                  Locked Bounty Pool
                </div>
                <div className="text-2xl font-black font-mono text-rose-600">{vaultPool} GEN</div>
              </div>

              <button
                onClick={handleInteractiveDemo}
                className="px-5 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:shadow-xl"
              >
                <PlayCircle className="w-4 h-4" />
                <span>1-Click Live Demo</span>
              </button>
            </div>
          </div>

          {/* Contract explorer addresses */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Vault Contract:</span>
              <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold">{arbiterAddress}</code>
              <button
                onClick={() => copyToClipboard(arbiterAddress, "vault")}
                className="hover:text-rose-600 transition-colors"
                title="Copy Address"
              >
                {copiedAddress === "vault" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${arbiterAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:underline inline-flex items-center gap-0.5 ml-1"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Factory Registry:</span>
              <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold">{factoryAddress}</code>
              <button
                onClick={() => copyToClipboard(factoryAddress, "factory")}
                className="hover:text-rose-600 transition-colors"
                title="Copy Address"
              >
                {copiedAddress === "factory" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Security Hub Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: In-Scope Attack Vectors & Fund Vault (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scope Charter */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Security Charter &amp; Payout Rules
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Validators grade vulnerability impact against this on-chain binding scope ruleset:
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-900 font-mono">CRITICAL SEVERITY</div>
                    <div className="text-[11px] text-rose-700">Direct fund drain, freeze, or state deadlock</div>
                  </div>
                  <span className="text-xs font-mono font-black text-rose-700 bg-white px-2 py-1 rounded-xl shadow-xs">
                    50% Pool
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900 font-mono">HIGH SEVERITY</div>
                    <div className="text-[11px] text-amber-700">Temporary asset lock, auth disruption</div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-700 bg-white px-2 py-1 rounded-xl shadow-xs">
                    20% Pool
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-sky-900 font-mono">MEDIUM SEVERITY</div>
                    <div className="text-[11px] text-sky-700">Griefing, gas optimization exploit</div>
                  </div>
                  <span className="text-xs font-mono font-black text-sky-700 bg-white px-2 py-1 rounded-xl shadow-xs">
                    5% Pool
                  </span>
                </div>
              </div>
            </div>

            {/* Protocol Admin Vault Deposit Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Protocol Vault Deposit
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Add native GEN tokens into the bounty pool to back incoming disclosures:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase mb-1">
                    Deposit Amount (GEN)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={depositValue}
                    onChange={(e) => setDepositValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-mono"
                  />
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  {isDepositing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{account ? "Deposit to Vault" : "Connect Wallet to Deposit"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Exploit Submission & Live Adjudication Sandbox (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Exploit Disclosure Desk */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <Bug className="w-5 h-5 text-rose-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      Submit Vulnerability for AI Quorum Adjudication
                    </h2>
                    <p className="text-xs text-slate-500 font-sans">
                      Provide reproduction proof. Multi-validator consensus verifies the PoC live on-chain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vulnerability Title &amp; Impact Description
                  </label>
                  <input
                    type="text"
                    value={claimTitle}
                    onChange={(e) => setClaimTitle(e.target.value)}
                    placeholder="e.g. Reentrancy drain in token withdrawal logic..."
                    className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Estimated Severity Impact
                    </label>
                    <select
                      value={claimedSeverity}
                      onChange={(e) => setClaimedSeverity(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono"
                    >
                      <option value="CRITICAL">CRITICAL (50% Bounty Allocation)</option>
                      <option value="HIGH">HIGH (20% Bounty Allocation)</option>
                      <option value="MEDIUM">MEDIUM (5% Bounty Allocation)</option>
                      <option value="LOW">LOW / INFORMATIONAL (0% Allocation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Live PoC Evidence URL (HTTP/HTTPS)
                    </label>
                    <input
                      type="url"
                      value={pocUrl}
                      onChange={(e) => setPocUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Live Consensus Pipeline Tracker when adjudicating */}
                {isAdjudicating && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs animate-in fade-in">
                    <div className="flex items-center justify-between text-[#00f0ff]">
                      <span className="font-bold flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>GenLayer Multi-Validator Quorum in Progress...</span>
                      </span>
                      <span className="text-slate-400 text-[11px]">Equivalence Principle</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                      <div className={`p-2 rounded-lg border ${adjudicationStage >= 1 ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold" : "border-slate-800 text-slate-500"}`}>
                        1. Web Render
                      </div>
                      <div className={`p-2 rounded-lg border ${adjudicationStage >= 2 ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold" : "border-slate-800 text-slate-500"}`}>
                        2. PoC Audit
                      </div>
                      <div className={`p-2 rounded-lg border ${adjudicationStage >= 3 ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold" : "border-slate-800 text-slate-500"}`}>
                        3. Equiv Quorum
                      </div>
                      <div className={`p-2 rounded-lg border ${adjudicationStage >= 4 ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold" : "border-slate-800 text-slate-500"}`}>
                        4. emit_transfer
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAdjudicateSimulation}
                  disabled={isAdjudicating}
                  className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
                >
                  {isAdjudicating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Validating PoC Across Decentralized Nodes...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{account ? "Execute resolve_bounty_report() Consensus" : "Connect Wallet to Adjudicate"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verified Adjudications Feed */}
            <div className="space-y-4" id="verified-feed">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-900" />
                  <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Verified Adjudication Certificates ({reports.length})
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Autonomous Settlement Ledger</span>
              </div>

              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs font-mono shadow-xs">
                          {report.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          +{report.payout} GEN Emitted
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{report.timestamp}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 font-sans">{report.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
                        <span>
                          Researcher:{" "}
                          <strong className="text-slate-800">
                            {report.researcher.slice(0, 6)}...{report.researcher.slice(-4)}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Confidence:{" "}
                          <strong className="text-slate-800">{report.confidenceBps / 100}%</strong>
                        </span>
                        <span>•</span>
                        <a
                          href={report.pocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          <span>View Reproduction Repo</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-sans text-slate-700 italic leading-relaxed">
                      &ldquo;{report.reasoning}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
              AegisBounty Protocol Architecture &amp; FAQ
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-slate-800">
            <div className="py-3.5">
              <button
                onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-600 transition-all"
              >
                <span>How is this completely different from traditional bug bounty platforms?</span>
                {faqOpen === 0 ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {faqOpen === 0 && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">
                  Centralized bounty platforms suffer from counterparty risk: protocol founders often downplay exploit
                  severity to withhold large payouts, while whitehats fear uncompensated disclosure. AegisBounty locks
                  the reward pool on-chain in GenLayer and executes payouts autonomously via decentralized multi-validator
                  AI consensus over live reproduction code.
                </p>
              )}
            </div>

            <div className="py-3.5">
              <button
                onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-600 transition-all"
              >
                <span>How do validators verify live proof of concept URLs?</span>
                {faqOpen === 1 ? <ChevronUp className="w-4 h-4 text-rose-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {faqOpen === 1 && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-sans">
                  Validators independently invoke <code className="text-rose-600 font-mono">gl.nondet.web.render()</code> to
                  fetch the live GitHub repository, commit diff, or Gist. The LLM evaluates the attack vector against the
                  protocol's published security charter, and the Equivalence Principle enforces exact severity agreement
                  with confidence matching within &plusmn;15%.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-mono">
        AegisBounty • Decentralized Exploit Adjudication Protocol • GenLayer StudioNet
      </footer>
    </div>
  );
}
